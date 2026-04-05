import prisma from "@/lib/prisma";
import ProductForm from "./ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    include: { parent: true }
  });
  const products = await prisma.product.findMany({
    select: { id: true, title: true, imageUrls: true }
  });

  return <ProductForm categories={categories} products={products} />;
}
