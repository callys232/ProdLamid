"use client";

import { useState } from "react";
import { ClientProfile, Consultant } from "@/types/client";
import ConsultantForm from "./addTeam";

interface ClientTeamSettingsProps {
  client: ClientProfile;
  onUpdate?: (consultants: Consultant[]) => void;
}

export default function ClientTeamSettings({
  client,
  onUpdate,
}: ClientTeamSettingsProps) {
  const [consultants, setConsultants] = useState<Consultant[]>(
    client.consultants
  );
  const [activeConsultant, setActiveConsultant] = useState<Consultant | null>(
    client.consultants.length > 0 ? client.consultants[0] : null
  );
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editConsultant, setEditConsultant] = useState<
    Consultant | undefined
  >();

  const filteredConsultants = consultants.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateConsultants = (next: Consultant[]) => {
    setConsultants(next);
    onUpdate?.(next);
  };

  const handleRemoveConsultant = (id: string) => {
    updateConsultants(consultants.filter((c) => c.id !== id));
    if (activeConsultant?.id === id) setActiveConsultant(null);
  };

  const notifyTeam = (projectId: string) => {
    const project = client.projects.find((p) => p.id === projectId);
    if (project) {
      alert(`Notified all team members for project: ${project.title}`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-64 bg-gray-900 border border-gray-800 rounded-md p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4">Consultants</h2>
          <input
            type="text"
            placeholder="Search consultants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 text-white px-3 py-2"
          />
          <ul className="space-y-2">
            {filteredConsultants.map((consultant) => (
              <li
                key={consultant.id}
                className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center ${
                  activeConsultant?.id === consultant.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <span onClick={() => setActiveConsultant(consultant)}>
                  {consultant.name}
                </span>
                <button
                  onClick={() => {
                    setEditConsultant(consultant);
                    setShowForm(true);
                  }}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                >
                  Edit
                </button>
              </li>
            ))}
            {filteredConsultants.length === 0 && (
              <li className="text-sm text-gray-400">No consultants found</li>
            )}
          </ul>
        </div>
        <button
          onClick={() => {
            setEditConsultant(undefined);
            setShowForm(true);
          }}
          className="mt-6 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          + Add Consultant
        </button>
      </aside>

      {/* MIDDLE PANEL */}
      <main className="flex-1 bg-gray-900 border border-gray-800 rounded-md p-6">
        {activeConsultant ? (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              {activeConsultant.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Industry</p>
                <p className="font-medium">{activeConsultant.industry}</p>
                <p className="text-sm text-gray-400">Delivery Style</p>
                <p className="font-medium">{activeConsultant.delivery}</p>
                <p className="text-sm text-gray-400">Rate</p>
                <p className="font-medium">{activeConsultant.rate}</p>
                <p className="text-sm text-gray-400">Role</p>
                <p className="font-medium">{activeConsultant.role ?? "—"}</p>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">Rating</p>
                <p className="font-medium">{activeConsultant.rating} / 5</p>
                <p className="text-sm text-gray-400">Experience</p>
                <p className="font-medium">
                  {activeConsultant.experience ?? "N/A"} years
                </p>
                {activeConsultant.image && (
                  <img
                    src={activeConsultant.image}
                    alt={activeConsultant.name}
                    className="w-24 h-24 rounded-full object-cover border border-gray-700"
                  />
                )}
              </div>
            </div>

            {/* Related Projects */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Related Projects</p>
              <ul className="space-y-2">
                {client.projects
                  .filter((p) =>
                    p.consultants?.some((c) =>
                      typeof c === "string"
                        ? c === activeConsultant.id
                        : c.id === activeConsultant.id
                    )
                  )
                  .map((proj) => (
                    <li
                      key={proj.id || proj._id}
                      className="bg-gray-800 px-3 py-2 rounded-md flex justify-between items-center"
                    >
                      <span>{proj.title}</span>
                      {proj.id && (
                        <button
                          onClick={() => notifyTeam(proj.id!)}
                          className="text-xs bg-blue-600 px-2 py-1 rounded text-white hover:bg-blue-700"
                        >
                          Notify Team
                        </button>
                      )}
                    </li>
                  ))}
                {client.projects.length === 0 && (
                  <li className="text-sm text-gray-400">
                    No projects for this client
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={() => handleRemoveConsultant(activeConsultant.id)}
              className="mt-6 px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-800"
            >
              Remove Consultant
            </button>
          </>
        ) : (
          <p className="text-gray-400">Select a consultant to view details.</p>
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-full lg:w-64 bg-gray-900 border border-gray-800 rounded-md p-4">
        <h3 className="text-lg font-medium mb-4">Client Info</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-gray-400">Client Name:</span>{" "}
            <span className="font-medium">{client.name}</span>
          </li>
          <li>
            <span className="text-gray-400">Company:</span>{" "}
            <span className="font-medium">{client.companyname}</span>
          </li>
          <li>
            <span className="text-gray-400">Industry:</span>{" "}
            <span className="font-medium">{client.industry}</span>
          </li>
          <li>
            <span className="text-gray-400">Location:</span>{" "}
            <span className="font-medium">{client.location}</span>
          </li>
        </ul>
      </aside>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <ConsultantForm
            initialData={editConsultant}
            onSubmit={(consultant) => {
              if (editConsultant) {
                // update existing
                setConsultants((prev) =>
                  prev.map((c) => (c.id === consultant.id ? consultant : c))
                );
                if (activeConsultant?.id === consultant.id) {
                  setActiveConsultant(consultant);
                }
              } else {
                // add new
                setConsultants((prev) => [...prev, consultant]);
              }
              setShowForm(false);
              onUpdate?.(consultants); // sync with parent if provided
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
