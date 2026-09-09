import { ShimmerButton } from "@/components/ui/shimmer-button.tsx";
import { Github } from "lucide-react";
import { Link } from "@tanstack/react-router";
import React, { ReactElement } from "react";
import type { CMSPage } from "shared";

interface PageHeaderProps {
  buttonText: string;
  title: string;
  description: string;
  /** Optional icon rendered inside the ShimmerButton, before the button text. */
  icon?: ReactElement;
  /** Size (in pixels) to apply to the icon when the caller does NOT specify it themselves. */
  iconSize?: number; // default will be 16
  /** CMS page whose hero.meta/title and hero.links[0] override the static props. */
  page?: CMSPage | null;
}
export default function PageHeader({
  buttonText,
  title,
  description,
  icon,
  iconSize = 16,
  page,
}: PageHeaderProps) {
  const heroLink = page?.hero?.links?.[0]?.link;
  const resolvedTitle = page?.meta?.title?.trim() || title || page?.title?.trim();
  const resolvedDescription = page?.meta?.description?.trim() || description;
  const resolvedLabel = heroLink?.label?.trim() || buttonText;
  const href = heroLink?.url?.trim() || null;
  const newTab = !!heroLink?.newTab;

  const action = (
    <ShimmerButton className="py-0 text-lg flex flex-row justify-center items-center gap-1 mb-4 font-switzer">
      {icon ? (
        (icon.props as Record<string, unknown>)["size"] !== undefined ? (
          icon
        ) : (
          React.cloneElement(
            icon as React.ReactElement<Record<string, unknown>>,
            { size: iconSize },
          )
        )
      ) : (
        <Github size={iconSize} />
      )}
      {resolvedLabel}
    </ShimmerButton>
  );

  const wrappedAction = href
    ? href.startsWith("/")
      ? (
          <Link to={href} className="contents">
            {action}
          </Link>
        )
      : (
          <a
            href={href}
            target={newTab ? "_blank" : undefined}
            rel={newTab ? "noreferrer noopener" : undefined}
            className="contents"
          >
            {action}
          </a>
        )
    : action;

  return (
    <div
        className={`
          relative mx-auto
          max-w-2xl w-full flex flex-col items-center
          text-center z-20 pt-12
        `}
    >
      {wrappedAction}
      <h1
        className="
       font-witzer font-bold text-6xl leading-[1.1] text-center
       bg-linear-to-b from-[#fafafa] to-[#a3a3a3]
       bg-clip-text text-transparent
       animate-enter scroll-mt-20 font-stretch-extra-condensed tracking-tighter
     "
        style={{ "--stagger": 1 } as React.CSSProperties}
      >
        {resolvedTitle}
      </h1>
      <p className={"font-bebas text-lg max-w-xl text-center"}>{resolvedDescription}</p>
    </div>
  );
}