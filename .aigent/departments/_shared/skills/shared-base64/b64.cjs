#!/usr/bin/env node
/**
 * shared-base64/b64.cjs
 *
 * Bidirectional base64 ↔ file utility.
 *
 *   decode  base64 (text in a .b64 file) → real binary/textual asset, verifying
 *           the decoded bytes match the requested format via magic-bytes.
 *   encode  any file → base64, written directly to a `.b64` text file (optionally
 *           as a `data:<mime>;base64,...` data URI), returning the path in JSON.
 *
 * Contract documented in SKILL.md alongside this file. If behavior here and prose
 * there diverge, the script is the source of truth — adjust the prose.
 *
 * No dependencies beyond Node stdlib (fs, path). Compatible with Node 18+.
 *
 * Usage:
 *   node b64.cjs decode --input <path> [--format <fmt>] [--output <path>]
 *                       [--keep-input] [--no-b64-copy]
 *   node b64.cjs encode --input <path> [--output <path.b64>] [--format <fmt>]
 *                       [--data-uri] [--emit-string]
 *
 * Back-compat: if the first argument starts with `--` (no subcommand), the
 * command defaults to `decode` — preserving the historical `decode.cjs` CLI.
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
    '  node b64.cjs decode --input <path> [--format <fmt>] [--output <path>]',
    '                      [--keep-input] [--no-b64-copy]',
    '  node b64.cjs encode --input <path> [--output <path.b64>] [--format <fmt>]',
    '                      [--data-uri] [--emit-string]',
    '',
    'Commands:',
    '  decode   base64 (.b64 under .context/.temp/) → binary/textual asset.',
    '  encode   any file → base64, written to a .b64 text file.',
    '           (default command if the first arg starts with --)',
    '',
    'decode args:',
    '  --input <path>     Path to the .b64 file. Must be under .context/.temp/.',
    '  --format <fmt>     png|jpg|jpeg|gif|webp|svg|pdf|zip. Required unless --output has a known extension.',
    '  --output <path>    Destination path. Unrestricted (typically a deliverable path).',
    '                     Default: --input with extension changed to <format> (stays in temp).',
    '  --keep-input       Do not delete the .b64 after a successful decode.',
    '  --no-b64-copy      Do not leave a .b64 copy next to the output.',
    '',
    'encode args:',
    '  --input <path>     Path to the source file to encode. Unrestricted. Must exist.',
    '  --output <path>    Destination .b64 text file. Unrestricted (point it to',
    '                     .context/.temp/<dept>/ for a transient snapshot).',
    '                     Default: --input with extension changed to .b64 (alongside).',
    '  --format <fmt>     Optional. If given, verifies the source magic bytes match',
    '                     before encoding. Else mime is inferred from the extension.',
    '  --data-uri         Prefix the .b64 content with "data:<mime>;base64,".',
    '  --emit-string      Include the full base64 string in the stdout JSON.',
    '',
    'Output: JSON to stdout. Exit 0 on success, 1 on error.',
    '',
  ].join('\n');
  process.stdout.write(text);
  process.exit(0);
}

function parseArgs(argv) {
  const out = { keepInput: false, noB64Copy: false, dataUri: false, emitString: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') { out.help = true; continue; }
    if (a === '--keep-input') { out.keepInput = true; continue; }
    if (a === '--no-b64-copy') { out.noB64Copy = true; continue; }
    if (a === '--data-uri') { out.dataUri = true; continue; }
    if (a === '--emit-string') { out.emitString = true; continue; }
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

function ensureDirRecursive(absPath) {
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
}

function ensureTempGitignoreFor(absAnyPath) {
  const tempRoot = tempRootFromAbs(absAnyPath);
  if (!tempRoot) return; // path is not under .context/.temp/, nothing to do
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

function changeExt(userPath, newExtNoDot) {
  const ext = path.extname(userPath);
  const base = ext ? userPath.substring(0, userPath.length - ext.length) : userPath;
  return base + '.' + newExtNoDot;
}

// ---------------------------------------------------------------------------
// decode: base64 .b64 file → binary/textual asset
// ---------------------------------------------------------------------------

function runDecode(args) {
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

  // Resolve output path (explicit --output wins; otherwise derive from input).
  // Output scope is unrestricted: typically the deliverable folder of the dept.
  const outputUserPath = args.output ? args.output : changeExt(args.input, format);
  const outputAbs = path.resolve(outputUserPath);

  // Derive the alongside .b64 user path (same basename as output, .b64 extension).
  const alongsideB64UserPath = changeExt(outputUserPath, 'b64');
  const alongsideB64Abs = path.resolve(alongsideB64UserPath);
  const alongsideEqualsInput = alongsideB64Abs === inputAbs;

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
    ensureDirRecursive(outputAbs);
    // Always manage the staging gitignore (input is under .context/.temp/ by contract).
    ensureTempGitignoreFor(inputAbs);
    fs.writeFileSync(outputAbs, buf);
  } catch (e) {
    emitError('WRITE_FAILED', 'Failed to write output: ' + (e && e.message ? e.message : String(e)));
  }

  // Copy .b64 alongside the output (default ON). Suppressed by --no-b64-copy.
  // If alongside path equals input, no copy is made (input already IS the
  // alongside — and below we skip deletion to preserve it).
  let b64CopyUserPath = null;
  if (!args.noB64Copy) {
    if (alongsideEqualsInput) {
      b64CopyUserPath = alongsideB64UserPath;
    } else {
      try {
        ensureDirRecursive(alongsideB64Abs);
        fs.copyFileSync(inputAbs, alongsideB64Abs);
        b64CopyUserPath = alongsideB64UserPath;
      } catch (e) {
        emitError('WRITE_FAILED', 'Failed to write .b64 alongside copy: ' + (e && e.message ? e.message : String(e)));
      }
    }
  }

  // Delete input unless --keep-input.
  // Exception: if the alongside .b64 IS the input (same path), never delete —
  // doing so would wipe the alongside copy we just promised.
  const inputIsAlongside = !args.noB64Copy && alongsideEqualsInput;
  if (!args.keepInput && !inputIsAlongside) {
    try {
      fs.unlinkSync(inputAbs);
    } catch (e) {
      // Non-fatal: warn to stderr but report success
      process.stderr.write('[WARN] Failed to delete input ' + args.input + ': ' + (e && e.message ? e.message : String(e)) + '\n');
    }
  }

  emitOk({
    op: 'decode',
    path: outputUserPath,
    bytes: buf.length,
    mime: MIME[format],
    format: format,
    b64_copy: b64CopyUserPath,
  });
}

// ---------------------------------------------------------------------------
// encode: any file → base64 written to a .b64 text file
// ---------------------------------------------------------------------------

function runEncode(args) {
  if (!args.input) emitError('BAD_ARGS', 'Missing --input');

  // Resolve and validate the source file. Input scope is unrestricted for encode.
  const inputAbs = path.resolve(args.input);
  if (!fs.existsSync(inputAbs)) {
    emitError('INPUT_NOT_FOUND', 'Input file does not exist: ' + args.input);
  }
  let stat;
  try {
    stat = fs.statSync(inputAbs);
  } catch (e) {
    emitError('INTERNAL', 'Failed to stat input: ' + (e && e.message ? e.message : String(e)));
  }
  if (!stat.isFile()) {
    emitError('BAD_ARGS', 'Input is not a regular file: ' + args.input);
  }

  // Optional format verification (symmetry with decode). If --format is given it
  // must be in the catalog and the source bytes must match its signature.
  let format = args.format || null;
  if (format && !SUPPORTED.includes(format)) {
    emitError('BAD_ARGS', "Unsupported format: '" + format + "'. Supported: " + SUPPORTED.join(', '));
  }

  // Read source bytes
  let buf;
  try {
    buf = fs.readFileSync(inputAbs);
  } catch (e) {
    emitError('INTERNAL', 'Failed to read input: ' + (e && e.message ? e.message : String(e)));
  }
  if (!buf || buf.length === 0) {
    emitError('EMPTY_INPUT', 'Source file is empty: ' + args.input);
  }

  if (format && !verifyMagic(format, buf)) {
    emitError('FORMAT_MISMATCH', "Source bytes do not match expected signature for format '" + format + "'");
  }

  // Resolve mime: explicit format wins; otherwise infer from the source extension.
  let mime;
  if (format) {
    mime = MIME[format];
  } else {
    const srcExt = path.extname(args.input).replace(/^\./, '').toLowerCase();
    mime = MIME[srcExt] || 'application/octet-stream';
    if (SUPPORTED.includes(srcExt)) format = srcExt;
  }

  // Encode
  const b64 = buf.toString('base64');
  const fileContent = args.dataUri ? ('data:' + mime + ';base64,' + b64) : b64;

  // Resolve output .b64 path (explicit --output wins; otherwise alongside input).
  const outputUserPath = args.output ? args.output : changeExt(args.input, 'b64');
  const outputAbs = path.resolve(outputUserPath);

  // Write the .b64 text file. If the output lands under .context/.temp/, manage
  // the staging gitignore too.
  try {
    ensureDirRecursive(outputAbs);
    ensureTempGitignoreFor(outputAbs);
    fs.writeFileSync(outputAbs, fileContent);
  } catch (e) {
    emitError('WRITE_FAILED', 'Failed to write .b64 output: ' + (e && e.message ? e.message : String(e)));
  }

  emitOk({
    op: 'encode',
    b64_path: outputUserPath,
    source_path: args.input,
    source_bytes: buf.length,
    b64_chars: fileContent.length,
    mime: mime,
    format: format,
    data_uri: !!args.dataUri,
    base64: args.emitString ? fileContent : null,
  });
}

// ---------------------------------------------------------------------------

function main() {
  const argv = process.argv.slice(2);

  // Help with no command.
  if (argv.length === 0) help();
  if (argv[0] === '--help' || argv[0] === '-h') help();

  // Resolve command. Back-compat: a leading `--` means no subcommand → decode.
  let command;
  let rest;
  if (argv[0] === 'decode' || argv[0] === 'encode') {
    command = argv[0];
    rest = argv.slice(1);
  } else if (argv[0].startsWith('--')) {
    command = 'decode';
    rest = argv;
  } else {
    emitError('BAD_ARGS', "Unknown command: '" + argv[0] + "'. Expected 'decode' or 'encode'.");
  }

  const args = parseArgs(rest);
  if (args.help) help();

  if (command === 'decode') runDecode(args);
  else runEncode(args);
}

try {
  main();
} catch (e) {
  emitError('INTERNAL', e && e.message ? e.message : String(e));
}
