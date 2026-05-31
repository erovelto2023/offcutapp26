"use client";

import React from "react";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

interface TourDatesWidgetProps {
  config: {
    tourName?: string;
    tours?: Array<{
      date: string;
      city: string;
      venue: string;
      bookingUrl?: string;
    }>;
    buttonColor?: string;
  };
  accentColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  textColor: string;
}

export default function TourDatesWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
}: TourDatesWidgetProps) {
  const tourName = config.tourName || "World Tour 2024";
  const tours = config.tours || [
    { date: "JUN 12", city: "New York, NY", venue: "Madison Square Garden", bookingUrl: "" },
  ];
  const buttonColor = config.buttonColor || "#8b5cf6";

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
          <Calendar className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white">{tourName}</h3>
        </div>

        <div className="space-y-3">
          {tours.map((tour, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-lg hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="text-center min-w-[60px]">
                  <div className="text-xs font-bold text-violet-400">{tour.date}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{tour.city}</div>
                  <div className="text-xs text-zinc-500">{tour.venue}</div>
                </div>
              </div>
              {tour.bookingUrl && (
                <a
                  href={tour.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1 transition-all"
                  style={{ backgroundColor: buttonColor }}
                >
                  <ExternalLink className="w-3 h-3" /> Tickets
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
