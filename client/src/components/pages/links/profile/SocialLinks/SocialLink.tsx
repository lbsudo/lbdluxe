import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { siIconMap } from "@/components/icons";

interface Props {
  href: string;
  target: string;
  ariaLabel: string;
  iconName: string;
  hex: string;
  customSrc?: string;
}

export default function SocialLink({
  href,
  target,
  ariaLabel,
  iconName,
  hex,
  customSrc,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const IconComponent = siIconMap[iconName];

  const showImg = customSrc && !imgError;
  const showIcon = !customSrc || imgError;

  return (
    <>
      <Link
        to={href}
        target={target}
        aria-label={ariaLabel}
        className={"flex items-center justify-center rounded-full bg-white p-2"}
      >
        {showImg && (
          <img
            src={customSrc}
            alt={ariaLabel}
            className="h-6 w-6 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {showIcon && IconComponent ? (
          <IconComponent
            className="h-6 w-6 text-[${hex}]"
            style={{ color: hex }}
          />
        ) : !showImg && !IconComponent ? (
          <span>Icon not found</span>
        ) : null}
      </Link>
    </>
  );
}
