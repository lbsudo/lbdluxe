import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
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
      <nav
        className="mx-auto mt-8 flex w-full max-w-5xl flex-wrap gap-2 px-4"
        aria-label="Shop categories"
      >
        {FITNESS_TYPE_ORDER.map((t) => {
          const active = t === type;
          return (
            <Link
              key={t}
              to="/fitness/$type"
              params={{ type: t }}
              className="shop-tab"
              data-active={active}
            >
              {FITNESS_TYPE_META[t].label}
            </Link>
          );
        })}
      </nav>
      <Outlet />
    </>
  );
}
