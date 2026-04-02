"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { slugify } from "@/lib/utils";

export async function saveProductAction(formData: FormData) {
  const productId = formData.get("productId") as string | null;
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;

  if (!slug || slug.trim() === "") {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }
  const description = formData.get("description") as string;
  const categoryIds = formData.getAll("categoryIds") as string[];
  const price = parseFloat(formData.get("price") as string);
  const offerPriceRaw = formData.get("offerPrice");
  const parsedOfferPrice = offerPriceRaw ? parseFloat(offerPriceRaw as string) : NaN;
  const discount = !isNaN(parsedOfferPrice) && parsedOfferPrice > 0 ? Math.round(((price - parsedOfferPrice) / price) * 100) : null;
  const stock = parseInt(formData.get("stock") as string, 10) || 0;
  
  // Ensure slug uniqueness
  const existingProduct = await prisma.product.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (existingProduct && existingProduct.id !== productId) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
  }
  
  const offerText = formData.get("offerText") as string || null;
  const tripleTreatAlert = formData.get("tripleTreatAlert") as string || null;
  const deliveryEstimate = formData.get("deliveryDays") as string || null;
  
  const badgesStr = formData.get("badges") as string;
  const badges = badgesStr ? JSON.parse(badgesStr) : [];
  
  const specsStr = formData.get("specifications") as string;
  const specifications = specsStr ? JSON.parse(specsStr) : null;
  
  const imageUrls: string[] = [];
  
  const imagesList = formData.getAll("image");
  
  for (const item of imagesList) {
    if (typeof item === 'string' && item.trim() !== '') {
      imageUrls.push(item);
    } else if (typeof item === 'object' && item !== null && 'size' in item) {
      const file = item as File;
      if (file.size > 0 && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {}
      
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      imageUrls.push(`/uploads/${filename}`);
      }
    }
  }

  const hasCountdown = formData.get("countdownTimer") === 'true';
  const countdownExpiry = hasCountdown ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
  
  const dynamicSectionsStr = formData.get("dynamicSections") as string;
  const dynamicSections = dynamicSectionsStr ? JSON.parse(dynamicSectionsStr) : [];
  
  const detailsData = dynamicSections.map((sec: any) => ({
    label: sec.title,
    value: sec.content,
  }));
  
  const relatedProductIdsStr = formData.get("relatedProductIds") as string;
  const relatedProductIds = relatedProductIdsStr ? JSON.parse(relatedProductIdsStr) : [];

  const dataPayload: any = {
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    description,
    price,
    discount,
    stock,
    offerTag: offerText,
    tripleTreatAlert,
    countdownExpiry,
    specifications,
    deliveryEstimate,
    badges,
    relatedProductIds: relatedProductIds.filter((id: string) => id && id.trim() !== ''),
    imageUrls
  };

  try {
    if (productId) {
      const { 
        title: t, slug: s, description: d, price: p, discount: disc, stock: st, 
        offerTag: ot, tripleTreatAlert: tta, countdownExpiry: ce, 
        specifications: spec, deliveryEstimate: de, badges: b, imageUrls: iu, relatedProductIds: rpi 
      } = dataPayload;

      await prisma.product.update({
        where: { id: productId },
        data: {
          title: t,
          slug: s,
          description: d,
          price: p,
          discount: disc,
          stock: st,
          offerTag: ot,
          tripleTreatAlert: tta,
          countdownExpiry: ce,
          specifications: spec ?? undefined,
          deliveryEstimate: de,
          badges: { set: b || [] },
          imageUrls: { set: iu || [] },
          relatedProductIds: { set: rpi || [] },
          categories: {
            set: categoryIds.map(id => ({ id }))
          },
          details: {
            deleteMany: {},
            create: detailsData,
          }
        }
      });
    } else {
      await prisma.product.create({
        data: {
          title: dataPayload.title,
          slug: dataPayload.slug,
          description: dataPayload.description,
          price: dataPayload.price,
          discount: dataPayload.discount,
          stock: dataPayload.stock,
          offerTag: dataPayload.offerTag,
          tripleTreatAlert: dataPayload.tripleTreatAlert,
          countdownExpiry: dataPayload.countdownExpiry,
          specifications: dataPayload.specifications,
          deliveryEstimate: dataPayload.deliveryEstimate,
          badges: { set: dataPayload.badges || [] },
          imageUrls: { set: dataPayload.imageUrls || [] },
          relatedProductIds: { set: dataPayload.relatedProductIds || [] },
          categories: {
            connect: categoryIds.map(id => ({ id }))
          },
          details: {
            create: detailsData,
          }
        }
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save product:", err);
    return { success: false, message: err.message || "Something went wrong while saving the product." };
  }
}
