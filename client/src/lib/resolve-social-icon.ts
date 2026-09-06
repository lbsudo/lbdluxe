export interface ResolvedSocialIcon {
  iconName: string
  hexColor: string
}

const platformMap: Record<string, ResolvedSocialIcon> = {
  linkedin: { iconName: "SiLinkedin", hexColor: "#0e76a8" },
  tiktok: { iconName: "SiTiktok", hexColor: "#000000" },
  instagram: { iconName: "SiInstagram", hexColor: "#E4405F" },
  facebook: { iconName: "SiFacebook", hexColor: "#3b5998" },
  rumble: { iconName: "SiRumble", hexColor: "#8BC34A" },
  youtube: { iconName: "SiYoutube", hexColor: "#c4302b" },
  github: { iconName: "SiGithub", hexColor: "#333333" },
  twitter: { iconName: "SiGithub", hexColor: "#1DA1F2" },
  x: { iconName: "SiGithub", hexColor: "#1DA1F2" },
  telegram: { iconName: "FaGlobe", hexColor: "#26A5E4" },
  discord: { iconName: "FaGlobe", hexColor: "#5865F2" },
  twitch: { iconName: "FaGlobe", hexColor: "#9146FF" },
  reddit: { iconName: "FaGlobe", hexColor: "#FF4500" },
  mastodon: { iconName: "FaGlobe", hexColor: "#6364FF" },
  threads: { iconName: "SiThreads", hexColor: "#000000" },
}

export function getFaviconUrl(url: string, size = 64): string {
  try {
    const { hostname } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=${size}`
  } catch {
    return ""
  }
}

export function resolveSocialIcon(url: string): ResolvedSocialIcon {
  try {
    if (url.startsWith("mailto:")) {
      return { iconName: "FaEnvelope", hexColor: "#5c6bc0" }
    }

    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, "")

    for (const [platform, icon] of Object.entries(platformMap)) {
      if (hostname.includes(platform)) {
        return icon
      }
    }

    return { iconName: "FaGlobe", hexColor: "#666666" }
  } catch {
    return { iconName: "FaGlobe", hexColor: "#666666" }
  }
}
