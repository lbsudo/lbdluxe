"use client";

import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
// import { Loader } from 'lucide-react'
import DefaultLayout from "@/layouts/default-layout.tsx";
import { Bio } from "@/components/pages/Home/bio.tsx";
import { NewsletterSubmit } from "@/components/pages/Home/newsletter-submit.tsx";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

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
    </>
  );
}
