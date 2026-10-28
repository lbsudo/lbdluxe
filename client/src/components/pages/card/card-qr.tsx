import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { X } from "lucide-react";

interface Props {
  url: string;
  accent: string;
  open: boolean;
  onClose: () => void;
}

/** Relative luminance of a #rrggbb colour (WCAG 2.1). */
function relativeLuminance(hex: string): number {
  const raw = hex.replace("#", "").trim();
  if (raw.length !== 6) return 0;
  const channel = (offset: number) => {
    const c = parseInt(raw.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4)
  );
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The card's accent colour is used for the QR modules when it stays legible
 * against the white quiet zone. Scanners cope with a contrast ratio well
 * below the WCAG text threshold, but a pale accent still produces a code
 * that struggles, so anything under 4:1 falls back to near-black.
 */
function moduleColor(accent: string): string {
  return contrastRatio(accent, "#ffffff") >= 4 ? accent : "#0a0a0a";
}

/**
 * The scannable card, full screen.
 *
 * This is the view you hand to someone: a large, high-contrast code on white
 * with nothing else competing for the scanner.
 */
export function CardQr({ url, accent, open, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setFailed(false);
    QRCode.toCanvas(canvas, url, {
      width: 320,
      margin: 2,
      // "M" keeps the modules large enough to scan off a phone screen while
      // still tolerating a fingerprint or a glare across the code.
      errorCorrectionLevel: "M",
      color: { dark: moduleColor(accent), light: "#ffffff" },
    }).catch(() => setFailed(true));
  }, [open, url, accent]);

  // Escape closes, and the page behind must not scroll while the sheet is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]/95 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="QR code for this card"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div
        className="flex w-full max-w-sm flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-3xl bg-white p-5 shadow-2xl">
          {failed ? (
            <p className="px-4 py-10 text-center text-sm text-black/60">
              Could not generate the QR code.
            </p>
          ) : (
            <canvas ref={canvasRef} className="h-auto w-full" />
          )}
        </div>

        <p className="break-all text-center font-mono text-xs text-white/50">
          {url}
        </p>
        <p className="text-center text-sm font-medium text-white/80">
          Scan to open this card
        </p>
      </div>
    </div>
  );
}
