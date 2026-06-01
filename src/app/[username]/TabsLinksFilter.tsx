"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  icon?: string;
  animationStyle?: "none" | "pulse" | "bounce" | "shine";
  tab?: string;
}

interface TabsLinksFilterProps {
  initialLinks: LinkItem[];
  tabs: string[];
  isCustomTheme: boolean;
  themeCardBg: string;
  themeBtnHover: string;
  cardRoundness: string;
  cardStyle: string;
  textColor: string;
  accentColor: string;
  buttonColor?: string;
}

export default function TabsLinksFilter({
  initialLinks,
  tabs,
  isCustomTheme,
  themeCardBg,
  themeBtnHover,
  cardRoundness,
  cardStyle,
  textColor,
  accentColor,
  buttonColor,
}: TabsLinksFilterProps) {
  const [activeTab, setActiveTab] = useState("All");

  const getProfileCardStyle = () => {
    if (!isCustomTheme) return `${themeCardBg} ${themeBtnHover}`;

    const roundness = cardRoundness;
    let base = `w-full py-4.5 px-6 border text-center font-bold text-md flex items-center justify-center relative shadow-sm cursor-pointer group active:scale-[0.98] transition-all hover:scale-[1.01] ${roundness} `;

    if (cardStyle === "glassmorphic") {
      base += "bg-white/10 border-white/20";
    } else if (cardStyle === "flat") {
      base += "bg-zinc-900 border-zinc-800";
    } else if (cardStyle === "outline") {
      base += "bg-transparent border-white/30";
    } else if (cardStyle === "neon") {
      base += "bg-black/85 border";
    }
    return base;
  };

  const getProfileCardInlineStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties & Record<string, any> = {};
    if (isCustomTheme) {
      styles.color = textColor;
      if (cardStyle === "neon") {
        styles.borderColor = accentColor;
        styles.boxShadow = `0 0 12px ${accentColor}40`;
      } else {
        styles.borderColor = `${textColor}25`;
      }
      if (buttonColor) {
        styles.backgroundColor = buttonColor;
      }
      styles["--accent-color" as any] = accentColor;
    } else {
      styles["--accent-color" as any] = accentColor;
    }
    return styles;
  };

  const filteredLinks = initialLinks.filter(
    (l) => activeTab === "All" || l.tab === activeTab
  );

  return (
    <div className="w-full space-y-5">
      {/* Visual Glassmorphic Category Tabs Bar */}
      {tabs && tabs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none justify-start w-full max-w-full no-scrollbar px-1">
          <button
            type="button"
            onClick={() => setActiveTab("All")}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer active:scale-95"
            style={{
              backgroundColor: activeTab === "All" ? accentColor : "rgba(255, 255, 255, 0.05)",
              borderColor: activeTab === "All" ? accentColor : "rgba(255, 255, 255, 0.1)",
              color: activeTab === "All" ? "#ffffff" : textColor || "#ffffff",
              boxShadow: activeTab === "All" ? `0 4px 12px ${accentColor}40` : "none"
            }}
          >
            All
          </button>
          {tabs.map((tabName) => (
            <button
              key={tabName}
              type="button"
              onClick={() => setActiveTab(tabName)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer active:scale-95"
              style={{
                backgroundColor: activeTab === tabName ? accentColor : "rgba(255, 255, 255, 0.05)",
                borderColor: activeTab === tabName ? accentColor : "rgba(255, 255, 255, 0.1)",
                color: activeTab === tabName ? "#ffffff" : textColor || "#ffffff",
                boxShadow: activeTab === tabName ? `0 4px 12px ${accentColor}40` : "none"
              }}
            >
              {tabName}
            </button>
          ))}
        </div>
      )}

      {/* Render Filtered Links */}
      <div className="w-full space-y-4">
        {filteredLinks.map((link) => (
          <a
            key={link._id.toString()}
            href={`/api/click?id=${link._id.toString()}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getProfileCardStyle()} ${
              link.animationStyle === "pulse"
                ? "card-anim-pulse"
                : link.animationStyle === "bounce"
                ? "card-anim-bounce"
                : link.animationStyle === "shine"
                ? "card-anim-shine"
                : ""
            }`}
            style={getProfileCardInlineStyle()}
          >
            {link.icon && (
              <span className="absolute left-6 text-xl select-none group-hover:scale-110 transition-transform">
                {link.icon}
              </span>
            )}
            <span className="truncate pr-6 pl-6">{link.title}</span>
            <ArrowUpRight className="absolute right-6 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-zinc-400 group-hover:text-white" />
          </a>
        ))}

        {filteredLinks.length === 0 && (
          <div className="text-zinc-500 italic text-center p-8 bg-black/20 border border-white/5 rounded-2xl">
            No active links found under this category.
          </div>
        )}
      </div>
    </div>
  );
}
