"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/story");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p>Redirecting to our story...</p>
      </div>
    </div>
  );
}
