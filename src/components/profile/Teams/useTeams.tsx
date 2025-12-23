"use client";

import { useEffect, useState } from "react";
import { ClientProfile, TeamMember, Consultant } from "@/types/client";
import { Project } from "@/types/project";
import { mockClients } from "@/mocks/mockClient";

export function useTeamsData(freelancerId?: string) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadClient() {
      try {
        const res = await fetch("/api/client/profile", { cache: "no-store" });
        if (!res.ok) throw new Error("Profile API error");

        const data = (await res.json()) as ClientProfile;

        const normalized: ClientProfile = {
          ...data,
          projects: data.projects ?? [],
          teamMembers: data.teamMembers ?? [],
          consultants: data.consultants ?? [],
          invitations: data.invitations ?? [],
          escrowTransactions: data.escrowTransactions ?? [],
        };

        setClient(normalized);

        if (freelancerId) {
          const filteredProjects = normalized.projects.filter((p) =>
            p.consultants?.some(
              (c) => typeof c === "string" && c === freelancerId
            )
          );
          setProjects(filteredProjects);

          const members =
            normalized.teamMembers?.filter((tm) =>
              tm.projects?.some((p) =>
                filteredProjects.some((fp) => fp.id === p.id)
              )
            ) ?? [];
          setTeamMembers(members);

          const involvedConsultants =
            normalized.consultants?.filter((c) =>
              filteredProjects.some((p) =>
                p.consultants?.some(
                  (pc) => typeof pc === "string" && pc === c.id
                )
              )
            ) ?? [];
          setConsultants(involvedConsultants);
        } else {
          setProjects(normalized.projects);
          setTeamMembers(normalized.teamMembers ?? []);
          setConsultants(normalized.consultants ?? []);
        }
      } catch (err) {
        console.error("Client API failed → using fallback mockClient");

        const fallback = mockClients[0];
        setClient(fallback);

        if (freelancerId) {
          const filteredProjects = fallback.projects.filter((p) =>
            p.consultants?.some(
              (c) => typeof c === "string" && c === freelancerId
            )
          );
          setProjects(filteredProjects);

          const members =
            fallback.teamMembers?.filter((tm) =>
              tm.projects?.some((p) =>
                filteredProjects.some((fp) => fp.id === p.id)
              )
            ) ?? [];
          setTeamMembers(members);

          const involvedConsultants =
            fallback.consultants?.filter((c) =>
              filteredProjects.some((p) =>
                p.consultants?.some(
                  (pc) => typeof pc === "string" && pc === c.id
                )
              )
            ) ?? [];
          setConsultants(involvedConsultants);
        } else {
          setProjects(fallback.projects);
          setTeamMembers(fallback.teamMembers ?? []);
          setConsultants(fallback.consultants ?? []);
        }
      } finally {
        setLoading(false);
      }
    }

    loadClient();
  }, [freelancerId]);

  return { client, projects, teamMembers, consultants, loading };
}
