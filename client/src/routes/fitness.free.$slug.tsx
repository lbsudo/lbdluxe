import { createFileRoute } from "@tanstack/react-router";

import { FreeProgramLanding } from "@/components/pages/Fitness/FreeProgramLanding";
import {
  FREE_PROGRAM_OG_PATH,
  FREE_PROGRAM_SLUG,
} from "@/components/pages/Fitness/fitness-utils";
import { useDynamicHead } from "@/lib/seo";

/**
 * The gated landing page for a free program download.
 *
 * The path segment is a static "free", so it outranks the sibling
 * /fitness/$type/$slug route for this shape of URL.
 */
export const Route = createFileRoute("/fitness/free/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();

  useDynamicHead(
    {
      title: "The Foundation 30 - Day Recomp",
      description:
        "A 30-day beginner calisthenics program for building muscle and losing fat at the same time. No equipment, no guesswork. Free download.",
      path: `/fitness/free/${slug || FREE_PROGRAM_SLUG}`,
      host: "shop",
      image: FREE_PROGRAM_OG_PATH,
      type: "website",
    },
    [slug],
  );

  return <FreeProgramLanding />;
}
