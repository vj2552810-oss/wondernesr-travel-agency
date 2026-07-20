import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let product: typeof products.$inferSelect | undefined;
  let productReviews: (typeof reviews.$inferSelect)[] = [];
  let relatedProducts: (typeof products.$inferSelect)[] = [];
  let categoryName = "";

  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (result.length === 0) return notFound();
    product = result[0];

    productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, product.id))
      .orderBy(desc(reviews.createdAt));

    if (product.categoryId) {
      const cat = await db
        .select()
        .from(categories)
        .where(eq(categories.id, product.categoryId))
        .limit(1);
      if (cat.length > 0) categoryName = cat[0].name;

      relatedProducts = await db
        .select()
        .from(products)
        .where(eq(products.categoryId, product.categoryId))
        .limit(4);
      relatedProducts = relatedProducts.filter((p) => p.id !== product!.id).slice(0, 3);
    }
  } catch {
    return notFound();
  }

  if (!product) return notFound();

  return (
    <ProductDetailClient
      product={product}
      reviews={productReviews}
      relatedProducts={relatedProducts}
      categoryName={categoryName}
    />
  );
}
