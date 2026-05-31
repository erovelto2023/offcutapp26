"use client";

import React, { useState } from "react";
import ModularWidgets from "./ModularWidgets";
import TabsLinksFilter from "../app/[username]/TabsLinksFilter";

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  icon?: string;
  animationStyle?: "none" | "pulse" | "bounce" | "shine";
  tab?: string;
}

interface ContentTabsProps {
  treeId: string;
  initialLinks: LinkItem[];
  tabs: string[];
  accentColor: string;
  textColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  themeCardBg: string;
  themeBtnHover: string;
  widgetAccentColor?: string;
  widgetTextColor?: string;
  widgetCardRoundness?: string;
  widgetCardStyle?: string;
  widgetButtonColor?: string;
}

export default function ContentTabs({
  treeId,
  initialLinks,
  tabs,
  accentColor,
  textColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  themeCardBg,
  themeBtnHover,
  widgetAccentColor,
  widgetTextColor,
  widgetCardRoundness,
  widgetCardStyle,
  widgetButtonColor,
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<"links" | "widgets">("links");

  return (
    <div className="w-full space-y-6">
      {/* Main Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-start w-full max-w-full no-scrollbar px-1">
        <button
          type="button"
          onClick={() => setActiveTab("links")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer active:scale-95 ${
            activeTab === "links"
              ? "text-white"
              : "text-zinc-400 hover:text-white"
          }`}
          style={{
            backgroundColor: activeTab === "links" ? accentColor : "rgba(255, 255, 255, 0.05)",
            borderColor: activeTab === "links" ? accentColor : "rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "links" ? `0 4px 12px ${accentColor}40` : "none"
          }}
        >
          Links
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("widgets")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer active:scale-95 ${
            activeTab === "widgets"
              ? "text-white"
              : "text-zinc-400 hover:text-white"
          }`}
          style={{
            backgroundColor: activeTab === "widgets" ? accentColor : "rgba(255, 255, 255, 0.05)",
            borderColor: activeTab === "widgets" ? accentColor : "rgba(255, 255, 255, 0.1)",
            boxShadow: activeTab === "widgets" ? `0 4px 12px ${accentColor}40` : "none"
          }}
        >
          Widgets
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "links" ? (
        <TabsLinksFilter
          initialLinks={initialLinks}
          tabs={tabs}
          isCustomTheme={isCustomTheme}
          themeCardBg={themeCardBg}
          themeBtnHover={themeBtnHover}
          cardRoundness={cardRoundness}
          cardStyle={cardStyle}
          textColor={textColor}
          accentColor={accentColor}
        />
      ) : (
        <ModularWidgets
          treeId={treeId}
          accentColor={accentColor}
          textColor={textColor}
          cardRoundness={cardRoundness}
          cardStyle={cardStyle}
          isCustomTheme={isCustomTheme}
          widgetAccentColor={widgetAccentColor}
          widgetTextColor={widgetTextColor}
          widgetCardRoundness={widgetCardRoundness}
          widgetCardStyle={widgetCardStyle}
          widgetButtonColor={widgetButtonColor}
        />
      )}
    </div>
  );
}
