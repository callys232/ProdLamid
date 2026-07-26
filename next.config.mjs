// next.config.mjs
import { LEGACY_ROUTE_PAIRS } from "./src/lib/intelligence/legacyRoutes.mjs";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  transpilePackages: ["lucide-react", "framer-motion"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "react-icons",
      "@headlessui/react",
    ],
  },

  /* Engine slugs moved from metaphor to function. The old URLs shipped
     publicly, so they redirect permanently rather than 404. */
  async redirects() {
    return LEGACY_ROUTE_PAIRS.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
