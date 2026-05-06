// next.config.mjs
const nextConfig = {
  images: {
    domains: ["randomuser.me", "placehold.co"],
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
