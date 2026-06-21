import type { ReactNode } from "react";
import { useCMSLinksProfile } from "@/hooks/server/cms/GET/useCMSLinksProfile";
import { useCMSProfileLinks } from "@/hooks/server/cms/GET/useCMSProfileLinks";
import { LinkPanelSkeleton } from "./LinkPanelSkeleton";
import { MotionUp } from "@/components/global/motions/motion-up";
import { ProfileDetails } from "./profile/profile-details";
import { PanelBody } from "./PanelBody/PanelBody";

interface LinkPanelProps {
  panelBody?: ReactNode;
}

export const LinkPanel = ({ panelBody }: LinkPanelProps) => {
  const { isLoading: profileLoading } = useCMSLinksProfile();
  const { isLoading: linksLoading } = useCMSProfileLinks();

  if (profileLoading || linksLoading) return <LinkPanelSkeleton />;

  return (
    <>
      <div
        className={
          "relative z-2 flex max-w-sm flex-col items-center justify-center rounded-3xl md:mt-8 md:max-w-md"
        }
      >
        <ProfileDetails />
        <MotionUp>{panelBody ?? <PanelBody />}</MotionUp>
      </div>
    </>
  );
};

