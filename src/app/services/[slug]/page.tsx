import { notFound } from "next/navigation";
import { getServiceBySlug } from "../../admin/actions";
import LayananDetailClient from "./LayananDetailClient";
import { Metadata } from "next";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: `${service.name_id} | Padi Sharpening Center`,
    description: service.description_id.slice(0, 160),
    openGraph: {
      title: `${service.name_id} | Padi Sharpening Center`,
      description: service.description_id.slice(0, 160),
      images: service.imageUrl ? [{ url: service.imageUrl }] : [],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <LayananDetailClient service={JSON.parse(JSON.stringify(service))} />
  );
}
