"use client";
import React from "react";
import { Project } from "@/types/project";

interface Props {
  projects?: Project[];
}

const mockProjects: Project[] = [
  { id: "p1", title: "Alpha", category: "Tech", status: "active" },
  { id: "p2", title: "Beta", category: "Finance", status: "completed" },
];

export default function ProjectStats({ projects = mockProjects }: Props) {
  return (
    <div className="glass-card">
      <h3 className="card-title">📊 Projects</h3>
      <p>Total: {projects.length}</p>
      <p>Active: {projects.filter((p) => p.status !== "completed").length}</p>
      <p>
        Completed: {projects.filter((p) => p.status === "completed").length}
      </p>
    </div>
  );
}
