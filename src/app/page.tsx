import { getSiteSettings } from "./admin/actions";
import HomeClient from "./HomeClient";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

export default async function HomePage() {
  const settings = await getSiteSettings();
  return <HomeClient settings={JSON.parse(JSON.stringify(settings))} />;
}
