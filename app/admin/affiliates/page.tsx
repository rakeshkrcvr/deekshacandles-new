import { getAffiliates } from "./actions";
import AffiliateManager from "./AffiliateManager";

export const dynamic = "force-dynamic";

export default async function AffiliatesPage() {
  const affiliates = await getAffiliates();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto py-8">
        <AffiliateManager initialAffiliates={JSON.parse(JSON.stringify(affiliates))} />
      </div>
    </div>
  );
}
