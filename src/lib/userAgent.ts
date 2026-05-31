export interface ClientMetrics {
  device: "desktop" | "mobile" | "tablet";
  browser: string;
  referrer: string;
}

export function parseUserAgent(uaString: string | null): { device: "desktop" | "mobile" | "tablet"; browser: string } {
  if (!uaString) {
    return { device: "desktop", browser: "unknown" };
  }

  const ua = uaString.toLowerCase();
  
  // 1. Device Type Classification
  let device: "desktop" | "mobile" | "tablet" = "desktop";
  if (/ipad|tablet|playbook|silk/i.test(ua)) {
    device = "tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(ua)) {
    device = "mobile";
  }

  // 2. Browser Classification
  let browser = "Other";
  if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("chrome") && !ua.includes("chromium")) {
    browser = "Chrome";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
  }

  return { device, browser };
}

export function parseReferrer(refererHeader: string | null): string {
  if (!refererHeader) {
    return "direct";
  }

  try {
    const url = new URL(refererHeader);
    const host = url.hostname.toLowerCase();

    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("t.co") || host.includes("twitter.com") || host.includes("x.com")) return "Twitter/X";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("youtube.com") || host.includes("youtu.be")) return "YouTube";
    if (host.includes("facebook.com")) return "Facebook";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("google.com")) return "Google Search";
    if (host.includes("bing.com")) return "Bing Search";
    
    return url.hostname; // Fallback to raw domain name (e.g. custom site)
  } catch {
    return "direct";
  }
}
