/**
 * Talks to the CMS's ecommerce endpoints directly. A guest cart is kept in
 * localStorage together with its secret, which the CMS needs for every call.
 */

const CMS_URL = import.meta.env.VITE_CMS_URL || "https://cms.lbdluxe.com"
const CART_KEY = "lbdluxe-merch-cart"

export interface StoredCart {
  id: number
  secret: string
}

export interface ShippingDetails {
  email: string
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone?: string
}

export function getStoredCart(): StoredCart | null {
  const raw = localStorage.getItem(CART_KEY)
  return raw ? (JSON.parse(raw) as StoredCart) : null
}

export function clearStoredCart() {
  localStorage.removeItem(CART_KEY)
}

async function createCart(): Promise<StoredCart> {
  const res = await fetch(`${CMS_URL}/api/carts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
  if (!res.ok) throw new Error("Could not start a cart")
  const body = (await res.json()) as { doc: { id: number; secret?: string } }
  if (!body.doc.secret) throw new Error("Cart was created without a secret")
  const cart = { id: body.doc.id, secret: body.doc.secret }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  return cart
}

async function ensureCart(): Promise<StoredCart> {
  return getStoredCart() ?? createCart()
}

/** Adds one variant to the cart, starting a new cart if the stored one has expired. */
export async function addVariantToCart(productId: number, variantId: number): Promise<StoredCart> {
  let cart = await ensureCart()
  const send = (c: StoredCart) =>
    fetch(`${CMS_URL}/api/carts/${c.id}/add-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item: { product: productId, variant: variantId },
        quantity: 1,
        secret: c.secret,
      }),
    })

  let res = await send(cart)
  if (res.status === 404) {
    clearStoredCart()
    cart = await createCart()
    res = await send(cart)
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(body.message ?? "Could not add this item")
  }
  return cart
}

export async function getCartSummary(cart: StoredCart) {
  const res = await fetch(`${CMS_URL}/api/carts/${cart.id}?secret=${encodeURIComponent(cart.secret)}&depth=2`)
  if (!res.ok) return null
  return (await res.json()) as {
    items: { quantity: number; variant?: { id: number; title?: string | null } | number | null; product?: { id: number; title?: string | null } | number | null }[]
    subtotal?: number | null
  }
}

function shippingPayload(details: ShippingDetails) {
  return {
    title: "",
    firstName: details.firstName,
    lastName: details.lastName,
    addressLine1: details.addressLine1,
    addressLine2: details.addressLine2 ?? "",
    city: details.city,
    state: details.state ?? "",
    postalCode: details.postalCode,
    country: details.country,
    phone: details.phone ?? "",
  }
}

/** Starts a Stripe payment for the cart. Returns the client secret for Stripe Elements. */
export async function initiatePayment(cart: StoredCart, details: ShippingDetails) {
  const res = await fetch(`${CMS_URL}/api/payments/stripe/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cartID: cart.id,
      secret: cart.secret,
      customerEmail: details.email,
      shippingAddress: shippingPayload(details),
      billingAddress: shippingPayload(details),
    }),
  })
  const body = (await res.json()) as { clientSecret?: string; paymentIntentID?: string; message?: string }
  if (!res.ok || !body.clientSecret || !body.paymentIntentID) {
    throw new Error(body.message ?? "Could not start payment")
  }
  return { clientSecret: body.clientSecret, paymentIntentID: body.paymentIntentID }
}

/** Creates the order once Stripe reports the payment as succeeded. */
export async function confirmOrder(cart: StoredCart, details: ShippingDetails, paymentIntentID: string) {
  const res = await fetch(`${CMS_URL}/api/payments/stripe/confirm-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cartID: cart.id,
      secret: cart.secret,
      customerEmail: details.email,
      paymentIntentID,
    }),
  })
  const body = (await res.json()) as { message?: string; orderID?: number | string }
  if (!res.ok) throw new Error(body.message ?? "Could not confirm the order")
  clearStoredCart()
  return body
}
