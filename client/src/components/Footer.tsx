import { useState } from "react"
import { FaRegCopyright, FaRegEnvelope, siIconMap } from '@/components/icons'
import { Button } from '@/components/ui/button.tsx'
import { useCMSLinksProfile } from '@/hooks/server/cms/GET/useCMSLinksProfile'
import { getFaviconUrl, resolveSocialIcon } from '@/lib/resolve-social-icon'
import type { CMSLinksProfile } from "shared"

type SocialLink = NonNullable<CMSLinksProfile['socialLinks']>[number]

function FooterSocialIcon({ link }: { link: SocialLink }) {
  const [imgError, setImgError] = useState(false)

  const { iconName } = resolveSocialIcon(link.url)
  const IconComponent = siIconMap[iconName]
  const customSrc = link.iconType === 'custom' && link.icon?.url ? link.icon.url : ''
  const fallbackSrc = iconName === 'FaGlobe' ? getFaviconUrl(link.url) : ''
  const src = customSrc || fallbackSrc

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.title ? `Visit ${link.title}` : 'Visit social link'}
      title={link.title}
      className="flex size-10 items-center justify-center rounded-full border border-border bg-muted text-neutral-500 transition-colors hover:bg-foreground hover:text-neutral-100"
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={link.title}
          className="size-5 rounded-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : IconComponent ? (
        <IconComponent className="size-5" />
      ) : null}
    </a>
  )
}

export function Footer() {
  const { data: profile, isLoading } = useCMSLinksProfile()
  const socialLinks = profile?.socialLinks ?? []

  return (
    <>
      <footer className="w-full flex flex-col items-center justify-center pt-6 mt-auto z-10">
        <div
          className={
            'h-px bg-linear-to-r from-transparent via-foreground to-transparent w-full mb-24 '
          }
        />

        <div
          className={
            'mb-12 md:mb-32 mt-0 flex w-full flex-col items-center justify-center'
          }
        >
          <Button
            className={
              'bg-foreground text-xl flex flex-row justify-center items-center text-background font-normal w-full max-w-xs sm:max-w-md sm:px-40 h-10'
            }
            variant="bar"
            onClick={() => {
              window.location.href = 'mailto:lbsudo100@gmail.com'
            }}
          >
            <FaRegEnvelope className={'size-5'} /> Email
          </Button>
          <span
            className={
              'text-neutral-400 text-sm mt-4 flex select-none items-center justify-center gap-2 tracking-wide'
            }
          >
            <FaRegCopyright className={'size-4'} />
            {new Date().getFullYear()} Lbdluxe
          </span>
          {socialLinks.length > 0 || isLoading ? (
            <ul
              className={'flex flex-row justify-center items-center gap-3 pt-3'}
            >
              {isLoading && socialLinks.length === 0
                ? Array.from({ length: 7 }).map((_, i) => (
                    <li
                      key={i}
                      className={'size-10 animate-pulse rounded-full bg-muted'}
                    />
                  ))
                : socialLinks.map((link) => (
                    <li
                      key={link.id ?? link.url}
                      className={'flex items-center justify-center'}
                    >
                      <FooterSocialIcon link={link} />
                    </li>
                  ))}
            </ul>
          ) : null}
        </div>
      </footer>
    </>
  )
}