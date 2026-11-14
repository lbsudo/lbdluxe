import { createFileRoute, Link } from "@tanstack/react-router";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, type FormEvent } from "react";
import {
  confirmOrder,
  getCartSummary,
  getStoredCart,
  initiatePayment,
  type ShippingDetails,
  type StoredCart,
} from "@/lib/merch-checkout";
import { useDynamicHead } from "@/lib/seo";

export const Route = createFileRoute("/merch/checkout")({
  component: RouteComponent,
});

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const EMPTY_DETAILS: ShippingDetails = {
  email: "",
  firstName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
  phone: "",
};

function RouteComponent() {
  const [cart, setCart] = useState<StoredCart | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [details, setDetails] = useState<ShippingDetails>(EMPTY_DETAILS);
  const [payment, setPayment] = useState<{ clientSecret: string; paymentIntentID: string } | null>(null);
  const [orderId, setOrderId] = useState<string | number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredCart();
    setCart(stored);
    if (stored) {
      getCartSummary(stored).then((summary) => setItemCount(summary?.items.length ?? 0));
    }
  }, []);

  useDynamicHead(
    {
      title: "Checkout — LB Dluxe Shop",
      description: "Checkout for LB Dluxe merch.",
      path: "/merch/checkout",
      host: "shop",
    },
    [],
  );

  function update<K extends keyof ShippingDetails>(key: K, value: string) {
    setDetails((d) => ({ ...d, [key]: value }));
  }

  async function continueToPayment(event: FormEvent) {
    event.preventDefault();
    if (!cart) return;
    setBusy(true);
    setError(null);
    try {
      setPayment(await initiatePayment(cart, details));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
    } finally {
      setBusy(false);
    }
  }

  if (orderId !== null) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <h1 className="font-bebas text-5xl tracking-wide">THANK YOU</h1>
        <p className="mt-4 text-muted-foreground">
          Order #{orderId} is confirmed. A receipt is on its way to {details.email}.
        </p>
        <Link to="/merch" className="shop-tab mt-8 inline-flex">Back to merch</Link>
      </section>
    );
  }

  if (!cart || itemCount === 0) {
    return (
      <section className="mx-auto w-full max-w-xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/merch" className="shop-tab mt-6 inline-flex">Browse merch</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 pb-16 pt-10">
      <h1 className="font-bebas text-5xl tracking-wide">CHECKOUT</h1>

      {!payment ? (
        <form onSubmit={continueToPayment} className="mt-8 grid gap-4">
          <Field label="Email" type="email" value={details.email} onChange={(v) => update("email", v)} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" value={details.firstName} onChange={(v) => update("firstName", v)} required />
            <Field label="Last name" value={details.lastName} onChange={(v) => update("lastName", v)} required />
          </div>
          <Field label="Address" value={details.addressLine1} onChange={(v) => update("addressLine1", v)} required />
          <Field label="Apartment, suite, etc." value={details.addressLine2 ?? ""} onChange={(v) => update("addressLine2", v)} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value={details.city} onChange={(v) => update("city", v)} required />
            <Field label="State" value={details.state ?? ""} onChange={(v) => update("state", v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Postal code" value={details.postalCode} onChange={(v) => update("postalCode", v)} required />
            <Field label="Country (2-letter)" value={details.country} onChange={(v) => update("country", v.toUpperCase())} required />
          </div>
          <Field label="Phone" type="tel" value={details.phone ?? ""} onChange={(v) => update("phone", v)} />

          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="shop-tab mt-2 justify-center" disabled={busy}>
            {busy ? "Starting payment…" : "Continue to payment"}
          </button>
        </form>
      ) : !stripePromise ? (
        <p className="mt-8 text-sm text-red-400">Payments are not configured for this site.</p>
      ) : (
        <div className="mt-8">
          <Elements stripe={stripePromise} options={{ clientSecret: payment.clientSecret }}>
            <PaymentForm
              cart={cart}
              details={details}
              paymentIntentID={payment.paymentIntentID}
              onDone={(id) => setOrderId(id)}
            />
          </Elements>
        </div>
      )}
    </section>
  );
}

function PaymentForm({
  cart,
  details,
  paymentIntentID,
  onDone,
}: {
  cart: StoredCart;
  details: ShippingDetails;
  paymentIntentID: string;
  onDone: (orderId: string | number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(event: FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    try {
      const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
      if (result.error) {
        setError(result.error.message ?? "Payment failed");
        return;
      }
      const order = await confirmOrder(cart, details, paymentIntentID);
      onDone(order.orderID ?? paymentIntentID);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={pay} className="grid gap-6">
      <PaymentElement />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" className="shop-tab justify-center" disabled={!stripe || busy}>
        {busy ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        className="rounded-lg border border-border bg-transparent px-3 py-2 text-foreground"
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
