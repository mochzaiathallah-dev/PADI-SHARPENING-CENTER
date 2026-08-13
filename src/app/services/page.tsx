import { getServices } from "../admin/actions";
import LayananClient from "./LayananClient";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

export default async function ServicesPage() {
  const services = await getServices();
  return <LayananClient initialServices={JSON.parse(JSON.stringify(services))} />;
}
