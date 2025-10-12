"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function TallyOrderForm() {
  useEffect(() => {
    const d = document;
    const w = "https://tally.so/widgets/embed.js";

    interface WindowWithTally extends Window {
      Tally?: {
        loadEmbeds: () => void;
        openPopup: (formId: string, options?: Record<string, unknown>) => void;
      };
    }

    const win = window as WindowWithTally;

    const v = () => {
      if (typeof win.Tally !== "undefined") {
        win.Tally.loadEmbeds();
      }
    };

    if (typeof win.Tally !== "undefined") {
      v();
    } else if (d.querySelector('script[src="' + w + '"]') == null) {
      const s = d.createElement("script");
      s.src = w;
      s.async = true;
      s.onload = v;
      s.onerror = v;
      d.body.appendChild(s);
    }
  }, []);

  const handleOpenForm = () => {
    interface WindowWithTally extends Window {
      Tally?: {
        openPopup: (formId: string, options?: Record<string, unknown>) => void;
      };
    }

    const win = window as WindowWithTally;
    
    if (typeof win.Tally !== "undefined" && win.Tally.openPopup) {
      // Open the Tally popup form for order
      win.Tally.openPopup("3xOB5J", {
        layout: "modal",
        width: 700,
      });
    } else {
      console.error("Tally is not loaded yet");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Order Your T-shirt</CardTitle>
          <CardDescription>
            Click the button below to open our order form and reserve your spot for the run
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg space-y-4">
            {/* <div className="space-y-2">
              <h3 className="font-semibold text-lg">What&apos;s Included:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Premium quality t-shirt in your size</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Event participation (optional)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Student discounts available</span>
                </li>
              </ul>
            </div> */}
            
            <div className="space-y-2">
              <h4 className="font-semibold">Pricing:</h4>
              <div className="text-sm space-y-1">
                <p>Regular: KES 1,500</p>
                <p>Student: KES 850</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleOpenForm} 
            size="lg" 
            className="w-full text-lg h-14"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Open Order Form
          </Button>

          {/* <p className="text-center text-sm text-gray-600">
            Secure payment processing • Fast checkout
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
