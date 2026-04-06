import prisma from "@/lib/prisma";
// Force recompile to pick up new Prisma Client types
import Link from "next/link";
import { Plus } from "lucide-react";
import ImportExportManager from "./ImportExportManager";
import ProductTable from "./ProductTable";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { categories: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany()
  ]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your candle catalog, inventory, and pricing.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <ImportExportManager />
          
          <Link 
            href="/admin/products/new" 
            className="h-8 px-3 text-[11px] bg-gray-900 hover:bg-gray-800 text-white rounded font-semibold flex items-center gap-1.5 transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
             Add Item
          </Link>
        </div>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <ProductTable initialProducts={products as any} categories={categories} />
    </div>
  );
}
