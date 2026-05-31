"use client";

import React, { useEffect, useState } from "react";
import { getWidgetComponent, getWidgetConfig } from "@/lib/widgets/registry";

interface WidgetInstance {
  _id: string;
  widgetType: string;
  title: string;
  config: Record<string, any>;
  order: number;
  isActive: boolean;
}

interface ModularWidgetsProps {
  treeId: string;
  accentColor: string;
  textColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  widgetAccentColor?: string;
  widgetTextColor?: string;
  widgetCardRoundness?: string;
  widgetCardStyle?: string;
  widgetButtonColor?: string;
}

export default function ModularWidgets({
  treeId,
  accentColor,
  textColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  widgetAccentColor,
  widgetTextColor,
  widgetCardRoundness,
  widgetCardStyle,
  widgetButtonColor,
}: ModularWidgetsProps) {
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWidgets();
  }, [treeId]);

  const fetchWidgets = async () => {
    try {
      const res = await fetch(`/api/widgets?treeId=${treeId}`);
      if (!res.ok) throw new Error("Failed to load widgets");
      const data = await res.json();
      setWidgets(data);
    } catch (err) {
      console.error("Failed to load widgets:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 text-center text-zinc-500 text-sm">
        Loading widgets...
      </div>
    );
  }

  if (widgets.length === 0) {
    return (
      <div className="w-full p-8 text-center border border-dashed border-white/10 rounded-xl">
        <p className="text-zinc-500 text-sm">No widgets added yet</p>
        <p className="text-zinc-600 text-xs mt-1">Go to the Widgets tab to add some</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {widgets.map((widget) => {
        const WidgetComponent = getWidgetComponent(widget.widgetType);
        if (!WidgetComponent) return null;

        const mergedConfig = { ...getWidgetConfig(widget.widgetType)?.defaultConfig, ...widget.config };

        // Override buttonColor with global widget button color if set
        if (widgetButtonColor) {
          mergedConfig.buttonColor = widgetButtonColor;
        }

        // Use widget-specific appearance settings if available, otherwise use widget defaults (not global theme)
        return (
          <WidgetComponent
            key={widget._id}
            widgetId={widget._id}
            treeId={treeId}
            config={mergedConfig}
            accentColor={widgetAccentColor || "#8b5cf6"}
            textColor={widgetTextColor || "#ffffff"}
            cardRoundness={widgetCardRoundness || "rounded-xl"}
            cardStyle={widgetCardStyle || "glassmorphic"}
            isCustomTheme={isCustomTheme}
          />
        );
      })}
    </div>
  );
}
