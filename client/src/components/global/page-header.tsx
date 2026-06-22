import { ShimmerButton } from "@/components/ui/shimmer-button.tsx";
import { Github } from "lucide-react";
import React, { ReactElement } from "react";

interface PageHeaderProps {
  buttonText: string;
  title: string;
  description: string;
  /** Optional icon rendered inside the ShimmerButton, before the button text. */
  icon?: ReactElement;
  /** Size (in pixels) to apply to the icon when the caller does NOT specify it themselves. */
  iconSize?: number; // default will be 16
}
export default function PageHeader({
  buttonText,
  title,
  description,
  icon,
  iconSize = 16,
}: PageHeaderProps) {
  return (
    <div
        className={`
          relative mx-auto
          max-w-2xl w-full flex flex-col items-center
          text-center z-20 pt-12
        `}

    >
      {/*<div className={'z-2 flex flex-col items-center justify-start w-2/3 text-center font-witzer'}>*/}
      {/*    <ShimmerButton className={'py-0 text-lg flex flex-row justify-center items-center gap-1 mb-4 font-switzer'}><LuGithub size={16}/>{buttonText}</ShimmerButton>*/}
      <ShimmerButton className="py-0 text-lg flex flex-row justify-center items-center gap-1 mb-4 font-switzer">
        {icon ? (
          // If the caller already gave the element a size, keep it.
          // Otherwise, clone it and inject the requested size.
          (icon.props as Record<string, unknown>)["size"] !== undefined ? (
            icon
          ) : (
            React.cloneElement(
              icon as React.ReactElement<Record<string, unknown>>,
              { size: iconSize },
            )
          )
        ) : (
          // Fallback to the default GitHub icon
          <Github size={iconSize} />
        )}
        {buttonText}
      </ShimmerButton>
      <h1
        className="
       font-witzer font-bold text-6xl leading-[1.1] text-center
       bg-linear-to-b from-[#fafafa] to-[#a3a3a3]
       bg-clip-text text-transparent
       animate-enter scroll-mt-20 font-stretch-extra-condensed tracking-tighter
     "
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        {title}
      </h1>
      {/*<h1 className={'font-bebas text-7xl font-bold'}>RECENT WORK</h1>*/}

      <p className={"font-bebas text-lg max-w-xl text-center"}>{description}</p>
    </div>
  );
}
