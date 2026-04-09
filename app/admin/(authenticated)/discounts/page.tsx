import DiscountManager from "./DiscountManager";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function DiscountsPage() {
  const [discounts, products] = await Promise.all([
    prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.findMany({
      select: { id: true, title: true, slug: true, imageUrls: true },
      orderBy: { title: 'asc' }
    })
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="text-3xl font-bold font-serif text-gray-900">Discount Hub</h1>
           <p className="text-gray-500 mt-2">Manage all percentage, flat, BOGO, shipping, behavioral, and bank offers.</p>
         </div>
      </div>
      
      <DiscountManager initialDiscounts={discounts} allProducts={products} />
    </div>
  );
}
