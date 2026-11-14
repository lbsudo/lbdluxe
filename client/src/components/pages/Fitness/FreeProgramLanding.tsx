import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft, Check, Download, LoaderCircle } from "lucide-react"

import {
  FREE_PROGRAM_DOWNLOAD_PATH,
  FREE_PROGRAM_SLUG,
  freeProgramFacts,
  freeProgramWeeks,
} from "./fitness-utils"
import { useAddProgramContact } from "@/hooks/server/resend/POST/useAddProgramContact"

/**
 * The gated landing page for a free program download.
 *
 * The email capture is the gate: on success the download button is revealed.
 * The contact is written to the Resend audience by the API, tagged with the
 * program slug and filed in a per-program segment, so the list can be
 * followed up later.
 */
export function FreeProgramLanding() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { mutate, isPending } = useAddProgramContact()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    mutate(
      { email, firstName: firstName || undefined, program: FREE_PROGRAM_SLUG },
      {
        onSuccess: () => setUnlocked(true),
        onError: (err) =>
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
          ),
      },
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-16">
      <Link
        to="/fitness/$type"
        params={{ type: "program" }}
        className="shop-tab mb-6 inline-flex"
      >
        <ArrowLeft size={16} />
        Back to Programs
      </Link>

      <div className="shop-panel relative overflow-hidden rounded-2xl">
        <div className="relative z-10 grid gap-8 p-6 sm:p-8 md:grid-cols-[1.1fr_0.9fr]">
          {/* Pitch */}
          <div>
            <span className="badge">Free download</span>
            <h1 className="mt-3 font-bebas text-4xl leading-[1] tracking-wide text-foreground sm:text-5xl">
              THE FOUNDATION 30
              <span className="block shop-neon-text">DAY RECOMP</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A complete beginner calisthenics program for building muscle and
              losing fat at the same time. Thirty days, three sessions a week, no
              equipment, and every movement with a clear way in and a clear way
              up.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {freeProgramFacts.map((fact) => (
                <div key={fact.label} className="shop-panel rounded-xl px-3 py-3">
                  <div className="font-bebas text-2xl leading-none text-primary">
                    {fact.value}
                  </div>
                  <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {fact.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="font-bebas text-xl tracking-wide text-foreground">
                WHAT'S INSIDE
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[
                  "Every session written out — sets, reps, rest and tempo.",
                  "An exercise library with form cues, common mistakes, and the ladder above and below each movement.",
                  "Nutrition, sleep and recovery written for someone starting from zero.",
                  "Printable weekly logs so you can see whether the plan is working.",
                  "A Day 29 benchmark and a plan for what to do next.",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gate */}
          <div className="shop-panel h-fit rounded-2xl p-5">
            {unlocked ? (
              <div className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/15">
                  <Check size={24} className="text-primary" aria-hidden />
                </div>
                <h2 className="mt-3 font-bebas text-2xl tracking-wide text-foreground">
                  YOU'RE IN
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  The program is ready. Start Day 1 whenever you're ready.
                </p>
                <a
                  href={FREE_PROGRAM_DOWNLOAD_PATH}
                  download
                  className="shop-btn mt-5 inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"
                >
                  <Download size={16} aria-hidden />
                  Download the program (PDF)
                </a>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Also sent to your inbox so you can find it later. If it does not
                  arrive, check your spam folder and add us to your contacts.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <h2 className="font-bebas text-2xl tracking-wide text-foreground">
                  GET THE FREE PROGRAM
                </h2>
                <p className="text-sm text-muted-foreground">
                  Enter your email and the download unlocks immediately.
                </p>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    First name
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    placeholder="Optional"
                    className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>

                {error && (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="shop-btn mt-1 inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm"
                >
                  {isPending ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      Unlocking…
                    </>
                  ) : (
                    <>
                      <Download size={16} aria-hidden />
                      Unlock the download
                    </>
                  )}
                </button>

                <p className="text-xs leading-relaxed text-muted-foreground">
                  One email with the program. No spam, and you can unsubscribe
                  at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Week breakdown */}
      <section className="mt-10">
        <h2 className="font-bebas text-2xl tracking-wide text-foreground">
          THE FOUR WEEKS
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {freeProgramWeeks.map((week) => (
            <div key={week.week} className="shop-panel rounded-xl p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-bebas text-xl text-primary">
                  Week {week.week}
                </span>
                <span className="font-bebas text-xl tracking-wide text-foreground">
                  {week.title}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{week.intent}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground/70">
                Trains on days {week.days.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-10 text-xs leading-relaxed text-muted-foreground/80">
        The Foundation 30 is general fitness education, not medical advice. Talk
        to a doctor before starting any new training program, especially if you
        have an injury, are pregnant or postpartum, or have a medical condition
        that affects exercise.
      </p>
    </div>
  )
}
