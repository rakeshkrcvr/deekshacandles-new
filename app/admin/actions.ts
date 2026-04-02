"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

// --- Products ---
export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  
  if (!slug || slug.trim() === "") {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const categoryIds = formData.getAll("categoryIds") as string[];

  await prisma.product.create({
    data: {
      title,
      slug,
      description,
      price,
      stock,
      categories: {
        connect: categoryIds.map(id => ({ id }))
      }
    },
  });

  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

// --- Categories ---
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  await prisma.category.create({
    data: { name, slug },
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

// --- Orders ---
export async function updateOrderStatus(id: string, status: string) {
  await prisma.order.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin/orders");
}
