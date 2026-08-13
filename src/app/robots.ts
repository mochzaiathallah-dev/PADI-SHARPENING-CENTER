import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: ["GPTBot", "ClaudeBot"],
        allow: "/",
      },
    ],
    sitemap: "https://sharpening.padigroup.my.id/sitemap.xml",
  };
}
