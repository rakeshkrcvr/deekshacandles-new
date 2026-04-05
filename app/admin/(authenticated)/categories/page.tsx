import prisma from "@/lib/prisma";
import { Tags, Trash2, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";
import CategoryManager from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { parent: true },
    orderBy: { createdAt: 'desc' }
  });

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const rawSlug = formData.get("slug") as string;
    const icon = formData.get("icon") as string;
    const parentId = formData.get("parentId") as string;
    
    if (!name || !rawSlug) return;

    let slug = rawSlug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
    
    // Check if slug exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 5)}`;
    }

    await prisma.category.create({ 
      data: { 
        name, 
        slug, 
        icon: icon || null,
        parentId: parentId || null 
      } 
    });
    revalidatePath("/admin/categories");
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const rawSlug = formData.get("slug") as string;
    const icon = formData.get("icon") as string;
    const parentId = formData.get("parentId") as string;

    if (!id || !name || !rawSlug) return;

    let slug = rawSlug.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

    // Check if slug is taken by ANOTHER category
    const existing = await prisma.category.findFirst({
      where: { 
        slug,
        id: { not: id }
      }
    });

    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 5)}`;
    }

    await prisma.category.update({
      where: { id },
      data: { 
        name, 
        slug, 
        icon: icon || null,
        parentId: (parentId && parentId !== id) ? parentId : null 
      }
    });
    revalidatePath("/admin/categories");
  }

  async function handleDelete(id: string) {
    "use server";
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-amber-50 rounded-[32px] flex items-center justify-center shadow-xl shadow-amber-900/5 rotate-3 hover:rotate-0 transition-transform duration-500 border border-amber-100/50">
              <Tags className="w-10 h-10 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-600 tracking-[0.5em] mb-2 block italic">Management Panel</span>
            <h1 className="text-5xl font-serif font-bold text-gray-900 tracking-tighter italic leading-none">Catalog Logic</h1>
            <p className="text-gray-400 mt-4 font-serif italic text-lg opacity-70">Design the architecture of your fragrance library.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-8 py-5 rounded-[24px] border border-gray-100 shadow-sm text-center">
              <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Total Blocks</div>
              <div className="text-3xl font-serif font-bold italic text-gray-900">{categories.length}</div>
           </div>
        </div>
      </div>

      <CategoryManager 
        initialCategories={categories}
        createAction={handleCreate}
        updateAction={handleUpdate}
        deleteAction={handleDelete}
      />
    </div>
  );
}
