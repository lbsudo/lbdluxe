import { useCallback, useEffect, useRef, useState } from "react"
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed"
import { toast } from "sonner"

type PolarCheckoutInstance = Awaited<ReturnType<typeof PolarEmbedCheckout.create>>

/**
 * Opens a Polar hosted checkout in an embedded overlay. Shared by the fitness
 * product card and detail page so the buy flow stays in one place.
 */
export function usePolarCheckout(link?: string | null) {
  const [buying, setBuying] = useState(false)
  const checkoutRef = useRef<PolarCheckoutInstance | null>(null)

  useEffect(() => {
    return () => {
      checkoutRef.current?.close()
      checkoutRef.current = null
    }
  }, [])

  const open = useCallback(async () => {
    if (buying) return
    if (!link) {
      toast.error("This product is not available for purchase yet.")
      return
    }

    setBuying(true)
    checkoutRef.current?.close()
    try {
      const checkout = await PolarEmbedCheckout.create(link, { theme: "dark" })
      checkoutRef.current = checkout
      checkout.addEventListener("success", () => {
        toast.success("Thanks for your purchase! Your download is on its way.")
      })
    } catch (err) {
      console.error(err)
      toast.error("Checkout could not be opened. Please try again.")
    } finally {
      setBuying(false)
    }
  }, [buying, link])

  return { buying, open }
}
