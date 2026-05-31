"use client";

import React, { useState } from "react";
import { Mail, Flame } from "lucide-react";
import { toast } from "sonner";

interface EmailCollectionWidgetProps {
  config: {
    title?: string;
    description?: string;
    buttonText?: string;
    collectName?: boolean;
    collectionName?: string;
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

export default function EmailCollectionWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
  widgetId,
  treeId,
}: EmailCollectionWidgetProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const title = config.title || "Join Our Newsletter";
  const description = config.description || "Get the latest updates and exclusive content delivered to your inbox.";
  const buttonText = config.buttonText || "Subscribe";
  const collectName = config.collectName ?? false;
  const collectionName = config.collectionName || "newsletter";
  const successMessage = config.successMessage || "Thank you for subscribing!";

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
            collectionName,
            ...(collectName && { name }),
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to subscribe");

      toast.success(successMessage);
      setEmail("");
      setName("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={getWidgetClass()} style={getWidgetStyle()}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] font-black uppercase">
          <Flame className="w-3.5 h-3.5 animate-pulse" /> Newsletter
        </div>
        <h3 className="text-base font-bold text-white leading-tight">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-2">
          {collectName && (
            <input
              type="text"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
              required={collectName}
            />
          )}
          <input
            type="email"
            placeholder="Enter your email..."
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
            {submitting ? "Subscribing..." : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
