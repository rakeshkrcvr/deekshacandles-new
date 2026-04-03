"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function savePageAction(data: {
  id?: string;
  title: string;
  slug: string;
  sections: any[];
  migratedFromId?: string;
}) {
  const { id, title, slug, sections, migratedFromId } = data;

  try {
    const cleanedSections = sections.map((s, idx) => ({
      type: s.type || 'unknown',
      content: s.content ? JSON.parse(JSON.stringify(s.content)) : {}, // Ensure only serializable data
      order: idx,
      active: s.active !== false
    }));

    if (id) {
      await prisma.page.update({
        where: { id },
        data: {
          title,
          slug,
          sections: {
            deleteMany: {},
            create: cleanedSections
          }
        }
      });
    } else {
      await prisma.page.create({
        data: {
          title,
          slug,
          sections: {
            create: cleanedSections
          }
        }
      });
    }

    if (migratedFromId) {
      await prisma.content.delete({ where: { id: migratedFromId } }).catch(() => {});
    }
  } catch (error: any) {
    console.error("DEBUG: Failed to save page:", error);
    throw new Error(error.message || "Database save failed.");
  }

  revalidatePath("/admin/pages");
  revalidatePath("/");
  revalidatePath(`/pages/${slug}`);
}

export async function deletePageAction(id: string) {
  await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  revalidatePath("/");
}

export async function deleteOldContentAction(id: string) {
  await prisma.content.delete({ where: { id } });
  revalidatePath("/admin/pages");
}
