import { ProfileDetails } from "./profile/profile-details";
import { PanelBody } from "./PanelBody/PanelBody";

export const LinkPanel = () => {
  return (
    <>
      <div
        className={
          "relative z-2 flex max-w-sm flex-col items-center justify-center rounded-3xl md:mt-8 md:max-w-md"
        }
      >
        {/*Scroll Content*/}
        <ProfileDetails />
        <PanelBody />
      </div>
    </>
  );
};
