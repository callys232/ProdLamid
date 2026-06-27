import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_URL ?? "https://lamid.io";
  return {
    rules: [
      {
        userAgent: "*",
        allow:     ["/", "/jobs", "/talent", "/pricing", "/consultant/", "/about", "/contact", "/events"],
        disallow:  ["/client", "/profile", "/enterprise", "/admin", "/api/", "/postjobs"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
