import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default.tsx";
import { Portrait } from "@/components/routes/home/portrait.tsx";
import { Bio } from "@/components/routes/home/bio.tsx";
import { NewsletterSubmit } from "@/components/routes/home/newsletter-submit.tsx";

export const Route = createFileRoute("/")({
  component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:8787";

function Index() {
  return (
    <DefaultLayout>
      <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
        <section>
          <Portrait />
          <Bio />
        </section>
        <section className="flex w-full items-center justify-center pb-8">
          <NewsletterSubmit serverUrl={SERVER_URL} />
        </section>
      </div>
    </DefaultLayout>
  );
}

export default Index;
