"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

interface AvailabilitySlot {
    day: string;
    slots: number[];
}

interface AvailabilityCalendarProps {
    availability?: AvailabilitySlot[];
    onChange?: (updated: AvailabilitySlot[]) => void;
}

export default function AvailabilityCalendar({ availability = [], onChange }: AvailabilityCalendarProps) {
    const [local, setLocal] = useState<AvailabilitySlot[]>([]);

    useEffect(() => {
        setLocal(availability);
    }, [availability]);

    const toggle = (day: string, hour: number) => {
        let updated = [...local];
        const idx = updated.findIndex((d) => d.day === day);

        if (idx === -1) {
            updated.push({ day, slots: [hour] });
        } else {
            const slots = updated[idx].slots;
            if (slots.includes(hour)) {
                updated[idx].slots = slots.filter((h) => h !== hour);
            } else {
                updated[idx].slots.push(hour);
            }
            if (updated[idx].slots.length === 0) updated.splice(idx, 1);
        }

        setLocal(updated);
        onChange?.(updated);
    };

    const isActive = (day: string, hour: number) =>
        local.some((d) => d.day === day && d.slots.includes(hour));

    return (
        <div className="space-y-4">
            {/* GRID */}
            <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-[3px] min-w-[500px] bg-black p-[3px] rounded-xl">
                    <div />
                    {DAYS.map((d) => (
                        <div key={d} className="text-[10px] text-gray-400 text-center">
                            {d}
                        </div>
                    ))}

                    {HOURS.map((hour) => (
                        <div key={hour} className="contents">
                            <div className="text-[10px] text-gray-500 flex items-center justify-center">
                                {hour}:00
                            </div>
                            {DAYS.map((day) => {
                                const active = isActive(day, hour);
                                return (
                                    <div
                                        key={`${day}-${hour}`}
                                        onClick={() => toggle(day, hour)}
                                        title={`Click to ${active ? "remove" : "add"} ${day} ${hour}:00`}
                                        className={clsx(
                                            "h-9 rounded-md cursor-pointer transition flex items-center justify-center",
                                            active
                                                ? "bg-blue-600 shadow-lg ring-2 ring-white"
                                                : "bg-[#0f1115] hover:bg-[#1a1d24]"
                                        )}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* SELECTED LIST */}
            <div className="bg-blue-500/40 p-3 rounded-lg border border-gray-800">
                <p className="text-xs text-gray-400 mb-2">Selected Slots</p>
                {local.length === 0 ? (
                    <p className="text-gray-500 text-sm">No time selected</p>
                ) : (
                    <div className="space-y-2 text-sm">
                        {local.map((d) => (
                            <div key={d.day}>
                                <span className="text-brand font-medium">{d.day}:</span>{" "}
                                <span className="text-white">
                                    {d.slots.sort().map((h) => `${h}:00`).join(", ")}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
