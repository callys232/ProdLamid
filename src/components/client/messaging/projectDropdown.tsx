"use client";

import { useEffect, useState } from "react";
import type { Escrow } from "@/types/escrow";
import { mockEscrow } from "@/mocks/mocksEscrow";

interface ProjectDocumentsDropdownProps {
  escrow: Escrow;
  isOpen: boolean;
}

interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export default function ProjectDocumentsDropdown({
  escrow,
  isOpen,
}: ProjectDocumentsDropdownProps) {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDocuments() {
      if (!isOpen) return; // only fetch when dropdown is open
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${escrow.id}/documents`);
        if (!res.ok) {
          console.warn("Documents API returned non-OK, using mock fallback");
          setDocuments(mockEscrow.documents ?? []); // ✅ fallback
          return;
        }
        const data: ProjectDocument[] = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents, using mock fallback:", err);
        setDocuments(mockEscrow.documents ?? []); // ✅ fallback
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, [isOpen, escrow.id]);

  if (!isOpen) return null;

  return (
    <div className="p-4 w-72 rounded-lg border border-red-600/40 bg-black/90 shadow-lg">
      <h3 className="text-white text-sm font-semibold mb-3">
        Project Documents
      </h3>
      {loading ? (
        <p className="text-gray-400 text-xs">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-400 text-xs">No documents uploaded yet</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-col rounded-md border border-gray-700 p-2 hover:border-[#c12129] transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-red-400">
                  {doc.name}
                </span>
                <span className="text-[10px] text-gray-500">
                  {new Date(doc.uploadedAt).toLocaleString()}
                </span>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 mt-1 hover:underline"
              >
                View Document
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
