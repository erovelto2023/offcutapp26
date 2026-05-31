"use client";

import React, { useState } from "react";
import { Home, Calculator, ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyListingWidgetProps {
  config: {
    address?: string;
    price?: number;
    details?: string;
    description?: string;
    images?: string[];
    slideshow?: boolean;
  };
  accentColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  textColor: string;
}

export default function PropertyListingWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
}: PropertyListingWidgetProps) {
  const address = config.address || "123 Main St";
  const price = config.price || 450000;
  const details = config.details || "4 Bed • 3 Bath • 2,400 Sq Ft";
  const description = config.description || "Property description";
  const images = config.images || [];
  const slideshow = config.slideshow ?? false;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className={getWidgetClass()} style={getWidgetStyle()}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white">Property Listing</h3>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative">
            <div className="aspect-video bg-zinc-950/60 rounded-lg overflow-hidden relative">
              <img
                src={images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              {slideshow && images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-1 mt-2">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-violet-500" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Property Details */}
        <div className="space-y-2">
          <div className="text-2xl font-bold text-white">
            ${price.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400">{address}</div>
          <div className="text-xs text-zinc-500">{details}</div>
        </div>

        {/* Description */}
        <textarea
          readOnly
          value={description}
          className="w-full bg-zinc-950/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none"
          rows={3}
        />

        {/* Mortgage Calculator */}
        <div className="flex items-center gap-2 p-3 bg-zinc-950/60 border border-white/10 rounded-lg">
          <Calculator className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-zinc-400">Mortgage Calculator Available</span>
        </div>
      </div>
    </div>
  );
}
