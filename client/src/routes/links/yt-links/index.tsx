"use client";

import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import LinksLayout from "@/layouts/links-layout";
import { LinkPanel } from "@/components/pages/links/linkpanel";
import { NetworkLinksPanel } from "@/components/pages/links/NetworkLinksPanel";
import { ProfileBar } from "@/components/pages/links/profile/profile-bar";

export const Route = createFileRoute("/links/yt-links/")({
  head: () => ({
    meta: [{ title: "LBDLUXE | YouTube Links" }],
  }),
  component: Index,
});

function Index() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      window.dispatchEvent(new Event("appReady"));
    }
  }, [isClient]);

  if (!isClient) return null;

  return (
    <>
      <LinksLayout>
        <section
          className={
            "relative flex flex-col items-center justify-start overflow-hidden"
          }
        >
          <ProfileBar />
          <LinkPanel panelBody={<NetworkLinksPanel networkType="youtube" />} />
        </section>
      </LinksLayout>
    </>
  );
}
