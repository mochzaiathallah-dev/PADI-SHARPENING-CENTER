import { getProducts, getCategories } from "../admin/actions";
import CatalogClient from "./CatalogClient";

export const revalidate = 3600; // ISR static caching (auto-invalidated on admin updates via revalidatePath)

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);
  return (
    <CatalogClient
      initialProducts={JSON.parse(JSON.stringify(products))}
      initialCategories={JSON.parse(JSON.stringify(categories))}
    />
  );
}
