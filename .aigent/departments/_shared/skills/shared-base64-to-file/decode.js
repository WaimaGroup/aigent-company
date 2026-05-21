#!/usr/bin/env node
/**
 * shared-base64-to-file/decode.js
 *
 * Decode a base64 file into a binary/textual asset under `.context/.temp/<dept>/`,
 * verifying that the decoded bytes match the requested format via magic-bytes
 * inspection (or initial UTF-8 content for SVG).
 *
 * Contract documented in SKILL.md alongside this file. If behavior here and prose
 * there diverge, the script is the source of truth — adjust the prose.
 *
 * No dependencies beyond Node stdlib. Compatible with Node 18+.
 *
 * Usage:
 *   node decode.js --input <path> [--format <fmt>] [--output <path>] [--keep-input]
 *
 * Exit codes:
 *   0 = success (JSON `{ ok: true, ... }` on stdout)
 *   1 = error   (JSON `{ ok: false, error: {...} }` on stdout + human line on stderr)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SUPPORTED = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'zip'];

const MAGIC = {
  png:  [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  jpg:  [0xFF, 0xD8, 0xFF],
  jpeg: [0xFF, 0xD8, 0xFF],
  gif:  [0x47, 0x49, 0x46, 0x38], // "GIF8" — covers GIF87a and GIF89a
  pdf:  [0x25, 0x50, 0x44, 0x46], // "%PDF"
  zip:  [0x50, 0x4B, 0x03, 0x04], // "PK\x03\x04"
};

const MIME = {
  png:  'image/png',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  gif:  'image/gif',
  webp: 'image/webp',
  svg:  'image/svg+xml',
  pdf:  'application/pdf',
  zip:  'application/zip',
};

// ---------------------------------------------------------------------------

function emitError(code, message) {
  const payload = { ok: false, error: { code, message } };
  process.stdout.write(JSON.stringify(payload) + '\n');
  process.stderr.write('[ERROR ' + code + '] ' + message + '\n');
  process.exit(1);
}

function emitOk(data) {
  process.stdout.write(JSON.stringify(Object.assign({ ok: true }, data)) + '\n');
  process.exit(0);
}

function help() {
  const text = [
    'Usage:',
    '  node decode.js --input <path> [--format <fmt>] [--output <path>] [--keep-input]',
    '',
    'Args:',
    '  --input <path>     Path to the .b64 file. Must be under .context/.temp/.',
    '  --format <fmt>     png|jpg|jpeg|gif|webp|svg|pdf|zip. Required unless --output has a known extension.',
    '  --output <path>    Destination path. Must be under .context/.temp/. Default: --input with extension changed to <format>.',
    '  --keep-input       Do not delete the .b64 after a successful decode.',
    '  --help, -h         Show this help.',
    '',
    'Output: JSON to stdout. Exit 0 on success, 1 on error.',
    '',
  ].join('\n');
  process.stdout.write(text);
  process.exit(0);
}

function parseArgs(argv) {
  const out = { keepInput: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { out.help = true; continue; }
    if (a === '--keep-input') { out.keepInput = true; continue; }
    if (!a.startsWith('--')) {
      emitError('BAD_ARGS', "Unexpected positional argument: '" + a + "'");
    }
    const eq = a.indexOf('=');
    let key, val;
    if (eq !== -1) {
      key = a.substring(2, eq);
      val = a.substring(eq + 1);
    } else {
      key = a.substring(2);
      val = argv[++i];
    }
    if (val === undefined || val === null) {
      emitError('BAD_ARGS', "Missing value for --" + key);
    }
    if (key === 'input') out.input = val;
    else if (key === 'output') out.output = val;
    else if (key === 'format') out.format = String(val).toLowerCase();
    else emitError('BAD_ARGS', "Unknown argument: --" + key);
  }
  return out;
}

// ---------------------------------------------------------------------------

function toForwardSlashes(p) {
  return p.replace(/\\/g, '/');
}

function isUnderTempScope(absPath) {
  return toForwardSlashes(absPath).includes('/.context/.temp/');
}

function tempRootFromAbs(absPath) {
  const fwd = toForwardSlashes(absPath);
  const marker = '/.context/.temp/';
  const idx = fwd.indexOf(marker);
  if (idx === -1) return null;
  // Return native-separator path up to and including .context/.temp
  return path.normalize(fwd.substring(0, idx + marker.length - 1));
}

function ensureDirAndGitignore(absOutput) {
  fs.mkdirSync(path.dirname(absOutput), { recursive: true });
  const tempRoot = tempRootFromAbs(absOutput);
  if (!tempRoot) return; // should never happen (already scope-checked)
  const gitignorePath = path.join(tempRoot, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '*\n');
  }
}

function verifyMagic(format, buf) {
  if (format === 'svg') {
    const head = buf.slice(0, 256).toString('utf8').trimStart().toLowerCase();
    return head.startsWith('<?xml') || head.startsWith('<svg');
  }
  if (format === 'webp') {
    if (buf.length < 12) return false;
    const riff = buf.slice(0, 4).toString('ascii');
    const webp = buf.slice(8, 12).toString('ascii');
    return riff === 'RIFF' && webp === 'WEBP';
  }
  const expected = MAGIC[format];
  if (!expected) return false;
  if (buf.length < expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (buf[i] !== expected[i]) return false;
  }
  return true;
}

function deriveOutputUserPath(inputUserPath, format) {
  const ext = path.extname(inputUserPath);
  const base = ext ? inputUserPath.substring(0, inputUserPath.length - ext.length) : inputUserPath;
  return base + '.' + format;
}

// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) help();

  if (!args.input) emitError('BAD_ARGS', 'Missing --input');

  // Resolve format (explicit --format wins; otherwise derive from --output extension)
  let format = args.format;
  if (!format && args.output) {
    const oext = path.extname(args.output);
    if (oext) format = oext.substring(1).toLowerCase();
  }
  if (!format) {
    emitError('MISSING_FORMAT', 'Could not infer format. Provide --format or pass --output with a known extension.');
  }
  if (!SUPPORTED.includes(format)) {
    emitError('BAD_ARGS', "Unsupported format: '" + format + "'. Supported: " + SUPPORTED.join(', '));
  }

  // Resolve and validate input path
  const inputAbs = path.resolve(args.input);
  if (!isUnderTempScope(inputAbs)) {
    emitError('INPUT_OUT_OF_SCOPE', 'Input must be under .context/.temp/: ' + args.input);
  }
  if (!fs.existsSync(inputAbs)) {
    emitError('INPUT_NOT_FOUND', 'Input file does not exist: ' + args.input);
  }

  // Resolve output path (explicit --output wins; otherwise derive from input)
  const outputUserPath = args.output ? args.output : deriveOutputUserPath(args.input, format);
  const outputAbs = path.resolve(outputUserPath);
  if (!isUnderTempScope(outputAbs)) {
    emitError('OUTPUT_OUT_OF_SCOPE', 'Output must be under .context/.temp/: ' + outputUserPath);
  }

  // Read base64
  let raw;
  try {
    raw = fs.readFileSync(inputAbs, 'utf8');
  } catch (e) {
    emitError('INTERNAL', 'Failed to read input: ' + (e && e.message ? e.message : String(e)));
  }

  // Validate base64 shape (after stripping whitespace)
  const stripped = raw.replace(/\s+/g, '');
  if (stripped.length === 0) {
    emitError('BAD_BASE64', 'Input is empty after whitespace strip');
  }
  if (!/^[A-Za-z0-9+/]+=*$/.test(stripped)) {
    emitError('BAD_BASE64', 'Input does not look like standard base64 (only A-Z, a-z, 0-9, +, /, = allowed)');
  }

  // Decode
  let buf;
  try {
    buf = Buffer.from(stripped, 'base64');
  } catch (e) {
    emitError('BAD_BASE64', 'Decode failed: ' + (e && e.message ? e.message : String(e)));
  }
  if (!buf || buf.length === 0) {
    emitError('EMPTY_DECODE', 'Decoded buffer is empty');
  }

  // Verify magic bytes / textual signature
  if (!verifyMagic(format, buf)) {
    emitError('FORMAT_MISMATCH', "Decoded bytes do not match expected signature for format '" + format + "'");
  }

  // Write output
  try {
    ensureDirAndGitignore(outputAbs);
    fs.writeFileSync(outputAbs, buf);
  } catch (e) {
    emitError('WRITE_FAILED', 'Failed to write output: ' + (e && e.message ? e.message : String(e)));
  }

  // Delete input unless --keep-input
  if (!args.keepInput) {
    try {
      fs.unlinkSync(inputAbs);
    } catch (e) {
      // Non-fatal: warn to stderr but report success
      process.stderr.write('[WARN] Failed to delete input ' + args.input + ': ' + (e && e.message ? e.message : String(e)) + '\n');
    }
  }

  emitOk({
    path: outputUserPath,
    bytes: buf.length,
    mime: MIME[format],
    format: format,
  });
}

try {
  main();
} catch (e) {
  emitError('INTERNAL', e && e.message ? e.message : String(e));
}
