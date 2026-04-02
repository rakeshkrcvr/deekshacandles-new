import prisma from "@/lib/prisma";
import ProductsClient from "@/app/products/ProductsClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | Deeksha Candles`,
    description: `Browse our collection of ${category.name}`,
  };
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { slug } = await params;
  const { search } = await searchParams;

  const currentCategory = await prisma.category.findUnique({
    where: { slug }
  });

  if (!currentCategory) {
    notFound();
  }

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
      initialSelectedCategoryIds={[currentCategory.id]}
    />
  );
}
