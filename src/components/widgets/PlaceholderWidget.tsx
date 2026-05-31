"use client";

import React from "react";

interface PlaceholderWidgetProps {
  title: string;
  config?: Record<string, any>;
  accentColor?: string;
  textColor?: string;
  cardRoundness?: string;
  cardStyle?: string;
  isCustomTheme?: boolean;
  widgetId?: string;
  treeId?: string;
}

export default function PlaceholderWidget({ title, config, accentColor, textColor, cardRoundness, cardStyle, isCustomTheme }: PlaceholderWidgetProps) {
  return (
    <div className={`p-6 border rounded-xl bg-white/5 text-white ${cardRoundness || "rounded-xl"}`}>
      {title} - Coming Soon
    </div>
  );
}
