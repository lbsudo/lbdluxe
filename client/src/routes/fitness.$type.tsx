import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  FITNESS_TYPE_META,
  FITNESS_TYPE_ORDER,
} from "@/components/pages/Fitness/fitness-utils";

export const Route = createFileRoute("/fitness/$type")({
  component: TypeLayout,
});

function TypeLayout() {
  const { type } = Route.useParams();

  return (
    <>
      <nav className="mx-auto mt-6 flex w-full max-w-5xl flex-wrap gap-2 px-4">
        {FITNESS_TYPE_ORDER.map((t) => {
          const meta = FITNESS_TYPE_META[t];
          const active = t === type;
          return (
            <Link
              key={t}
              to="/fitness/$type"
              params={{ type: t }}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/50 hover:bg-accent/50",
              )}
            >
              {meta.label}
            </Link>
          );
        })}
      </nav>
      <Outlet />
    </>
  );
}
