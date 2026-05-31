"use client";

import React from "react";
import { BookOpen, Download, ArrowRight } from "lucide-react";

interface BookPromotionWidgetProps {
  config: {
    bookTitle?: string;
    bookDescription?: string;
    amazonUrl?: string;
    coverImageUrl?: string;
    coverTitle?: string;
    coverAuthor?: string;
    buttonColor?: string;
  };
  accentColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  textColor: string;
}

export default function BookPromotionWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
}: BookPromotionWidgetProps) {
  const bookTitle = config.bookTitle || "Book Title";
  const bookDescription = config.bookDescription || "Book description";
  const amazonUrl = config.amazonUrl || "https://amazon.com";
  const coverImageUrl = config.coverImageUrl || "";
  const coverTitle = config.coverTitle || "Book Title";
  const coverAuthor = config.coverAuthor || "Author Name";
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
      <div className="flex gap-4 items-start flex-col sm:flex-row">
        {/* Book Cover */}
        <div className="w-24 h-36 bg-gradient-to-tr from-violet-900 to-indigo-950 rounded-lg shadow-xl border border-white/10 flex flex-col items-center justify-center p-3 text-center shrink-0 relative overflow-hidden">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={coverTitle}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-violet-600/10" />
              <BookOpen className="w-8 h-8 text-violet-400 mb-2 relative z-10" />
              <span className="text-[10px] font-black text-white leading-tight uppercase relative z-10">{coverTitle}</span>
              <span className="text-[8px] text-zinc-400 mt-1 relative z-10">{coverAuthor}</span>
            </>
          )}
        </div>

        {/* Book Info */}
        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] font-black uppercase">
            New Release
          </div>
          <h3 className="text-base font-bold text-white leading-tight">{bookTitle}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">{bookDescription}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1 transition-all"
              style={{ backgroundColor: buttonColor }}
            >
              Amazon Buy <ArrowRight className="w-3 h-3" />
            </a>
            <button
              className="px-3 py-1.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 flex items-center gap-1 transition-all"
            >
              <Download className="w-3 h-3" /> Free Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
