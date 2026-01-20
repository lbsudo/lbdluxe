import * as SlIcons from "react-icons/sl";
import * as SiIcons from "react-icons/si";
import { Link } from "@tanstack/react-router";

type Props = {
  linkUrl: string;
  img: string;
  title: string;
  slIconName?: keyof typeof SlIcons;
  siIconName?: keyof typeof SiIcons;
  hex: string;
};

export const LinkCardSm = ({
  img,
  title,
  slIconName,
  siIconName,
  hex,
  linkUrl,
}: Props) => {
  const SlIconComponent = SlIcons[slIconName!];
  const SiIconComponent = SiIcons[siIconName!];
  return (
    <>
      <Link
        to={linkUrl}
        target="_blank"
        className="relative mt-2 mb-3 flex w-1/2 items-center justify-center rounded-lg border-none bg-transparent"
      >
        <div className="relative w-full rounded-lg">
          {/* Image */}
          <img
            alt="Link Cover Image"
            className="z-1 h-48 w-full rounded-lg object-cover"
            height={200}
            src={img}
            width={200}
          />

          {/* Black overlay with 50% transparency */}
          <div className="absolute inset-0 z-3 rounded-lg bg-black/50"></div>
          <div className="absolute top-4 right-4 z-10">
            {SlIconComponent ? (
              <SlIconComponent
                className={`text-[${hex}] h-6 w-6`}
                style={{ color: hex }}
              />
            ) : (
              <span></span>
            )}
            {SiIconComponent ? (
              <SiIconComponent
                className={`text-[${hex}] h-6 w-6`}
                style={{ color: hex }}
              />
            ) : (
              <></>
            )}
            {/* <SlLink className="h-5 w-5 test-white hover:test-gray-300" />*/}
          </div>
        </div>
        <div className="absolute bottom-0 z-10 ml-1 w-full justify-between pb-1">
          <p className="z-10 w-full items-center justify-center text-center text-lg font-bold text-white">
            {title}
          </p>
        </div>
      </Link>
    </>
  );
};
