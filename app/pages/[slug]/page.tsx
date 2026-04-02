import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import SectionRenderer from "@/components/SectionRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug: decodeURIComponent(slug) } });
  if (page) return { title: `${page.title} | Deeksha Candles` };
  
  const content = await prisma.content.findMany();
  const oldPage = content.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  if (oldPage) return { title: `${oldPage.title} | Deeksha Candles` };

  return { title: 'Page Not Found' };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug: decodeURIComponent(slug) },
    include: { sections: { orderBy: { order: 'asc' } } }
  });

  if (page) {
    return (
      <div className="min-h-screen bg-white">
        {page.sections.filter((s: any) => s.active).map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </div>
    );
  }

  const oldPages = await prisma.content.findMany();
  const oldPage = oldPages.find(p => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);

  if (oldPage) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 min-h-[60vh] mt-20">
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100 italic">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6 capitalize">
             {oldPage.title}
          </h1>
          <div className="prose prose-amber max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: oldPage.body }} />
        </div>
      </div>
    );
  }

  return notFound();
}
