import { MetadataRoute } from "next";
import prisma from "../lib/prisma";

export const revalidate = 86400; // Cache sitemap on CDN for 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sharpening.padigroup.my.id";

  // Static routes
  const staticRoutes = ["", "/about", "/services", "/portfolio", "/catalog", "/contact", "/training"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    // Dynamic products
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
    });
    const productRoutes = products.map((p: any) => ({
      url: `${baseUrl}/catalog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Dynamic services
    const services = await prisma.service.findMany({
      select: { slug: true, updatedAt: true },
    });
    const serviceRoutes = services.map((s: any) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    // Dynamic portfolios
    const portfolios = await prisma.portfolio.findMany({
      select: { slug: true, updatedAt: true },
    });
    const portfolioRoutes = portfolios.map((port: any) => ({
      url: `${baseUrl}/portfolio/${port.slug}`,
      lastModified: port.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...productRoutes, ...serviceRoutes, ...portfolioRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    return staticRoutes;
  }
}
