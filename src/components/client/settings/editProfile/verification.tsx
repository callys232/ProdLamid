// components/profileSteps/StepVerification.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-hot-toast";
import clsx from "clsx";
import { AiOutlineUpload, AiOutlineInfoCircle } from "react-icons/ai";

interface FileItem {
    name: string;
    url: string;
    type: string;
}

interface StepVerificationProps { }

export default function StepVerification({ }: StepVerificationProps) {
    const { setValue, getValues } = useFormContext<any>();
    const [identityFile, setIdentityFile] = useState<FileItem | null>(getValues("verification.identity") || null);
    const [certs, setCerts] = useState<FileItem[]>(getValues("verification.certifications") || []);
    const [workProofs, setWorkProofs] = useState<FileItem[]>(getValues("verification.workProof") || []);
    const [uploading, setUploading] = useState(false);

    const uploadFile = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (!data.success) throw new Error("Upload failed");

            return { name: file.name, url: data.url, type: file.type };
        } catch (err: any) {
            toast.error(err.message || "Upload error ❌");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleIdentity = async (file: File) => {
        const uploaded = await uploadFile(file);
        if (!uploaded) return;
        setIdentityFile(uploaded);
        setValue("verification.identity", uploaded);
    };

    const handleCert = async (file: File) => {
        const uploaded = await uploadFile(file);
        if (!uploaded) return;
        const updated = [...certs, uploaded];
        setCerts(updated);
        setValue("verification.certifications", updated);
    };

    const handleWorkProof = async (file: File) => {
        const uploaded = await uploadFile(file);
        if (!uploaded) return;
        const updated = [...workProofs, uploaded];
        setWorkProofs(updated);
        setValue("verification.workProof", updated);
    };

    return (
        <div className="space-y-6">
            {/* Identity Section */}
            <section className="bg-black/80 rounded-xl p-5 shadow-lg hover:shadow-xl transition relative">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                    Identity Verification <AiOutlineInfoCircle className="text-gray-400" title="Upload government-issued ID" />
                </h3>
                <div
                    className={clsx(
                        "border-2 border-dashed border-gray-600 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer transition hover:border-red-600 hover:bg-gray-900/50",
                        uploading && "opacity-50 pointer-events-none"
                    )}
                    onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = ".png,.jpg,.jpeg,.pdf";
                        input.onchange = async (e: any) => {
                            const file = e.target.files[0];
                            if (file) await handleIdentity(file);
                        };
                        input.click();
                    }}
                >
                    <AiOutlineUpload className="text-red-600 w-10 h-10 mb-2" />
                    <p className="text-gray-400 text-sm">{identityFile ? identityFile.name : "Drag & drop or click to upload ID"}</p>
                </div>
            </section>

            {/* Certifications */}
            <section className="bg-black/80 rounded-xl p-5 shadow-lg hover:shadow-xl transition relative">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                    Certifications <AiOutlineInfoCircle className="text-gray-400" title="Upload certifications or diplomas" />
                </h3>
                <div className="flex flex-wrap gap-3">
                    {certs.map((c, i) => (
                        <span
                            key={i}
                            className="bg-gray-900/70 px-3 py-1 rounded-md shadow hover:shadow-lg transition cursor-pointer"
                            title={c.name}
                        >
                            {c.name}
                        </span>
                    ))}
                    <button
                        type="button"
                        onClick={async () => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".pdf,.png,.jpg,.jpeg";
                            input.multiple = true;
                            input.onchange = async (e: any) => {
                                const files: FileList = e.target.files;
                                for (let i = 0; i < files.length; i++) await handleCert(files[i]);
                            };
                            input.click();
                        }}
                        className="flex items-center gap-1 text-red-600 px-3 py-1 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition shadow"
                    >
                        + Add
                    </button>
                </div>
            </section>

            {/* Work Proof / Cover Letter */}
            <section className="bg-black/80 rounded-xl p-5 shadow-lg hover:shadow-xl transition relative">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                    Work Proof / Cover Letter <AiOutlineInfoCircle className="text-gray-400" title="Upload proof of work or cover letter" />
                </h3>
                <div className="flex flex-wrap gap-3">
                    {workProofs.map((c, i) => (
                        <span
                            key={i}
                            className="bg-gray-900/70 px-3 py-1 rounded-md shadow hover:shadow-lg transition cursor-pointer"
                            title={c.name}
                        >
                            {c.name}
                        </span>
                    ))}
                    <button
                        type="button"
                        onClick={async () => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".pdf,.doc,.docx,.png,.jpg,.jpeg";
                            input.multiple = true;
                            input.onchange = async (e: any) => {
                                const files: FileList = e.target.files;
                                for (let i = 0; i < files.length; i++) await handleWorkProof(files[i]);
                            };
                            input.click();
                        }}
                        className="flex items-center gap-1 text-red-600 px-3 py-1 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition shadow"
                    >
                        + Add
                    </button>
                </div>
            </section>

            {uploading && (
                <p className="text-xs text-gray-400 animate-pulse">Uploading file, please wait...</p>
            )}
        </div>
    );
}