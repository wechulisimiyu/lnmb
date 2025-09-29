"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to registration...</p>
      </div>
    </div>
  );
}
