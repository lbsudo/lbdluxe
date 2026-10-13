import { useEffect, useState, type ReactNode } from "react"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "lbd-fitness-age-ack"

/**
 * Blocks age-restricted product content until the visitor confirms they are of
 * age. Acknowledgement is remembered in localStorage so it's asked only once.
 * Set `enabled` to false for products that aren't age-restricted.
 */
export function AgeGate({
  children,
  enabled = true,
}: {
  children: ReactNode
  enabled?: boolean
}) {
  const [acknowledged, setAcknowledged] = useState<boolean | null>(null)

  useEffect(() => {
    if (!enabled) return
    try {
      setAcknowledged(window.localStorage.getItem(STORAGE_KEY) === "1")
    } catch {
      setAcknowledged(false)
    }
  }, [enabled])

  const confirm = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // Ignore storage failures (private mode) — the gate still lifts for this view.
    }
    setAcknowledged(true)
  }

  const decline = () => {
    window.location.href = "https://lbdluxe.com"
  }

  if (!enabled) return <>{children}</>

  if (acknowledged === null) return null

  if (acknowledged) return <>{children}</>

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center">
      <ShieldAlert className="size-10 text-muted-foreground" />
      <h2 className="text-xl font-semibold">Are you of legal age?</h2>
      <p className="text-sm text-muted-foreground">
        This product is age-restricted. You must be at least 18 years old (or the legal age in
        your jurisdiction) to view it.
      </p>
      <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
        <Button onClick={confirm}>Yes, I am 18 or older</Button>
        <Button variant="outline" onClick={decline}>
          No, take me back
        </Button>
      </div>
    </div>
  )
}
