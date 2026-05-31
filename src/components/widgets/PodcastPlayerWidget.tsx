"use client";

import React from "react";
import { Mic, Play } from "lucide-react";

interface PodcastPlayerWidgetProps {
  config: {
    episodeTitle?: string;
    episodeNumber?: string;
    duration?: string;
    audioUrl?: string;
    platforms?: string[];
  };
  accentColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  textColor: string;
}

export default function PodcastPlayerWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
}: PodcastPlayerWidgetProps) {
  const episodeTitle = config.episodeTitle || "Episode Title";
  const episodeNumber = config.episodeNumber || "42";
  const duration = config.duration || "48 min";
  const audioUrl = config.audioUrl || "";
  const platforms = config.platforms || ["spotify", "apple"];

  const getWidgetClass = () => {
    let base = `w-full p-6 border text-left shadow-lg relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${cardRoundness} `;
    if (isCustomTheme) {
      if (cardStyle === "glassmorphic") base += "bg-white/5 border-white/10";
      else if (cardStyle === "flat") base += "bg-zinc-900 border-zinc-800";
      else if (cardStyle === "outline") base += "bg-transparent border-white/20";
      else if (cardStyle === "neon") base += "bg-black/90 border";
    } else {
      base += "bg-white/5 border-white/10";
    }
    return base;
  };

  const getWidgetStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};
    if (isCustomTheme) {
      style.color = textColor;
      if (cardStyle === "neon") {
        style.borderColor = accentColor;
        style.boxShadow = `0 0 15px ${accentColor}25`;
      } else {
        style.borderColor = `${textColor}15`;
      }
    } else {
      style.borderColor = "rgba(255, 255, 255, 0.1)";
    }
    return style;
  };

  return (
    <div className={getWidgetClass()} style={getWidgetStyle()}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white">Podcast Episode</h3>
        </div>

        <div className="space-y-2">
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Episode {episodeNumber}</div>
          <div className="text-lg font-bold text-white">{episodeTitle}</div>
          <div className="text-xs text-zinc-400">{duration}</div>
        </div>

        {/* Audio Player */}
        {audioUrl ? (
          <audio
            controls
            className="w-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <div className="p-4 bg-zinc-950/60 border border-white/10 rounded-lg text-center">
            <Play className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-500">Audio URL required for playback</p>
          </div>
        )}

        {/* Platform Links */}
        <div className="flex gap-2">
          {platforms.includes("spotify") && (
            <a
              href="#"
              className="px-3 py-1.5 rounded-md text-[10px] font-bold bg-green-600 text-white hover:bg-green-500 transition-all"
            >
              Spotify
            </a>
          )}
          {platforms.includes("apple") && (
            <a
              href="#"
              className="px-3 py-1.5 rounded-md text-[10px] font-bold bg-zinc-800 text-white hover:bg-zinc-700 transition-all"
            >
              Apple
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
