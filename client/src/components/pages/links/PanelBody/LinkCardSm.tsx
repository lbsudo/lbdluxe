import { siIconMap, slIconMap } from "@/components/icons";
import { LucideDynamicIcon } from "@/components/icons/LucideDynamicIcon";

type Props = {
  linkUrl: string;
  img: string;
  title: string;
  slIconName?: string;
  siIconName?: string;
  lucIconName?: string;
  hex: string;
};

export const LinkCardSm = ({
  img,
  title,
  slIconName,
  siIconName,
  lucIconName,
  hex,
  linkUrl,
}: Props) => {
  const SlIconComponent = slIconName ? slIconMap[slIconName] : undefined;
  const SiIconComponent = siIconName ? siIconMap[siIconName] : undefined;
  return (
    <>
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
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
            {lucIconName ? (
              <LucideDynamicIcon
                name={lucIconName}
                className="h-6 w-6"
                style={{ color: hex }}
              />
            ) : SlIconComponent ? (
              <SlIconComponent
                className="h-6 w-6"
                style={{ color: hex }}
              />
            ) : SiIconComponent ? (
              <SiIconComponent
                className="h-6 w-6"
                style={{ color: hex }}
              />
            ) : null}
          </div>
        </div>
        <div className="absolute bottom-0 z-10 ml-1 w-full justify-between pb-1">
          <p className="z-10 w-full items-center justify-center text-center text-lg font-bold text-white">
            {title}
          </p>
        </div>
      </a>
    </>
  );
};
