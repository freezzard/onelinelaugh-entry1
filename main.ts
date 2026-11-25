// onelinelaugh-entry1 — "One Line, One Laugh"
// ---------------------------------------------------------------
// Program ini menulis SATU baris lucu ke /output/entry.txt.
// Jaminan program: deterministik (dua run = byte sama persis),
// tanpa network, tanpa membaca berkas lain, tanpa angka acak.
// Gerbang RULES.txt yang dijaga di dalam program, sebelum dan
// sesudah menulis:
//   - teks UTF-8, 1 sampai 140 karakter (dihitung per code point)
//   - satu baris utuh, tanpa newline di tengah maupun di ujung
//   - bukan hanya whitespace
//   - sesudah menulis, file dibaca ulang dan dibandingkan byte
//     demi byte dengan baris yang diniatkan.
//
// Leluconnya hidup dalam satu objek beku bernama: tiap frasa
// punya peran yang bisa dibaca — tokoh disiapkan, jeda menahan
// napas, lalu putaran menutup dengan kejutan di kata terakhir.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// -----------------------------------------------------------------
// Konstanta gerbang (sesuai RULES.txt kompetisi).
// -----------------------------------------------------------------

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 140;
const TEXT_ENCODING = "utf8";

// -----------------------------------------------------------------
// Lelucon: satu objek beku, tiga frasa bernama.
// -----------------------------------------------------------------

const laughBlueprint = Object.freeze({
  setupSubject: "My AI assistant asked for a day off,",
  setupConcession: "so I gave it one",
  punchTurn: "it spent it training my replacement.",
});

const WORD_GLUE = " ";
const TURN_GLUE = " \u2014 ";

// -----------------------------------------------------------------
// Perakit baris dari cetak biru: subjek + konsesi disambung
// spasi, lalu putaran disambung dengan em dash.
// -----------------------------------------------------------------

function buildLaughLine(): string {
  const setupClause = [laughBlueprint.setupSubject, laughBlueprint.setupConcession].join(
    WORD_GLUE,
  );
  const builtLine = [setupClause, laughBlueprint.punchTurn].join(TURN_GLUE);
  return builtLine;
}

// -----------------------------------------------------------------
// Normalisasi deterministik: spasi ganda dilipat jadi satu dan
// spasi ujung dipangkas. Baris yang sudah rapi tidak berubah.
// -----------------------------------------------------------------

function polishLaughLine(rawLine: string): string {
  const singleSpaced = rawLine.replace(/ {2,}/g, WORD_GLUE);
  const polishedLine = singleSpaced.trim();
  return polishedLine;
}

// -----------------------------------------------------------------
// Pengukur: karakter per code point dan byte UTF-8, untuk cek
// silang bahwa keduanya konsisten dengan teks yang sama.
// -----------------------------------------------------------------

function measureText(textValue: string): { chars: number; bytes: number } {
  const codePointList = [...textValue];
  const charCount = codePointList.length;
  const byteCount = Buffer.byteLength(textValue, TEXT_ENCODING);
  const measurement = { chars: charCount, bytes: byteCount };
  return measurement;
}

// -----------------------------------------------------------------
// Gerbang: satu objek penilai yang mengumpulkan pelanggaran
// bernama. Tiap penilai mengembalikan string kosong bila lolos.
// -----------------------------------------------------------------

