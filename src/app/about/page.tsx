import { getSiteSettings } from "../admin/actions";
import AboutClient from "./AboutClient";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <AboutClient settings={JSON.parse(JSON.stringify(settings))} />;
}
