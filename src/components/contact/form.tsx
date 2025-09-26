"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function ContactForm() {
  useEffect(() => {
    const d = document;
    const w = "https://tally.so/widgets/embed.js";

    interface WindowWithTally extends Window {
      Tally?: { loadEmbeds: () => void };
    }

    const win = window as WindowWithTally;

    const v = () => {
      // If Tally is already available, initialise; otherwise set iframe src from data attribute
      if (typeof win.Tally !== "undefined") {
        win.Tally!.loadEmbeds();
      } else {
        const nodes = d.querySelectorAll("iframe[data-tally-src]:not([src])");
        nodes.forEach((e) => {
          const iframe = e as HTMLIFrameElement;
          iframe.src = iframe.dataset.tallySrc || "";
        });
      }
    };

    if (typeof win.Tally !== "undefined") v();
    else if (d.querySelector('script[src="' + w + '"]') == null) {
      const s = d.createElement("script");
      s.src = w;
      s.async = true;
      s.onload = v;
      s.onerror = v;
      d.body.appendChild(s);
    }
  }, []);

  return (
    <div>
      <Card className="p-8">
        <CardContent className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Send us a Message
          </h2>

          <div>
            <iframe
              data-tally-src="https://tally.so/embed/woJ22M?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1"
              loading="lazy"
              width="100%"
              height="276"
              frameBorder={0}
              marginHeight={0}
              marginWidth={0}
              title="Contact form"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContactForm;
