import prisma from "@/lib/prisma"; // Recompiled for new Page builder
import Link from "next/link";
import { 
  Plus, FileText, ExternalLink, Settings2, Trash2, 
  Layout, AlertCircle, CheckCircle, ArrowRight 
} from "lucide-react";
import { deletePageAction, deleteOldContentAction } from "./actions";

export default async function PagesList() {
  const [pages, legacyContent] = await Promise.all([
    prisma.page.findMany({
      include: { sections: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.content.findMany()
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Layout className="w-10 h-10 text-amber-600" /> Page Builder
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Create beautiful section-based custom pages for your store.</p>
        </div>
        <Link href="/admin/pages/new" className="bg-gray-900 text-white px-8 py-4 rounded-[20px] flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-xl shadow-gray-900/10 font-bold tracking-tight">
          <Plus className="w-5 h-5" /> Design New Page
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Builder Pages */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-emerald-500" /> Active Builder Pages
              </h2>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {pages.map(p => (
                <div key={p.id} className="group bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                          <FileText className="w-8 h-8 text-gray-300 group-hover:text-amber-600 transition-all" />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                          <div className="flex items-center gap-3 mt-2">
                             <code className="text-[11px] bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-mono">/pages/{p.slug}</code>
                             <span className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">{p.sections.length} Sections</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Link href={`/pages/${p.slug}`} target="_blank" className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all" title="View Page">
                         <ExternalLink className="w-5 h-5" />
                       </Link>
                       <Link href={`/admin/pages/${p.id}/edit`} className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all" title="Edit Builder">
                         <Settings2 className="w-5 h-5" />
                       </Link>
                       <form action={async () => { "use server"; await deletePageAction(p.id); }}>
                          <button type="submit" className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all" title="Delete">
                             <Trash2 className="w-5 h-5" />
                          </button>
                       </form>
                    </div>
                  </div>
                </div>
              ))}
              {pages.length === 0 && (
                <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                   <p className="text-gray-400 font-medium">No builder pages yet. Use the button above to start.</p>
                </div>
              )}
           </div>
        </div>

        {/* Legacy Sections (Migration) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-amber-500" /> Legacy Standard Pages
              </h2>
           </div>

           <div className="space-y-4">
              {legacyContent.map(lc => (
                <div key={lc.id} className="bg-white rounded-[24px] p-5 border border-dashed border-gray-200">
                   <p className="text-sm font-bold text-gray-900 mb-1">{lc.title}</p>
                   <p className="text-[10px] text-gray-400 italic mb-4 truncate italic">"{lc.body.substring(0, 50).replace(/<[^>]*>?/gm, '')}..."</p>
                   <div className="flex items-center gap-2">
                      <Link href={`/admin/pages/${lc.id}/edit`} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-600 hover:text-white transition-all">
                        Upgrade <ArrowRight className="w-3 h-3" />
                      </Link>
                      <form action={async () => { "use server"; await deleteOldContentAction(lc.id); }} className="ml-auto">
                        <button type="submit" className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                           <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                   </div>
                </div>
              ))}
              {legacyContent.length === 0 && (
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-emerald-900 font-bold text-xs uppercase tracking-widest">All Migrated!</p>
                    <p className="text-emerald-700 text-[11px] mt-1">You have successfully moved all pages to the new Page Builder.</p>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
