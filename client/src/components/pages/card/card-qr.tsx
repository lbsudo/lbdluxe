import { useEffect, useRef } from "react"
import QRCode from "qrcode"

interface Props {
  url: string
}

export function CardQr({ url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    QRCode.toCanvas(canvas, url, {
      width: 160,
      margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
    }).catch(() => {})
  }, [url])

  return (
    <section className="flex flex-col items-center gap-2">
      <div className="rounded-2xl bg-white p-3">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-xs text-white/50">Scan to open this card</p>
    </section>
  )
}
