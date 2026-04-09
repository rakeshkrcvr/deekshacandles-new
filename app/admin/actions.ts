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

export async function duplicateProduct(id: string) {
  const original = await prisma.product.findUnique({
    where: { id },
    include: {
      categories: true,
      images: true,
      details: true
    }
  });

  if (!original) throw new Error("Product not found");

  const newTitle = `${original.title} (Copy)`;
  let newSlug = slugify(newTitle);
  
  // Ensure slug is unique
  let count = 1;
  let slugExists = await prisma.product.findUnique({ where: { slug: newSlug } });
  while (slugExists) {
    newSlug = slugify(`${original.title} Copy ${count++}`);
    slugExists = await prisma.product.findUnique({ where: { slug: newSlug } });
  }

  await prisma.product.create({
    data: {
      title: newTitle,
      slug: newSlug,
      description: original.description,
      price: original.price,
      discount: original.discount,
      stock: original.stock,
      offerTag: original.offerTag,
      tripleTreatAlert: original.tripleTreatAlert,
      countdownExpiry: original.countdownExpiry,
      specifications: original.specifications || undefined,
      deliveryEstimate: original.deliveryEstimate,
      badges: original.badges,
      imageUrls: original.imageUrls,
      relatedProductIds: original.relatedProductIds,
      categories: {
        connect: original.categories.map(c => ({ id: c.id }))
      },
      images: {
        create: original.images.map(img => ({ url: img.url }))
      },
      details: {
        create: original.details.map(d => ({ label: d.label, value: d.value }))
      }
    }
  });

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
  revalidatePath(`/admin/orders/${id}`);
}

export async function updateOrderCustomerDetails(orderId: string, data: {
  userName: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, address: true }
  });

  if (!order) throw new Error("Order not found");

  // Update User name (not email to avoid global impact, but user wants editable so let's see)
  // Actually usually in e-commerce, order email is separate, but here it's linked to User model.
  // I'll update the user tied to this order.
  await prisma.user.update({
    where: { id: order.userId },
    data: { 
      name: data.userName,
      email: data.email
    }
  });

  // Update Address
  if (order.address) {
    await prisma.address.update({
      where: { orderId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode
      }
    });
  } else {
    await prisma.address.create({
      data: {
        orderId,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode
      }
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
