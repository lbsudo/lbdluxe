import { useRouter, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { ControlBarModal } from "@/components/global/navigation/controlBarModal.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";

export function ControlBar() {
  const { location } = useRouterState();
  const pathname = location.pathname;
  const router = useRouter();

  // 🔹 config arrays
  const mainRoutes = [
    { label: "Home", path: "/" },
    { label: "Works", path: "/works" },
    { label: "Products", path: "/products" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <>
      <div className="inset-x-0 bottom-0 z-10 mb-12 hidden w-full items-center justify-center md:flex md:fixed">
        <div
          className={
            "flex  items-center justify-center rounded-md py-1.5 px-1.5 bg-neutral-700/50 backdrop-blur-xl border border-neutral-500 "
          }
        >
          <ButtonGroup>
            {/* 🔹 Main nav buttons */}
            {mainRoutes.map(({ label, path }) => (
              <Button
                key={path}
                onClick={() => router.navigate({ to: path })}
                className={
                  pathname === path
                    ? "bg-white text-xl text-black rounded-md"
                    : "bg-transparent text-xl rounded-md "
                }
                variant="bar"
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
          {/* 🔹 Keyboard dialog */}
          <ControlBarModal />
        </div>
      </div>
    </>
  );
}