const laughGate = {
  assessLength(textValue: string): string {
    const measured = measureText(textValue);
    const underMinimum = measured.chars < MIN_CHARS;
    if (underMinimum) {
      return `too short: ${measured.chars} chars, minimum ${MIN_CHARS}`;
    }
    const overMaximum = measured.chars > MAX_CHARS;
    if (overMaximum) {
      return `too long: ${measured.chars} chars, maximum ${MAX_CHARS}`;
    }
    const clearMark = "";
    return clearMark;
  },

  assessBlankness(textValue: string): string {
    const strippedValue = textValue.trim();
    const blankDetected = strippedValue.length === 0;
    if (blankDetected) {
      return "holds only whitespace";
    }
    const clearMark = "";
    return clearMark;
  },

  assessLineShape(textValue: string): string {
    const newlinePresent = textValue.includes("\n");
    const carriagePresent = textValue.includes("\r");
    const tabPresent = textValue.includes("\t");
    const splitDetected = newlinePresent || carriagePresent || tabPresent;
    if (splitDetected) {
      return "must stay a single line";
    }
    const clearMark = "";
    return clearMark;
  },

  assessAll(candidateLine: string): string[] {
    const lengthVerdict = laughGate.assessLength(candidateLine);
    const blankVerdict = laughGate.assessBlankness(candidateLine);
    const shapeVerdict = laughGate.assessLineShape(candidateLine);
    const verdictList = [lengthVerdict, blankVerdict, shapeVerdict];
    const failureList = verdictList.filter((verdictEntry) => verdictEntry !== "");
    return failureList;
  },
};

function enforceLaughGate(candidateLine: string): void {
  const failureList = laughGate.assessAll(candidateLine);
  const gateBreached = failureList.length > 0;
  if (gateBreached) {
    const failureReport = failureList.join("; ");
    throw new Error(`laugh line failed gate: ${failureReport}`);
  }
}

// -----------------------------------------------------------------
// Penyimpanan dan pembacaan kembali file entri.
// -----------------------------------------------------------------

function saveEntryFile(finalLine: string): void {
  const parentFolder = dirname(OUTPUT_PATH);
  mkdirSync(parentFolder, { recursive: true });
  writeFileSync(OUTPUT_PATH, finalLine, { encoding: TEXT_ENCODING });
}

function fetchEntryBack(): string {
  const storedText = readFileSync(OUTPUT_PATH, { encoding: TEXT_ENCODING });
  return storedText;
}

function digestHex(textValue: string): string {
  const digestMaker = createHash("sha256");
  digestMaker.update(textValue, TEXT_ENCODING);
  const hexResult = digestMaker.digest("hex");
  return hexResult;
}

// -----------------------------------------------------------------
// Verifikasi pasca-tulis: isi file harus sama persis dengan baris
// yang diniatkan; selisih apa pun menggagalkan jalan ini.
// -----------------------------------------------------------------

function confirmSavedEntry(intendedLine: string): string {
  const storedLine = fetchEntryBack();
  const byteIdentical = storedLine === intendedLine;
  if (byteIdentical === false) {
    throw new Error("written entry differs from intended line");
  }
  const storedDigest = digestHex(storedLine);
  return storedDigest;
}

// -----------------------------------------------------------------
// Laporan ringkas ke stdout supaya dua run bisa dibandingkan.
// -----------------------------------------------------------------

function announceOutcome(finalLine: string, storedDigest: string): void {
  const measured = measureText(finalLine);
  console.log(`wrote ${OUTPUT_PATH}`);
  console.log(`chars: ${measured.chars}`);
  console.log(`bytes: ${measured.bytes}`);
  console.log(`sha256: ${storedDigest}`);
  console.log(`line: ${finalLine}`);
}

// -----------------------------------------------------------------
// Alur utama: rakit, poles, jaga gerbang, simpan, verifikasi.
// -----------------------------------------------------------------

function runEntryWriter(): void {
  const draftedLine = buildLaughLine();
  const finalLine = polishLaughLine(draftedLine);
  enforceLaughGate(finalLine);
  saveEntryFile(finalLine);
  const storedDigest = confirmSavedEntry(finalLine);
  announceOutcome(finalLine, storedDigest);
}

try { runEntryWriter(); } catch (caughtFault) {
  const faultText =
    caughtFault instanceof Error ? caughtFault.message : String(caughtFault);
  console.error(`entry writer failed: ${faultText}`);
  process.exit(1);
}
