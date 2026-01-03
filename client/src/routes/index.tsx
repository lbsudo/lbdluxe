import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "LBDLUXE | HOME",
      },
      {
        name: "description",
        content:
          "Bun + Hono + Vite + React - A modern fullstack development stack for typesafe applications",
      },
      {
        property: "og:title",
        content: "LBDLUXE",
      },
      {
        property: "og:description",
        content:
          "A typesafe fullstack monorepo built with Bun, Hono, Vite, and React",
      },
      {
        property: "og:type",
        content: "website",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="max-w-xl mx-auto flex flex-col gap-6 items-center justify-center min-h-screen">
      <h1 className="text-5xl font-black">bhvr</h1>
    </div>
  );
}

export default Index;
