import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leave No Medic Behind - Charity Run",
  description:
    "Supporting medical students through our annual charity run mission",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          <Navigation />
          <main>{children}</main>
          <Analytics />
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
