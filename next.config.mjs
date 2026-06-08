// next.config.mjs
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
};

export default nextConfig;
