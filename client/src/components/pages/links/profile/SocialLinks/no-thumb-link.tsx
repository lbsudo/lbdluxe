"use client";
import { siIconMap } from "@/components/icons";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { Link } from "@tanstack/react-router";

interface Props {
  title: string;
  siIconName?: string;
  hex: string;
  linkUrl: string;
  target: string;
  className?: string;
}

export const NoThumbLink = ({
  title,
  siIconName,
  hex,
  linkUrl,
  target,
  className,
}: Props) => {
  const SiIconComponent = siIconMap[siIconName!];
  // const router = useRouter();
  return (
    <>
      <Link
        to={linkUrl}
        target={target}
        className={clsx(
          `relative mt-2 mb-3 flex w-full items-center justify-center rounded-full border-none bg-[#121212] p-2`,
          className,
        )}
      >
        <div
          className={
            "flex w-full flex-row items-center justify-between space-x-0"
          }
        >
          {SiIconComponent ? (
          <SiIconComponent
            className="ml-4 h-8 w-8"
            style={{ color: hex, fill: hex }}
          />
          ) : (
            <span></span>
          )}
          <p className={"text-left text-lg font-bold"}>{title}</p>
          <ChevronRight />
        </div>
      </Link>
    </>
  );
};
