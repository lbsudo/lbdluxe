import { useEffect, useRef } from "react"

/**
 * Feeds pointer position into the `.shop-tilt` CSS (custom properties
 * `--tilt-x` / `--tilt-y` for rotation and `--mx` / `--my` for the
 * cursor-following highlight).
 *
 * The hook is deliberately inert unless it should run: reduced motion,
 * touch devices (coarse pointers), and matchMedia-less environments all
 * bail out, leaving the CSS variables at their 0deg/50% defaults so the
 * card renders flat — the tilt is a progressive enhancement, never a
 * requirement.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 7) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window.matchMedia !== "function") return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const coarse = window.matchMedia("(pointer: coarse)")
    if (reduced.matches || coarse.matches) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      // -0.5..0.5 from the card center, doubled to a -1..1 range.
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty("--tilt-y", `${(px * 2 * maxDeg).toFixed(2)}deg`)
      el.style.setProperty("--tilt-x", `${(-py * 2 * maxDeg).toFixed(2)}deg`)
      el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`)
    }

    const onLeave = () => {
      el.style.removeProperty("--tilt-x")
      el.style.removeProperty("--tilt-y")
      el.style.removeProperty("--mx")
      el.style.removeProperty("--my")
    }

    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [maxDeg])

  return ref
}
