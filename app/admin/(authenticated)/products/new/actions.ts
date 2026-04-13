"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { slugify } from "@/lib/utils";

export async function saveProductAction(formData: FormData) {
  console.log("Starting saveProductAction...");
  try {
    const productId = formData.get("productId") as string | null;
    const title = formData.get("title") as string;
    let slug = formData.get("slug") as string;

    console.log("Saving product:", { productId, title, slug });

    if (!slug || slug.trim() === "") {
      slug = slugify(title || "product");
    } else {
      slug = slugify(slug);
    }
    
    const description = formData.get("description") as string || "";
    const categoryIds = formData.getAll("categoryIds") as string[];
    
    let price = parseFloat(formData.get("price") as string);
    if (isNaN(price)) price = 0;
    
    const offerPriceRaw = formData.get("offerPrice");
    const parsedOfferPrice = offerPriceRaw ? parseFloat(offerPriceRaw as string) : NaN;
    const discount = !isNaN(parsedOfferPrice) && parsedOfferPrice > 0 && price > 0 
      ? Math.round(((price - parsedOfferPrice) / price) * 100) 
      : null;
      
    let stock = parseInt(formData.get("stock") as string, 10);
    if (isNaN(stock)) stock = 0;
    
    console.log("Processed data:", { price, discount, stock, categoryIds });

    // Ensure slug uniqueness
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (existingProduct && (productId ? existingProduct.id !== productId : true)) {
      console.log("Slug collision detected, generating unique slug");
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    
    const offerText = formData.get("offerText") as string || null;
    const tripleTreatAlert = formData.get("tripleTreatAlert") as string || null;
    const deliveryEstimate = formData.get("deliveryDays") as string || null;
    
    console.log("Parsing JSON fields...");
    const badgesStr = formData.get("badges") as string;
    const badges = badgesStr ? JSON.parse(badgesStr) : [];
    
    const specsStr = formData.get("specifications") as string;
    const specifications = specsStr ? JSON.parse(specsStr) : null;
    
    const dynamicSectionsStr = formData.get("dynamicSections") as string;
    const dynamicSections = dynamicSectionsStr ? JSON.parse(dynamicSectionsStr) : [];
    
    const relatedProductIdsStr = formData.get("relatedProductIds") as string;
    const relatedProductIds = relatedProductIdsStr ? JSON.parse(relatedProductIdsStr) : [];

    const imageUrls: string[] = [];
    const imagesList = formData.getAll("image");
    
    console.log(`Processing ${imagesList.length} images...`);
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
    
    const detailsData = dynamicSections.map((sec: any) => ({
      label: sec.title || "Detail",
      value: sec.content || "",
    }));

    if (productId && productId.trim() !== "" && productId !== "undefined") {
      console.log("Performing DB Update...");
      await prisma.product.update({
        where: { id: productId },
        data: {
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description,
          price,
          discount,
          stock,
          offerTag: offerText,
          tripleTreatAlert,
          countdownExpiry,
          specifications: specifications || undefined,
          deliveryEstimate,
          badges: { set: badges },
          imageUrls: { set: imageUrls },
          relatedProductIds: { set: relatedProductIds.filter((id: string) => id && id.trim() !== '') },
          categories: {
            set: categoryIds.map(id => ({ id }))
          },
          details: {
            deleteMany: {},
            create: detailsData,
          }
        }
      });
      console.log("DB Update successful");
    } else {
      console.log("Performing DB Create...");
      await prisma.product.create({
        data: {
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description,
          price,
          discount,
          stock,
          offerTag: offerText,
          tripleTreatAlert,
          countdownExpiry,
          specifications: specifications || undefined,
          deliveryEstimate,
          badges: badges,
          imageUrls: imageUrls,
          relatedProductIds: relatedProductIds.filter((id: string) => id && id.trim() !== ''),
          categories: {
            connect: categoryIds.map(id => ({ id }))
          },
          details: {
            create: detailsData,
          }
        }
      });
      console.log("DB Create successful");
    }

    try {
      console.log("Revalidating paths...");
      revalidatePath("/admin/products");
      revalidatePath("/products");
    } catch (revalidateErr) {
      console.error("Revalidation failed (non-critical):", revalidateErr);
    }
    
    console.log("Action completed successfully");
    return { success: true };
  } catch (err: any) {
    console.error("CRITICAL ERROR in saveProductAction:", err);
    return { 
      success: false, 
      message: err.message || "An unexpected error occurred while saving the product. Please check the server logs." 
    };
  }
}


