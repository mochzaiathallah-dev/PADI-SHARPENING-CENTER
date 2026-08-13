import { notFound } from "next/navigation";
import { getPortfolioBySlug } from "../../admin/actions";
import PortfolioDetailClient from "./PortfolioDetailClient";
import { Metadata } from "next";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);
  if (!portfolio) return {};

  return {
    title: `${portfolio.title_id} | Padi Sharpening Center`,
    description: portfolio.description_id.slice(0, 160),
    openGraph: {
      title: `${portfolio.title_id} | Padi Sharpening Center`,
      description: portfolio.description_id.slice(0, 160),
      images: portfolio.imageUrl ? [{ url: portfolio.imageUrl }] : [],
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await getPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  return (
    <PortfolioDetailClient portfolio={JSON.parse(JSON.stringify(portfolio))} />
  );
}
