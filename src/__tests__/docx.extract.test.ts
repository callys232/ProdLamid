import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { parseInSandbox } from "@/lib/ai/sandboxedParse";

/**
 * DOCX extraction, proved against a real document.
 *
 * pdf-parse v2 changed its API and every PDF silently read as unreadable —
 * the tests did not catch it because they only asserted failure. mammoth had
 * exactly the same exposure until this file existed.
 */

/** Builds the minimum a .docx needs for mammoth to read it. */
async function buildDocx(paragraphs: string[]): Promise<Buffer> {
  const zip = new JSZip();

  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
     <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
       <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
       <Default Extension="xml" ContentType="application/xml"/>
       <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
     </Types>`,
  );

  zip.folder("_rels")!.file(
    ".rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
     <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
       <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
     </Relationships>`,
  );

  const body = paragraphs
    .map((t) => `<w:p><w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`)
    .join("");

  zip.folder("word")!.file(
    "document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
     <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
       <w:body>${body}</w:body>
     </w:document>`,
  );

  return zip.generateAsync({ type: "nodebuffer" });
}

describe("DOCX extraction", () => {
  it("actually extracts text from a real .docx", async () => {
    const docx = await buildDocx(["Milestone two deliverable.", "Findings and recommendations."]);
    const r = await parseInSandbox(docx, "docx");

    expect(r.ok).toBe(true);
    expect(r.text).toContain("Milestone two deliverable");
    expect(r.text).toContain("Findings and recommendations");
  }, 30_000);

  it("preserves paragraph separation rather than running text together", async () => {
    const docx = await buildDocx(["First para.", "Second para."]);
    const { text } = await parseInSandbox(docx, "docx");
    expect(text).toMatch(/First para\.\s*\n\s*Second para\./);
  }, 30_000);

  it("reports an empty document as producing no text", async () => {
    const { ok, text } = await parseInSandbox(await buildDocx([]), "docx");
    // An empty file must not read as successfully delivered work.
    expect(ok && text.trim().length > 0).toBe(false);
  }, 30_000);

  it("rejects a zip that is not a Word document", async () => {
    const zip = new JSZip();
    zip.file("hello.txt", "not a docx");
    const r = await parseInSandbox(await zip.generateAsync({ type: "nodebuffer" }), "docx");
    expect(r.ok).toBe(false);
  }, 30_000);
});
