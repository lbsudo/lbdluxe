"use client";

import { createFileRoute } from "@tanstack/react-router";
// import { Loader } from 'lucide-react'
import LinksLayout from "@/layouts/links-layout";
import { LinkPanel } from "@/components/pages/links/linkpanel";
import { NetworkLinksPanel } from "@/components/pages/links/NetworkLinksPanel";
import { ProfileBar } from "@/components/pages/links/profile/profile-bar";
import { seoHead } from "@/lib/seo";

export const Route = createFileRoute("/links/rumble-links/")({
  head: () =>
    seoHead({
      title: "Rumble Links",
      description: "All of LB DLUXE's Rumble links in one place.",
      path: "/rumble-links",
      host: "links",
      noindex: true,
    }),
  component: Index,
});

function Index() {
  return (
    <>
      <LinksLayout>
        <section
          className={
            "relative flex flex-col items-center justify-center overflow-hidden"
          }
        >
          <ProfileBar />
          <LinkPanel panelBody={<NetworkLinksPanel networkType="rumble" />} />
        </section>
      </LinksLayout>
    </>
  );
}
