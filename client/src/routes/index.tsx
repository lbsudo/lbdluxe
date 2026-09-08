"use client";

import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
// import { Loader } from 'lucide-react'
import DefaultLayout from "@/layouts/default-layout.tsx";
import { Bio } from "@/components/pages/Home/bio.tsx";
import { NewsletterSubmit } from "@/components/pages/Home/newsletter-submit.tsx";
import { RenderBlock } from "@/components/cms/render-block";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useCMSPage } from "@/hooks/server/cms/GET/useCMSPage";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, seoHead } from "@/lib/seo";

const container = {
  hidden: {},
  visible: {
    transition: {
      delay: 0.5,          // wait for splash fade‑out before children animate
      staggerChildren: 0.4 // more space between bio and newsletter
    }
  }
};


export const Route = createFileRoute("/")({
  head: () =>
    seoHead({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      path: "/",
    }),
  component: Index,
});

function Index() {
  const [isClient, setIsClient] = useState(false);
  const { data: cmsPage } = useCMSPage("home");

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

  const hasCMSContent = cmsPage && cmsPage.layout?.length > 0;

  if (hasCMSContent) {
    return (
      <div className="pt-16">
        <DefaultLayout>
          <motion.div
            className="max-w-6xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {cmsPage.layout.map((block, i) => (
              <motion.section key={i} variants={fadeUp} className="w-full">
                <RenderBlock block={block} />
              </motion.section>
            ))}
            <motion.section className="flex w-full items-center justify-center pb-8" variants={fadeUp}>
              <NewsletterSubmit />
            </motion.section>
          </motion.div>
        </DefaultLayout>
      </div>
    );
  }

  return (
    <div className={'pt-16'}>
      <DefaultLayout>
        <motion.div
          className="max-w-6xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.section variants={fadeUp}>
            <Bio />
          </motion.section>
          <motion.section className="flex w-full items-center justify-center pb-8" variants={fadeUp}>
            <NewsletterSubmit />
          </motion.section>
        </motion.div>
      </DefaultLayout>
    </div>
  );
}
