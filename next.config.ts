import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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
    ],
    // qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
