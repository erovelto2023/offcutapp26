"use client";

import React, { useState } from "react";
import { BookOpen, Flame, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ARCReaderWidgetProps {
  config: {
    bookTitle?: string;
    bookDescription?: string;
    arcLink?: string;
    coverTitle?: string;
    coverAuthor?: string;
    buttonText?: string;
    successMessage?: string;
  };
  accentColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  textColor: string;
  widgetId: string;
  treeId: string;
}

export default function ARCReaderWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
  widgetId,
  treeId,
}: ARCReaderWidgetProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bookTitle = config.bookTitle || "The Offcut Legacy: Book 1";
  const bookDescription = config.bookDescription || "Unlock the secrets of multi-tenant workspace architecture. A gripping techno-thriller on data isolation.";
  const arcLink = config.arcLink || "";
  const coverTitle = config.coverTitle || "The Offcut Legacy";
  const coverAuthor = config.coverAuthor || "by Kathleen";
  const buttonText = config.buttonText || "Apply for ARC Team";
  const successMessage = config.successMessage || "Thank you! Your ARC application has been received.";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/widgets/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetId,
          treeId,
          dataType: "email",
          data: {
            email,
            name,
            type: "arc_reader",
            bookTitle,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to submit application");

      toast.success(successMessage);
      setEmail("");
      setName("");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={getWidgetClass()} style={getWidgetStyle()}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
      <div className="flex gap-4 items-start flex-col sm:flex-row">
        <div className="w-24 h-36 bg-gradient-to-tr from-violet-900 to-indigo-950 rounded-lg shadow-xl border border-white/10 flex flex-col items-center justify-center p-3 text-center shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-violet-600/10" />
          <BookOpen className="w-8 h-8 text-violet-400 mb-2 relative z-10" />
          <span className="text-[10px] font-black text-white leading-tight uppercase relative z-10">{coverTitle}</span>
          <span className="text-[8px] text-zinc-400 mt-1 relative z-10">{coverAuthor}</span>
        </div>

        <div className="flex-1 space-y-2">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] font-black uppercase">
            New Release Showcase
          </div>
          <h3 className="text-base font-bold text-white leading-tight">{bookTitle}</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">{bookDescription}</p>

          {arcLink && (
            <a
              href={arcLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold text-white transition-all"
              style={{ backgroundColor: accentColor || "#8b5cf6" }}
            >
              View ARC Page <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* ARC reviewer signup */}
      <div className="mt-6 border-t border-white/5 pt-4">
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> {buttonText}
        </h4>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-950/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
            required
          />
          <input
            type="email"
            placeholder="Your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor || "#8b5cf6" }}
          >
            {submitting ? "Submitting..." : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
