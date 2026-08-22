import { ProductCard, type ProductCardData } from "./ProductCard";

/**
 * Two-up on phones (thumbnail comparison is how the catalogue is actually
 * browsed), three across tablets, four on desktop.
 */
export function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: ProductCardData[];
  priorityCount?: number;
}) {
  return (
    <div className="reveal-group grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
