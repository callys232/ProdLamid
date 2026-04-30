import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_URL ?? "https://lamid.io";
  const now  = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                  lastModified: now, changeFrequency: "weekly",  priority: 1.0  },
    { url: `${base}/jobs`,        lastModified: now, changeFrequency: "hourly",  priority: 0.9  },
    { url: `${base}/talent`,      lastModified: now, changeFrequency: "hourly",  priority: 0.9  },
    { url: `${base}/pricing`,     lastModified: now, changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/contact`,     lastModified: now, changeFrequency: "monthly", priority: 0.6  },
    { url: `${base}/contact-sales`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/events`,      lastModified: now, changeFrequency: "weekly",  priority: 0.5  },
    { url: `${base}/signin`,      lastModified: now, changeFrequency: "yearly",  priority: 0.4  },
    { url: `${base}/signup`,      lastModified: now, changeFrequency: "yearly",  priority: 0.4  },
  ];

  // Dynamic consultant profiles
  try {
    const res = await fetch(`${base}/api/consultants?limit=200`, { cache: "no-store" });
    if (res.ok) {
      const { data } = await res.json();
      const consultantRoutes: MetadataRoute.Sitemap = (data ?? []).map((c: any) => ({
        url:             `${base}/consultant/${c._id ?? c.id}`,
        lastModified:    now,
        changeFrequency: "weekly" as const,
        priority:        0.7,
      }));
      return [...staticRoutes, ...consultantRoutes];
    }
  } catch { /* return static only */ }

  return staticRoutes;
}
