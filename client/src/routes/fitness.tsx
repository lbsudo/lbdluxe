import { createFileRoute, Outlet } from "@tanstack/react-router";
import DefaultLayout from "@/layouts/default-layout";

export const Route = createFileRoute("/fitness")({
  component: FitnessLayout,
});

/**
 * Shared chrome for every shop page. The per-product age gate lives on the
 * detail route so catalog/list pages stay indexable.
 */
function FitnessLayout() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}
