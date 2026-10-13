import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";
import type { CSSProperties } from "react";

/**
 * Renders a Lucide icon by its CMS-provided name.
 *
 * The previous implementation did `import * as LucideIcons from "lucide-react"`
 * and indexed the namespace at runtime, which defeated tree-shaking and pulled
 * the *entire* icon library (~880 KB) onto the links pages. lucide's dynamic
 * entry point instead emits one tiny async chunk per icon, loaded on demand.
 */
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const ICON_LOOKUP = new Map<string, IconName>(
  iconNames.map((name) => [normalize(name), name]),
);

interface Props {
  name: string;
  className?: string;
  style?: CSSProperties;
}

export function LucideDynamicIcon({ name, className, style }: Props) {
  const iconName = ICON_LOOKUP.get(normalize(name));
  if (!iconName) return null;

  return (
    <DynamicIcon
      name={iconName}
      className={className}
      style={style}
      fallback={() => null}
    />
  );
}
