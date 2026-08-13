import { getPortfolios } from "../admin/actions";
import PortfolioClient from "./PortfolioClient";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

export default async function PortfolioPage() {
  const portfolios = await getPortfolios();
  return <PortfolioClient initialItems={JSON.parse(JSON.stringify(portfolios))} />;
}
