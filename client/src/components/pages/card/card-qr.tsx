import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"

interface Props {
  url: string
  accent: string
}

export function CardQr({ url, accent }: Props) {
  const [open, setOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!open || !canvas) return
    QRCode.toCanvas(canvas, url, {
      width: 160,
      margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).catch(() => {})
  }, [open, url])

  return (
    <section className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full px-4 py-2 text-xs font-medium text-white/80 ring-1 ring-white/10 transition hover:bg-white/5"
        style={{ color: accent }}
        aria-expanded={open}
      >
        {open ? "Hide QR" : "Show QR"}
      </button>
      {open && (
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-2xl bg-white p-3">
            <canvas ref={canvasRef} />
          </div>
          <p className="text-xs text-white/50">Scan to open this card</p>
        </div>
      )}
    </section>
  )
}
