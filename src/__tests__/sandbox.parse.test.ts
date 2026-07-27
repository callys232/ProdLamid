import { describe, it, expect } from "vitest";
import { parseInSandbox } from "@/lib/ai/sandboxedParse";

/**
 * These run the real worker. The point is not that parsing succeeds — it is
 * that a hostile file cannot take the process down with it.
 */
/** Smallest valid one-page PDF containing the word "Hello". */
const HELLO_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
  "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
  "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n" +
  "4 0 obj<</Length 44>>stream\nBT /F1 24 Tf 20 100 Td (Hello) Tj ET\nendstream endobj\n" +
  "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n" +
  "trailer<</Root 1 0 R>>\n%%EOF", "latin1");

describe("sandboxed parsing", () => {
  it("actually extracts text from a real PDF", async () => {
    // Guards the v2 API: pdf-parse exports a PDFParse class, not a callable.
    // Calling it as a function failed silently and every file read as unreadable.
    const r = await parseInSandbox(HELLO_PDF, "pdf");
    expect(r.ok).toBe(true);
    expect(r.text).toContain("Hello");
  }, 30_000);

  it("rejects a malformed PDF without throwing into the caller", async () => {
    const junk = Buffer.from("%PDF-1.4\nnot actually a pdf at all\n%%EOF");
    const r = await parseInSandbox(junk, "pdf");
    expect(r.ok).toBe(false);
    expect(typeof r.error).toBe("string");
  }, 30_000);

  it("rejects a malformed DOCX without throwing into the caller", async () => {
    const r = await parseInSandbox(Buffer.from("PK\u0003\u0004 corrupt"), "docx");
    expect(r.ok).toBe(false);
  }, 30_000);

  it("survives random binary input", async () => {
    const noise = Buffer.from(Array.from({ length: 4096 }, () => Math.floor(Math.random() * 256)));
    const r = await parseInSandbox(noise, "pdf");
    expect(r.ok).toBe(false);
    expect(r.text).toBe("");
  }, 30_000);

  it("keeps the parent process alive across repeated hostile input", async () => {
    // If a bad document could kill the host, this loop would not finish.
    for (let i = 0; i < 5; i++) {
      const r = await parseInSandbox(Buffer.from(`garbage-${i}`), "pdf");
      expect(r.ok).toBe(false);
    }
    expect(process.pid).toBeGreaterThan(0);
  }, 60_000);

  it("never resolves with text it did not actually extract", async () => {
    const r = await parseInSandbox(Buffer.from("garbage"), "docx");
    expect(r.text).toBe("");
  }, 30_000);
});
