import { notFound } from "next/navigation";
import { getProductBySlug } from "../../admin/actions";
import ProductDetailClient from "./ProductDetailClient";
import { Metadata } from "next";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name_id} | Padi Sharpening Center`,
    description: product.description_id.slice(0, 160),
    openGraph: {
      title: `${product.name_id} | Padi Sharpening Center`,
      description: product.description_id.slice(0, 160),
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient product={JSON.parse(JSON.stringify(product))} />
  );
}
