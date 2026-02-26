// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/dashboard/",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        // "/*?*", // Prevent crawling of URLs with query parameters
      ],
    },
    sitemap: "https://kenyadivas.com/sitemap.xml",
  };
}
