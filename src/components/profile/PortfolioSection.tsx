"use client";

import { useEffect, useState, useRef } from "react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  projectUrl?: string;
  tags: string[];
  completedAt: string;
  clientName?: string;
}

interface Props {
  userId: string;
}

const CATEGORIES = [
  "Software Development",
  "Design",
  "Marketing",
  "Consulting",
  "Data & Analytics",
  "Finance",
  "Legal",
  "Operations",
  "Other",
];

const GRADIENT_PLACEHOLDERS = [
  "from-[#C12129] to-gray-900",
  "from-purple-900 to-gray-900",
  "from-blue-900 to-gray-900",
  "from-emerald-900 to-gray-900",
  "from-amber-900 to-gray-900",
  "from-indigo-900 to-gray-900",
];

function storageKey(userId: string) {
  return `portfolio_${userId}`;
}

function loadItems(userId: string): PortfolioItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(storageKey(userId)) ?? "[]");
  } catch {
    return [];
  }
}

function saveItems(userId: string, items: PortfolioItem[]) {
  localStorage.setItem(storageKey(userId), JSON.stringify(items));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const EMPTY_FORM: Omit<PortfolioItem, "id"> = {
  title: "",
  description: "",
  category: CATEGORIES[0],
  imageUrl: "",
  projectUrl: "",
  tags: [],
  completedAt: new Date().toISOString().slice(0, 10),
  clientName: "",
};

export default function PortfolioSection({ userId }: Props) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<PortfolioItem, "id">>(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(loadItems(userId));
  }, [userId]);

  // Close modal on outside click
  useEffect(() => {
    if (!showModal) return;
    function handle(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        closeModal();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [showModal]);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setTagInput("");
    setShowModal(true);
  }

  function openEdit(item: PortfolioItem) {
    setEditId(item.id);
    setForm({ ...item });
    setTagInput("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setTagInput("");
  }

  function handleSave() {
    if (!form.title.trim()) return;
    let updated: PortfolioItem[];
    if (editId) {
      updated = items.map((it) => (it.id === editId ? { ...form, id: editId } : it));
    } else {
      updated = [...items, { ...form, id: uid() }];
    }
    setItems(updated);
    saveItems(userId, updated);
    closeModal();
  }

  function handleDelete(id: string) {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    saveItems(userId, updated);
    setDeleteConfirm(null);
  }

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  async function handleImport() {
    setImporting(true);
    setImportMsg(null);
    try {
      const res = await fetch("/api/projects?role=consultant&status=completed");
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      const existing = loadItems(userId);
      const existingTitles = new Set(existing.map((i) => i.title));
      const newItems: PortfolioItem[] = (json.data ?? [])
        .filter((p: any) => !existingTitles.has(p.title))
        .map((p: any) => ({
          id: uid(),
          title: p.title ?? "Untitled Project",
          description: p.description ?? "",
          category: p.category ?? "Other",
          imageUrl: "",
          projectUrl: "",
          tags: p.skills ?? [],
          completedAt: p.updatedAt ? p.updatedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
          clientName: "",
        }));
      if (newItems.length === 0) {
        setImportMsg("No new completed projects to import.");
      } else {
        const merged = [...existing, ...newItems];
        setItems(merged);
        saveItems(userId, merged);
        setImportMsg(`Imported ${newItems.length} project${newItems.length !== 1 ? "s" : ""}.`);
      }
    } catch {
      setImportMsg("Could not import projects. Please try again.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Portfolio</h2>
          <p className="text-sm text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""} showcased</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="rounded-xl px-4 py-2 text-sm font-semibold border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition disabled:opacity-50"
          >
            {importing ? "Importing…" : "Import from Projects"}
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-[#C12129] text-white hover:bg-red-700 transition"
          >
            + Add Portfolio Item
          </button>
        </div>
      </div>

      {importMsg && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-gray-300">
          {importMsg}
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-3">🗂️</p>
          <p className="text-gray-400 text-sm">Your portfolio is empty. Add your first item or import from completed projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <PortfolioCard
              key={item.id}
              item={item}
              gradient={GRADIENT_PLACEHOLDERS[idx % GRADIENT_PLACEHOLDERS.length]}
              onEdit={() => openEdit(item)}
              onDelete={() => setDeleteConfirm(item.id)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold mb-2">Remove portfolio item?</h3>
            <p className="text-gray-400 text-sm mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold border border-gray-700 text-gray-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-red-700 text-white hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-white font-bold text-lg mb-5">
              {editId ? "Edit Portfolio Item" : "Add Portfolio Item"}
            </h3>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Title *</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C12129]"
                  placeholder="e.g. E-commerce platform redesign"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C12129] resize-none"
                  placeholder="Describe what you built, your role, and the impact…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Category</label>
                <select
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#C12129]"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Tags</label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C12129]"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  />
                  <button type="button" onClick={addTag} className="rounded-xl px-3 py-2 text-sm font-semibold bg-gray-700 text-white hover:bg-gray-600 transition">
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-400 ml-1">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Image URL (optional)</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C12129]"
                  placeholder="https://…"
                  value={form.imageUrl ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                />
              </div>

              {/* Project URL */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Project URL (optional)</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C12129]"
                  placeholder="https://…"
                  value={form.projectUrl ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, projectUrl: e.target.value }))}
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Client Name (optional)</label>
                <input
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C12129]"
                  placeholder="e.g. Acme Corp"
                  value={form.clientName ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Completed Date</label>
                <input
                  type="date"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#C12129]"
                  value={form.completedAt}
                  onChange={(e) => setForm((f) => ({ ...f, completedAt: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl px-4 py-2 text-sm font-semibold border border-gray-700 text-gray-300 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-[#C12129] text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {editId ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortfolioCard({
  item,
  gradient,
  onEdit,
  onDelete,
}: {
  item: PortfolioItem;
  gradient: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className={`h-36 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl opacity-30">🗂️</span>
        )}
        <span className="absolute top-2 right-2 text-xs bg-black/50 text-gray-300 px-2 py-0.5 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{item.title}</h3>
        {item.clientName && (
          <p className="text-xs text-gray-500 mb-1">Client: {item.clientName}</p>
        )}
        <p className="text-gray-400 text-xs line-clamp-2 flex-1 mb-3">{item.description || "No description provided."}</p>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
            {item.tags.length > 4 && (
              <span className="text-xs text-gray-600">+{item.tags.length - 4} more</span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          {item.projectUrl && (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl px-3 py-1.5 text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white text-center transition"
            >
              View
            </a>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 rounded-xl px-3 py-1.5 text-xs font-semibold bg-gray-800 text-gray-300 hover:text-white transition"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold bg-gray-800 text-red-400 hover:text-red-300 transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
