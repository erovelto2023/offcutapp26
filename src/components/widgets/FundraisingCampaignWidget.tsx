"use client";

import React from "react";
import { Heart, Target, TrendingUp, ExternalLink } from "lucide-react";

interface FundraisingCampaignWidgetProps {
  config: {
    title?: string;
    description?: string;
    goal?: number;
    raised?: number;
    fundraisingUrl?: string;
    buttonColor?: string;
  };
  accentColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  textColor: string;
}

export default function FundraisingCampaignWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
}: FundraisingCampaignWidgetProps) {
  const title = config.title || "Campaign Title";
  const description = config.description || "Campaign description";
  const goal = config.goal || 10000;
  const raised = config.raised || 0;
  const fundraisingUrl = config.fundraisingUrl || "";
  const buttonColor = config.buttonColor || "#8b5cf6";
  const progress = Math.min((raised / goal) * 100, 100);

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
          <Heart className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white">{title}</h3>
        </div>

        <p className="text-xs text-zinc-400">{description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">${raised.toLocaleString()} raised</span>
            <span className="text-white font-medium">${goal.toLocaleString()} goal</span>
          </div>
          <div className="w-full bg-zinc-950/60 rounded-full h-2 overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: buttonColor,
              }}
            />
          </div>
          <div className="text-xs text-zinc-500 text-right">{progress.toFixed(1)}% complete</div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-zinc-500" />
            <div>
              <div className="text-lg font-bold text-white">${goal.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-500 uppercase">Goal</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div>
              <div className="text-lg font-bold text-white">${raised.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-500 uppercase">Raised</div>
            </div>
          </div>
        </div>

        {/* Donate Button */}
        {fundraisingUrl && (
          <a
            href={fundraisingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: buttonColor }}
          >
            Donate Now <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
