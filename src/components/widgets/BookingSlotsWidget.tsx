"use client";

import React, { useState } from "react";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface BookingSlotsWidgetProps {
  config: {
    calendarView?: boolean;
    slots?: string[];
    buttonColor?: string;
  };
  accentColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  textColor: string;
  widgetId: string;
  treeId: string;
}

export default function BookingSlotsWidget({
  config,
  accentColor,
  cardRoundness,
  cardStyle,
  isCustomTheme,
  textColor,
  widgetId,
  treeId,
}: BookingSlotsWidgetProps) {
  const calendarView = config.calendarView ?? false;
  const slots = config.slots || ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
  const buttonColor = config.buttonColor || "#8b5cf6";
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

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

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }

    try {
      await fetch("/api/widgets/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widgetId,
          treeId,
          dataType: "booking_request",
          data: {
            date: selectedDate,
            slot: selectedSlot,
          },
        }),
      });
      toast.success("Booking request submitted!");
      setSelectedDate("");
      setSelectedSlot("");
    } catch (error) {
      toast.error("Failed to submit booking");
    }
  };

  return (
    <div className={getWidgetClass()} style={getWidgetStyle()}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white">Book a Session</h3>
        </div>

        {calendarView ? (
          <div className="space-y-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-zinc-950/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
            />
            <div className="grid grid-cols-2 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedSlot === slot
                      ? "text-white"
                      : "text-zinc-300 hover:bg-white/5"
                  }`}
                  style={{
                    backgroundColor: selectedSlot === slot ? buttonColor : "rgba(255,255,255,0.05)",
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                onClick={() => {
                  setSelectedSlot(slot);
                  setSelectedDate(new Date().toISOString().split('T')[0]);
                }}
                className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/5 border border-white/10 transition-all"
              >
                {slot}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleBook}
          className="w-full py-2.5 rounded-lg text-xs font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ backgroundColor: buttonColor }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
