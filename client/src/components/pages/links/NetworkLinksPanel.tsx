"use client";
import { Link } from "@tanstack/react-router";
import { useCMSContentNetworks } from "@/hooks/server/cms/GET/useCMSContentNetworks";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { NoThumbLink } from "./profile/SocialLinks/no-thumb-link";
import { PanelBodySkeleton } from "./PanelBody/PanelBodySkeleton";

type NetworkType = "youtube" | "rumble";

interface NetworkLinksPanelProps {
  networkType: NetworkType;
}

export const NetworkLinksPanel = ({ networkType }: NetworkLinksPanelProps) => {
  const { data, isLoading } = useCMSContentNetworks();

  if (isLoading) return <PanelBodySkeleton />;

  const networks = (data ?? []).filter(
    (n) => n.networkType === networkType,
  );
  const sorted = [...networks].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <div className="relative z-10 flex min-h-screen w-[440px] max-w-[352px] flex-col items-center justify-start overflow-y-auto bg-black pt-4 md:max-w-[2000px]">
      {sorted.map((network) => (
        <NoThumbLink
          key={network.id}
          linkUrl={network.url}
          title={network.title}
          siIconName={networkType === "rumble" ? "SiRumble" : "SiYoutube"}
          hex={
            network.hexColor ??
            (networkType === "rumble" ? "#3E8E41" : "#FF0000")
          }
          target="_blank"
        />
      ))}
      <Link to="/links" className="mt-2 mb-3">
        <HoverBorderGradient
          as="button"
          className={"text-sm flex items-center justify-center gap-2"}
        >
          Back to Links
        </HoverBorderGradient>
      </Link>
    </div>
  );
};
