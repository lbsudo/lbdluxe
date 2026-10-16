"use client";

import { createFileRoute } from "@tanstack/react-router";
import CardLayout from "@/layouts/card-layout";
import { CardPage } from "@/components/pages/card/card-page";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/card/")({
  head: () =>
    seoHead({
      title: "Digital Business Card",
      description: "Digital business card for LB DLUXE.",
      path: "/",
      host: "card",
      noindex: true,
    }),
  component: Index,
});

function Index() {
  return (
    <CardLayout>
      <CardPage />
    </CardLayout>
  );
}
