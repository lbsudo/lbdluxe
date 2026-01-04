"use client";

import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
// import { Loader } from 'lucide-react'
import DefaultLayout from "@/layouts/default-layout.tsx";
import { Bio } from "@/components/pages/Home/bio.tsx";
import { NewsletterSubmit } from "@/components/pages/Home/newsletter-submit.tsx";

export const Route = createFileRoute("/")({
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

  if (!isClient) return null;

  return (
    <>
      <DefaultLayout>
        <div className="max-w-6xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
          <section>
            <Bio />
          </section>
          <section className="flex w-full items-center justify-center pb-8">
            <NewsletterSubmit />
          </section>
        </div>
      </DefaultLayout>
    </>
  );
}
