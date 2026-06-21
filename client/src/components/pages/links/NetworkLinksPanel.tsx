"use client";
import { useCMSContentNetworks } from "@/hooks/server/cms/GET/useCMSContentNetworks";
import { NoThumbLink } from "./profile/SocialLinks/no-thumb-link";
import { PanelBodySkeleton } from "./PanelBody/PanelBodySkeleton";

type NetworkType = "youtube" | "rumble";

interface NetworkLinksPanelProps {
  networkType: NetworkType;
}

export const NetworkLinksPanel = ({ networkType }: NetworkLinksPanelProps) => {
  const { data: networks, isLoading } = useCMSContentNetworks(networkType);

  if (isLoading) return <PanelBodySkeleton />;

  const sorted = [...(networks ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  return (
    <div className="relative z-10 flex w-[440px] max-w-[352px] flex-col items-center justify-center bg-black pb-4 md:max-w-[2000px]">
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
    </div>
  );
};

