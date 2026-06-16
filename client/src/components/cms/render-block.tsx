import { useState } from "react"
import type { CMSBlock, CMSContentBlock, CMSCTABlock, CMSProfileBlock } from "shared"
import { Card } from "@/components/ui/card"
import { useTypewriter } from "@/hooks/use-typewriter"

const columnClass: Record<string, string> = {
  oneThird: "md:col-span-4",
  half: "md:col-span-6",
  twoThirds: "md:col-span-8",
  full: "md:col-span-12",
}

function ContentBlock({ block }: { block: CMSContentBlock }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-4 max-w-6xl mx-auto w-full">
      {block.columns.map((col, i) => (
        <div
          key={i}
          className={`${columnClass[col.size] ?? "md:col-span-6"} prose prose-lg dark:prose-invert max-w-none`}
          dangerouslySetInnerHTML={{ __html: col.richText }}
        />
      ))}
    </div>
  )
}

function CTABlock({ block }: { block: CMSCTABlock }) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-8 max-w-6xl mx-auto w-full text-center">
      <div
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: block.richText }}
      />
      {block.links?.map((item) => (
        <a
          key={item.id}
          href={item.link.url ?? "#"}
          target={item.link.newTab ? "_blank" : undefined}
          rel={item.link.newTab ? "noopener noreferrer" : undefined}
          className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
            item.link.appearance === "outline"
              ? "border border-current text-foreground hover:bg-foreground/10"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {item.link.label}
        </a>
      ))}
    </div>
  )
}

function ProfileBlock({ block }: { block: CMSProfileBlock }) {
  const words = block.words.map((w) => w.word)
  const typewriter = useTypewriter(words)
  const imageUrl = block.profileImage?.url
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col items-center gap-6 px-4 max-w-6xl mx-auto w-full">
      <div className="w-full flex flex-col items-center justify-center text-center">
        <Card
          className="
            w-80 h-80 flex flex-col items-center justify-center gap-4
            border border-neutral-500/40 rounded-2xl
            backdrop-blur-lg bg-background/5 dark:bg-background/40
            shadow-xl p-0
          "
        >
          {imageUrl && !imgError ? (
            <img
              alt={`${block.name} profile photo`}
              src={imageUrl}
              onError={() => setImgError(true)}
              className="w-76 h-76 object-cover rounded-xl filter grayscale dark:filter-none"
            />
          ) : (
            <div className="text-muted-foreground text-sm">
              No profile image
            </div>
          )}
        </Card>
      </div>

      <div
        className="
          w-full max-w-lg px-6 py-6 rounded-2xl backdrop-blur-sm
          bg-background/10
          dark:bg-neutral-400/10
          border dark:border-neutral-300/25 border-neutral-800/25
          shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]
          flex flex-col items-center gap-3 text-center
        "
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground drop-shadow-sm">
          {block.name}
        </h1>

        {words.length > 0 && (
          <p className="text-2xl font-medium text-[#8F4BD2] h-7 tracking-wide select-none">
            {typewriter}
          </p>
        )}

        {block.description && (
          <p className="text-xl mt-2 leading-relaxed text-foreground/70 max-w-sm">
            {block.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function RenderBlock({ block }: { block: CMSBlock }) {
  switch (block.blockType) {
    case "content":
      return <ContentBlock block={block} />
    case "cta":
      return <CTABlock block={block} />
    case "profile":
      return <ProfileBlock block={block} />
    default:
      return null
  }
}
