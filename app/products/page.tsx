import prisma from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const { search } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      } : {},
      include: {
        categories: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <ProductsClient 
      initialProducts={JSON.parse(JSON.stringify(products))} 
      categories={categories} 
    />
  );
}
