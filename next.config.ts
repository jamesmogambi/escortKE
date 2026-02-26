import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow WebP format
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static-eu-cdn.eporner.com",
        port: "",
        pathname: "/thumbs/static/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "iptn.m3pd.com",
        port: "",
        pathname: "/media/tn/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "www.rahaporn.com",
        // port: "",
        // pathname: "",
        // search: "",
      },

      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "in-porn.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "dobryprivat.cz",
      },

      {
        protocol: "https",
        hostname: "www.kenyahotgirls.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "mombasahot.s3.us-east-005.backblazeb2.com",
      },

      {
        protocol: "https",
        hostname: "escort254.com",
      },
      {
        protocol: "https",
        hostname: "afrohot.s3.us-east-005.backblazeb2.com",
      },
    ],
    qualities: [25, 50, 75, 90, 100],
  },
  eslint: {
    // Only disable for production builds, keep during development
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
  typescript: {
    // Only disable for production builds, keep during development
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
};

export default nextConfig;
