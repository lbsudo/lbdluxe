"use client";

import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
// import { Loader } from 'lucide-react'
import LinksLayout from "@/layouts/links-layout";
import { LinkPanel } from "@/components/pages/links/linkpanel";
import { ProfileBar } from "@/components/pages/links/profile/profile-bar";

export const Route = createFileRoute("/links/")({
  head: () => ({
    meta: [{ title: "LBDLUXE | Home" }], // include at least one recognized field
  }),
  component: Index,
});

function Index() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Notify the splash screen when the home route has finished mounting
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
            "relative flex flex-col items-center justify-center overflow-hidden"
          }
        >
          <ProfileBar />
          <LinkPanel />
        </section>
      </LinksLayout>
    </>
  );
}
