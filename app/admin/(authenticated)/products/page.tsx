import prisma from "@/lib/prisma";
// Force recompile to pick up new Prisma Client types
import Link from "next/link";
import { Plus } from "lucide-react";
import ImportExportManager from "./ImportExportManager";
import ProductTable from "./ProductTable";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { categories: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany()
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 mt-2">Manage your candle catalog, inventory, and pricing.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <ImportExportManager />
          
          <Link href="/admin/products/new" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
            <Plus className="w-5 h-5" />
             New Product
          </Link>
        </div>
      </div>

      <ProductTable initialProducts={products as any} categories={categories} />
    </div>
  );
}
