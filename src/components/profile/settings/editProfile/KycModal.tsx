"use client";

import { useState, useRef } from "react";

interface KycModalProps {
    open: boolean;
    onClose: () => void;
}

export default function KycModal({ open, onClose }: KycModalProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [cameraOpen, setCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    if (!open) return null;

    // Handle file uploads (drag/drop or input)
    const handleFiles = (incoming: FileList | File[]) => {
        const newFiles = Array.from(incoming);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    // Open camera stream
    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraOpen(true);
            }
        } catch (err) {
            console.error("Camera access denied:", err);
        }
    };

    // Capture photo from video stream
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "kyc-photo.png", { type: "image/png" });
                        setFiles((prev) => [...prev, file]);
                    }
                });
            }
        }
    };

    // Submit files (placeholder for backend integration)
    const handleSubmit = async () => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        try {
            const res = await fetch("/api/kyc", {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                alert("KYC submitted successfully!");
                onClose();
            } else {
                alert("Failed to submit KYC");
            }
        } catch (err) {
            console.error("Error submitting KYC:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-black rounded-xl w-full max-w-md p-5 border border-gray-800 text-white">
                <h2 className="text-lg font-semibold mb-4">Upload KYC</h2>

                {/* DROP ZONE */}
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-gray-700 p-6 rounded-lg text-center hover:border-brand transition"
                >
                    <p className="text-sm text-gray-400 mb-2">Drag & drop OR upload</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFiles(e.target.files!)}
                        className="text-sm"
                    />
                </div>

                {/* CAMERA */}
                <div className="mt-4 space-y-2">
                    {!cameraOpen ? (
                        <button onClick={openCamera} className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600">
                            Use Camera
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <video ref={videoRef} autoPlay className="w-full rounded-md" />
                            <canvas ref={canvasRef} width={320} height={240} className="hidden" />
                            <button onClick={capturePhoto} className="bg-brand px-4 py-2 rounded-md hover:bg-red-600">
                                Capture Photo
                            </button>
                        </div>
                    )}
                </div>

                {/* PREVIEW */}
                {files.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                        {files.map((f, i) => (
                            <div key={i} className="flex justify-between text-xs bg-black/50 p-2 rounded">
                                <span>{f.name}</span>
                                <button
                                    onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-3 mt-4">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="bg-brand px-4 py-2 rounded-md hover:bg-red-600">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}
