import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageBuilder from "../../PageBuilder";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Try fetching from new Page model
  const page = await prisma.page.findUnique({ 
    where: { id },
    include: { sections: { orderBy: { order: 'asc' } } }
  });
  
  if (page) {
    return (
      <PageBuilder 
        pageId={page.id}
        initialTitle={page.title}
        initialSlug={page.slug}
        initialSections={page.sections.map((s: any) => ({
          id: s.id,
          type: s.type,
          content: s.content,
          order: s.order
        }))}
      />
    );
  }

  // 2. Fallback to Content table (Legacy)
  const oldContent = await prisma.content.findUnique({ where: { id } });
  if (oldContent) {
    return (
      <PageBuilder 
        pageId={undefined} 
        initialTitle={`[Migrated] ${oldContent.title}`}
        initialSlug={oldContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
        migratedFromId={oldContent.id}
        initialSections={[
          { 
            id: 'legacy-1', 
            type: 'text', 
            order: 0, 
            content: { html: oldContent.body, title: 'Migrated Content' } 
          }
        ]}
      />
    );
  }

  return notFound();
}
