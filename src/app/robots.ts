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
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "PerplexityBot",
          "Applebot-Extended",
          "Meta-ExternalAgent",
          "cohere-ai",
          "CCBot"
        ],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: "https://sharpening.padigroup.my.id/sitemap.xml",
  };
}
