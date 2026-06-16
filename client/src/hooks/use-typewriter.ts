import { useEffect, useState } from "react"

export function useTypewriter(
  words: string[],
  speed = 90,
  deleteSpeed = 40,
  pause = 1200,
) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setBlink((v) => !v), 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (words.length === 0) return

    const current = words[index]

    if (!deleting && subIndex === current?.length) {
      setTimeout(() => setDeleting(true), pause)
      return
    }

    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(
      () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : speed,
    )

    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, words, pause, speed, deleteSpeed])

  return words.length > 0
    ? `${words[index]?.substring(0, subIndex) ?? ""}${blink ? "|" : ""}`
    : ""
}
