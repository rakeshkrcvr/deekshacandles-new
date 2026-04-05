import prisma from "@/lib/prisma";
import ProductForm from "../../new/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Sequential fetching to be safe if connection limit is active
  const product = await prisma.product.findUnique({
    where: { id },
    include: { details: true, categories: { select: { id: true } } }
  });

  if (!product) {
    notFound();
  }

  const [categories, allProducts] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true, parent: true } }),
    prisma.product.findMany({
      where: { NOT: { id } },
      select: { id: true, title: true, imageUrls: true }
    })
  ]);

  return <ProductForm categories={categories} initialData={product} products={allProducts} />;
}
