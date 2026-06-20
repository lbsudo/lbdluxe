import { Link } from "@tanstack/react-router";
import * as Icons from "react-icons/si";

interface Props {
  href: string;
  target: string;
  ariaLabel: string;
  iconName: keyof typeof Icons;
  hex: string;
}

export default function SocialLink({
  href,
  target,
  ariaLabel,
  iconName,
  hex,
}: Props) {
  const IconComponent = Icons[iconName];
  return (
    <>
      <Link
        to={href}
        target={target}
        aria-label={ariaLabel}
        className={"flex items-center justify-center rounded-full bg-white p-2"}
      >
        {IconComponent ? (
          <IconComponent
            className="h-6 w-6 text-[${hex}]"
            style={{ color: hex }}
          />
        ) : (
          <span>Icon not found</span>
        )}
      </Link>
    </>
  );
}
