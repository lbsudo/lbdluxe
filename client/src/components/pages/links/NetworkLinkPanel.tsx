import { ProfileDetails } from "./profile/profile-details";
import { PanelBodySkeleton } from "./PanelBody/PanelBodySkeleton";

export const NetworkLinkPanel = () => (
  <div className="relative z-2 flex max-w-sm flex-col items-center justify-center rounded-3xl md:mt-8 md:max-w-md">
    <ProfileDetails />
    <PanelBodySkeleton />
  </div>
);