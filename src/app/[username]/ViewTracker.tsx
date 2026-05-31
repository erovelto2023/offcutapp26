"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  username: string;
  treeId?: string;
}

export default function ViewTracker({ username, treeId }: ViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // 1. Capture original external referrer
    const rawReferrer = document.referrer;
    let cleanReferrer = "direct";
    if (rawReferrer && !rawReferrer.includes(window.location.host)) {
      cleanReferrer = rawReferrer;
    }

    // 2. Parse query parameters (UTM metrics and keywords)
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source") || "";
    const utmMedium = urlParams.get("utm_medium") || "";
    const utmCampaign = urlParams.get("utm_campaign") || "";
    const utmTerm = urlParams.get("utm_term") || "";
    
    // Extrapolate search keywords from various standard query parameters or UTM term
    const searchKeywords = urlParams.get("q") || urlParams.get("query") || urlParams.get("keywords") || utmTerm || "";

    // 3. Save to sessionStorage so future clicks inside this session carry attribution
    const attribution = {
      referrer: cleanReferrer,
      utmSource,
      utmMedium,
      utmCampaign,
      keywords: searchKeywords
    };

    try {
      sessionStorage.setItem("offcut_attribution", JSON.stringify(attribution));
    } catch (e) {
      console.warn("sessionStorage is disabled or unavailable:", e);
    }

    // 4. Fire page view event with full attribution parameters
    if (!tracked.current) {
      tracked.current = true;
      fetch("/api/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          treeId: treeId || undefined,
          referrer: cleanReferrer,
          utmSource,
          utmMedium,
          utmCampaign,
          keywords: searchKeywords
        }),
      }).catch((err) => {
        console.error("View tracking failed:", err);
      });
    }
  }, [username, treeId]);

  useEffect(() => {
    // 5. Setup dynamic interceptor on standard links to attach attribution parameters at click-time
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href && href.startsWith("/api/click?id=")) {
        try {
          const attributionStr = sessionStorage.getItem("offcut_attribution");
          if (attributionStr) {
            const attribution = JSON.parse(attributionStr);
            const url = new URL(anchor.href, window.location.origin);

            // Dynamically inject attribution query string details
            if (attribution.referrer && !url.searchParams.has("ref")) {
              url.searchParams.set("ref", attribution.referrer);
            }
            if (attribution.keywords && !url.searchParams.has("kw")) {
              url.searchParams.set("kw", attribution.keywords);
            }
            if (attribution.utmSource && !url.searchParams.has("utm_source")) {
              url.searchParams.set("utm_source", attribution.utmSource);
            }
            if (attribution.utmMedium && !url.searchParams.has("utm_medium")) {
              url.searchParams.set("utm_medium", attribution.utmMedium);
            }
            if (attribution.utmCampaign && !url.searchParams.has("utm_campaign")) {
              url.searchParams.set("utm_campaign", attribution.utmCampaign);
            }

            // Write modified href back to standard anchor before navigation proceeds
            anchor.href = url.pathname + url.search;
          }
        } catch (err) {
          console.error("Attribution interceptor click error:", err);
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  return null; // Invisible component
}
