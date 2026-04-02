"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useCartStore } from "@/store/cart";

function ReferralTrackerContent() {
  const searchParams = useSearchParams();
  const setAffiliateId = useCartStore((state) => state.setAffiliateId);
  const currentAffiliateId = useCartStore((state) => state.affiliateId);

  useEffect(() => {
    // Check for "ref" or "r" parameter
    const refCode = searchParams.get("ref") || searchParams.get("r");

    if (refCode) {
      // Small optimization: only fetch if different from current
      // But we don't know the code of the current affiliate ID easily without another lookup
      // So we'll just check if it's there
      
      const verifyAffiliate = async () => {
        try {
          const res = await fetch(`/api/affiliate/verify?code=${refCode}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.affiliateId) {
              setAffiliateId(data.affiliateId);
              console.log(`Affiliate tracked: ${data.affiliateName} (${data.affiliateId})`);
              
              // Optionally remove the "ref" from the URL to "clean" it, 
              // but it's not strictly necessary and can be annoying with Next.js router sometimes
            }
          }
        } catch (error) {
          console.error("Referral tracking error:", error);
        }
      };

      verifyAffiliate();
    }
  }, [searchParams, setAffiliateId]);

  return null;
}

export default function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralTrackerContent />
    </Suspense>
  );
}
