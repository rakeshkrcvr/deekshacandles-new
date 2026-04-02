import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import ProductClient from "./ProductClient";
import { cache } from "react";

const getProduct = cache(async (slug: string) => {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      categories: true,
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      details: true,
    },
  });
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getProduct(decodedSlug);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.title} | Deeksha Candles`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await getProduct(decodedSlug);

  if (!product) {
    notFound();
  }

  const relatedProductIds = (product.relatedProductIds as string[]) || [];

  const relatedProducts = relatedProductIds.length > 0 
    ? await prisma.product.findMany({
        where: { id: { in: relatedProductIds } },
        include: {
          images: true,
          categories: true,
        }
      })
    : [];

  return (
    <div className="bg-[#faf9f6]/30 min-h-screen pb-20">

      <div className="mt-4 lg:mt-6">
        <ProductClient product={product} relatedProducts={relatedProducts} />
      </div>
    </div>
  );
}
