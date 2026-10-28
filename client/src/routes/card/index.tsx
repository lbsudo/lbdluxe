"use client";

import { createFileRoute } from "@tanstack/react-router";
import CardLayout from "@/layouts/card-layout";
import { CardPage } from "@/components/pages/card/card-page";
import { seoHead } from "@/lib/seo";
import { CARD_BRAND } from "@/components/pages/card/theme";

export const Route = createFileRoute("/card/")({
  head: () => {
    const seo = seoHead({
      title: "Digital Business Card",
      description: "Digital business card for LB DLUXE.",
      path: "/",
      host: "card",
      noindex: true,
    });

    return {
      meta: [
        ...seo.meta,
        // viewport-fit=cover lets the card run edge to edge on notched
        // phones; the layout pads itself back out with env(safe-area-inset-*).
        // This route's viewport wins over the root route's (TanStack dedupes
        // by meta name, deepest route first), so the other hosts are
        // unaffected.
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "theme-color", content: CARD_BRAND },
        { name: "application-name", content: "LB DLUXE" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
        { name: "apple-mobile-web-app-title", content: "LB DLUXE" },
      ],
      links: [
        ...seo.links,
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon-180.png" },
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <CardLayout>
      <CardPage />
    </CardLayout>
  );
}
