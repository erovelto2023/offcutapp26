"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  DollarSign,
  Play,
  Pause,
  MapPin,
  Clock,
  Tv,
  Gamepad2,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Download,
  Flame,
  CheckCircle,
  FileText,
  Mail,
  Camera,
  Layers,
  Award,
  Video,
  ChevronRight,
  Heart
} from "lucide-react";
import { toast } from "sonner";

interface NicheWidgetsProps {
  type: string;
  accentColor: string;
  textColor: string;
  cardRoundness: string;
  cardStyle: string;
  isCustomTheme: boolean;
  nicheSettings?: Record<string, any>;
}

export default function NicheWidgets({
  type,
  accentColor,
  textColor,
  cardRoundness = "rounded-xl",
  cardStyle = "glassmorphic",
  isCustomTheme,
  nicheSettings = {}
}: NicheWidgetsProps) {
  const [activeTab, setActiveTab] = useState<string>("info");

  // Custom styling utility
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

  // ----------------------------------------------------
  // 1. AUTHOR WIDGET: Book Promotion & Preview Toolkit
  // ----------------------------------------------------
  if (type === "author") {
    const [email, setEmail] = useState("");
    const bookTitle = nicheSettings.authorBookTitle || "The Offcut Legacy: Book 1";
    const bookDesc = nicheSettings.authorBookDesc || "Unlock the secrets of multi-tenant workspace architecture. A gripping techno-thriller on data isolation.";
    const amazonUrl = nicheSettings.authorAmazonUrl || "https://amazon.com";
    const coverTitle = nicheSettings.authorCoverTitle || "The Offcut Legacy";
    const coverAuthor = nicheSettings.authorCoverAuthor || "by Kathleen";
    const countdownDate = nicheSettings.authorCountdownDate || "2026-12-31";

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
            <p className="text-xs text-zinc-400 leading-relaxed">
              {bookDesc}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1 transition-all"
                style={{ backgroundColor: accentColor || "#8b5cf6" }}
              >
                Amazon Buy <ArrowRight className="w-3 h-3" />
              </a>
              <button
                onClick={() => toast.success("Sample chapter PDF download started!")}
                className="px-3 py-1.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 flex items-center gap-1 transition-all"
              >
                <Download className="w-3 h-3" /> Free Sample
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter / ARC reviewer signup */}
        <div className="mt-6 border-t border-white/5 pt-4">
          <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> Apply for ARC Reviewer Team
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you! Your application was registered successfully.");
              setEmail("");
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder="Enter reader email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-zinc-950/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-bold text-white hover:scale-102 active:scale-98 transition-all"
              style={{ backgroundColor: accentColor || "#8b5cf6" }}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. MUSICIAN WIDGET: Tour & Streaming Integrator
  // ----------------------------------------------------
  if (type === "musician") {
    const tours = [
      { date: "JUN 12", city: "New York, NY", venue: "Madison Square Garden" },
      { date: "JUN 20", city: "Los Angeles, CA", venue: "The Hollywood Bowl" },
      { date: "JUL 05", city: "London, UK", venue: "Wembley Arena" }
    ];
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-rose-400" /> Concert Tour & Tickets
        </h4>

        <div className="space-y-2">
          {tours.map((t, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-rose-500/20 text-rose-300 border border-rose-500/30 w-12 py-1 text-center font-bold text-[9px] rounded-lg leading-tight uppercase shrink-0">
                  {t.date}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{t.city}</div>
                  <div className="text-[10px] text-zinc-500">{t.venue}</div>
                </div>
              </div>

              <button
                onClick={() => toast.success(`Concert tickets redirect loaded for ${t.city}!`)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-black text-white hover:scale-105 active:scale-95 transition-transform"
                style={{ backgroundColor: accentColor || "#e11d48" }}
              >
                Tickets
              </button>
            </div>
          ))}
        </div>

        {/* Streaming integration mock player */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-white">Stream Latest Track</div>
              <div className="text-[8px] text-zinc-500">Available on Spotify & Apple Music</div>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 hover:text-white cursor-pointer hover:underline font-semibold" onClick={() => toast.success("Streaming hub loaded!")}>
            Open Player
          </span>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. COACH WIDGET: Discovery Call Booking Kit
  // ----------------------------------------------------
  if (type === "coach") {
    const slots = ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
    const [selectedSlot, setSelectedSlot] = useState("");
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-xl rounded-full" />
        <div className="space-y-1 mb-4">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-black uppercase">
            Client Acquisition Kit
          </div>
          <h3 className="text-sm font-bold text-white">Book a Free 15-Min Discovery Session</h3>
          <p className="text-xs text-zinc-400">
            Let's evaluate your career goals and mapping strategy. Select an available session slot below.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSlot(s)}
              className={`p-2.5 rounded-lg border text-center font-semibold text-xs transition-all cursor-pointer ${
                selectedSlot === s
                  ? "bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                  : "bg-white/5 border-white/5 text-zinc-300 hover:border-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {selectedSlot && (
          <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 items-center animate-fade-in">
            <button
              onClick={() => {
                toast.success(`Session request submitted for slot ${selectedSlot}!`);
                setSelectedSlot("");
              }}
              className="flex-1 py-2 rounded-lg text-xs font-bold text-white text-center hover:scale-102 active:scale-98 transition-all"
              style={{ backgroundColor: accentColor || "#06b6d4" }}
            >
              Confirm Session for {selectedSlot}
            </button>
          </div>
        )}

        <div className="mt-4 p-3 bg-zinc-950/40 border border-white/5 rounded-xl flex items-start gap-2.5">
          <Award className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[10px] text-zinc-400 italic leading-relaxed">
            "The scheduling was seamless and the discovery call set up my roadmap perfectly!" - Kathleen H.
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. REALTOR WIDGET: Listing Showcase & Calculator
  // ----------------------------------------------------
  if (type === "realtor") {
    const [price, setPrice] = useState(450000);
    const [rate, setRate] = useState(6.5);
    const [payment, setPayment] = useState(0);

    useEffect(() => {
      const principal = price * 0.8; // 20% down
      const monthlyRate = rate / 100 / 12;
      const numPayments = 30 * 12; // 30 year fixed
      const pay = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      setPayment(isNaN(pay) ? 0 : Math.round(pay));
    }, [price, rate]);

    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full" />
        <div className="flex gap-4 flex-col sm:flex-row items-stretch">
          <div className="w-full sm:w-36 h-24 rounded-lg bg-zinc-900 border border-white/10 relative overflow-hidden flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 to-zinc-900" />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black">
              ACTIVE LISTING
            </div>
            <MapPin className="w-6 h-6 text-emerald-400 relative z-10" />
          </div>

          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-black text-white">742 Evergreen Terrace</h4>
            <p className="text-[10px] text-zinc-400">4 Bed • 3 Bath • 2,400 Sq Ft</p>
            <div className="text-sm font-black text-emerald-400 tracking-tight">$450,000</div>
            <p className="text-[10px] text-zinc-500 leading-tight">
              Located in premium residential zoning with landscaped backyard, deck, and solar grids.
            </p>
          </div>
        </div>

        {/* Mortgage calculator */}
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
          <h5 className="text-[11px] font-bold text-white flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Mortgage Estimator (20% Down)
          </h5>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>Home Purchase Price</span>
              <span className="text-white font-bold">${price.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200000"
              max="1000000"
              step="25000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-zinc-950/60 border border-white/5 rounded-xl">
            <div className="text-[10px] text-zinc-400">Estimated Monthly Payment:</div>
            <div className="text-sm font-black text-white">${payment}/mo</div>
          </div>

          <button
            onClick={() => toast.success("Home booking inquiry submitted!")}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-white text-center hover:scale-102 transition-all cursor-pointer"
            style={{ backgroundColor: accentColor || "#10b981" }}
          >
            Schedule Open House Viewing
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 5. NONPROFIT WIDGET: Fundraising & Progress Tracker
  // ----------------------------------------------------
  if (type === "nonprofit") {
    const [raised, setRaised] = useState(6450);
    const goal = 10000;
    const pct = Math.min(100, Math.round((raised / goal) * 100));

    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-2 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-violet-400 fill-violet-400/20" /> Active Donation Campaign
        </h4>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">Clean Ocean Water Initiative</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every contribution directly funds filtering setups for coastal preservation groups.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-white">${raised.toLocaleString()} Raised</span>
            <span className="text-zinc-400">${goal.toLocaleString()} Goal</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                backgroundColor: accentColor || "#8b5cf6",
                boxShadow: `0 0 10px ${accentColor || "#8b5cf6"}50`
              }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 text-right font-semibold">{pct}% Complete</div>
        </div>

        {/* Preset selections */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[10, 25, 100].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setRaised((prev) => prev + amt);
                toast.success(`Thank you for your generous $${amt} donation!`);
              }}
              className="py-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-0.5"
            >
              <DollarSign className="w-3.5 h-3.5 text-zinc-500" /> {amt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 6. GAMER / STREAMER WIDGET: Live Status & Specs Dashboard
  // ----------------------------------------------------
  if (type === "gamer") {
    const specs = [
      { name: "Graphics Card", value: "NVIDIA RTX 4090" },
      { name: "Processor CPU", value: "AMD Ryzen 9 7950X" },
      { name: "Liquid Cooler", value: "Corsair H150i AIO" },
      { name: "System Memory", value: "64GB DDR5 6000Mhz" }
    ];
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-xl rounded-full" />
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase">Streamer Dashboard</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[9px] font-black animate-pulse">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> LIVE
          </div>
        </div>

        <div className="p-3 bg-purple-950/20 border border-purple-500/15 rounded-xl flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-white">Kathleen Plays: Techno-Cyberpunk 2077</h4>
            <p className="text-[10px] text-zinc-400">Current Viewers: 1,420 • Playing on PC</p>
          </div>
          <button
            onClick={() => toast.success("Redirecting to twitch.tv channel stream!")}
            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#9146FF] hover:bg-[#772ce8] text-white transition-all cursor-pointer flex items-center gap-1"
          >
            Watch Stream
          </button>
        </div>

        {/* Gaming specs setup */}
        <div className="space-y-1.5">
          <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Gaming Station Specs</h5>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {specs.map((s, idx) => (
              <div key={idx} className="p-2 bg-zinc-950/60 border border-white/5 rounded-lg">
                <div className="text-zinc-500 font-semibold">{s.name}</div>
                <div className="text-white font-bold truncate">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 7. INFLUENCER WIDGET: Brand Partnership Media Kit
  // ----------------------------------------------------
  if (type === "influencer") {
    const stats = [
      { label: "Followers", val: "124K" },
      { label: "Reach", val: "850K" },
      { label: "Engagement", val: "6.2%" },
    ];
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase flex items-center gap-1.5">
            <Users className="w-4 h-4 text-violet-400" /> Creator Media Statistics
          </h4>
          <span className="text-[9px] font-black text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25">
            PARTNERSHIPS OPEN
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-zinc-950/50 border border-white/5 rounded-xl p-3.5 text-center">
          {stats.map((s, idx) => (
            <div key={idx}>
              <div className="text-white text-lg font-black tracking-tight">{s.val}</div>
              <div className="text-[9px] text-zinc-500 font-semibold uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
          <button
            onClick={() => toast.success("Downloadable Media Kit PDF started!")}
            className="flex-1 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Download Rate Sheet
          </button>
          <button
            onClick={() => toast.success("Collaboration inquiry form initialized!")}
            className="flex-1 py-2 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
            style={{ backgroundColor: accentColor || "#8b5cf6" }}
          >
            Collab Request <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 8. ARTIST WIDGET: Art Gallery Portfolio Carousel
  // ----------------------------------------------------
  if (type === "artist") {
    const artPieces = [
      { title: "Obsidian Echoes", type: "Original Painting", price: "$1,200", tech: "Acrylic on Canvas" },
      { title: "Fluid Architectures", type: "Digital Rendering Print", price: "$150", tech: "Giclée Fine Art Print" },
    ];
    const [activeIdx, setActiveIdx] = useState(0);

    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-teal-400" /> Featured Art Portfolio
        </h4>

        <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-4 space-y-3">
          <div className="w-full h-32 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 rounded-lg flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-teal-600/5" />
            <span className="text-xs font-black text-teal-400 tracking-wider uppercase mb-1">{artPieces[activeIdx].title}</span>
            <span className="text-[10px] text-zinc-500 font-semibold">{artPieces[activeIdx].tech}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-500 font-semibold uppercase">{artPieces[activeIdx].type}</div>
              <div className="text-sm font-black text-white">{artPieces[activeIdx].price}</div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveIdx((prev) => (prev === 0 ? 1 : 0))}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 cursor-pointer"
              >
                Next Artwork
              </button>
              <button
                onClick={() => toast.success(`Inquiry sent for ${artPieces[activeIdx].title}!`)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
                style={{ backgroundColor: accentColor || "#14b8a6" }}
              >
                Purchase Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 9. PHOTOGRAPHER WIDGET: Dynamic Estimator
  // ----------------------------------------------------
  if (type === "photographer") {
    const [hours, setHours] = useState(2);
    const [propsChecked, setPropsChecked] = useState(false);
    const [price, setPrice] = useState(300);

    useEffect(() => {
      let base = hours * 150;
      if (propsChecked) base += 75;
      setPrice(base);
    }, [hours, propsChecked]);

    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-emerald-400" /> Shoot Session Estimator
        </h4>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>Session Duration</span>
              <span className="text-white font-bold">{hours} Hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-lg">
            <label htmlFor="props" className="text-[10px] text-zinc-300 font-semibold cursor-pointer">
              Include Studio Lighting & Backdrops
            </label>
            <input
              id="props"
              type="checkbox"
              checked={propsChecked}
              onChange={(e) => setPropsChecked(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-white/10 bg-zinc-950 accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center p-3 bg-zinc-950/60 border border-white/5 rounded-xl">
            <span className="text-[10px] text-zinc-400">Estimated Shoot Fee:</span>
            <span className="text-sm font-black text-white">${price}</span>
          </div>

          <button
            onClick={() => toast.success(`Photographer availability requested for ${hours} hours shoot!`)}
            className="w-full py-2 rounded-lg text-xs font-bold text-white text-center hover:scale-102 transition-all cursor-pointer"
            style={{ backgroundColor: accentColor || "#10b981" }}
          >
            Check Session Availability
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 10. PODCASTER WIDGET: Cassette Waveform Player
  // ----------------------------------------------------
  if (type === "podcaster") {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <Tv className="w-4 h-4 text-amber-400" /> Dynamic Podcast Player
        </h4>

        <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <span className="text-[9px] font-black text-amber-400 uppercase">LATEST EPISODE</span>
              <h5 className="text-xs font-bold text-white leading-tight">EP 42: Scaling Multi-Tenant Deployments</h5>
              <p className="text-[10px] text-zinc-500 mt-1">Released May 2026 • 48 min</p>
            </div>
            
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                if (!isPlaying) toast.success("Playing preview track...");
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
              style={{ backgroundColor: accentColor || "#f59e0b" }}
            >
              {isPlaying ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 fill-white ml-0.5" />}
            </button>
          </div>

          {isPlaying && (
            <div className="space-y-1.5 animate-fade-in">
              <div className="h-6 flex items-center gap-0.5 justify-center">
                {[...Array(24)].map((_, i) => {
                  const h = Math.floor(Math.random() * 20) + 4;
                  return (
                    <div
                      key={i}
                      className="w-1 bg-amber-500 rounded-full transition-all duration-300 animate-pulse"
                      style={{ height: `${h}px`, animationDelay: `${i * 30}ms` }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => toast.success("Redirecting to Spotify Podcasts!")}
              className="flex-1 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] transition-all cursor-pointer text-center"
            >
              Spotify
            </button>
            <button
              onClick={() => toast.success("Redirecting to Apple Podcasts!")}
              className="flex-1 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] transition-all cursor-pointer text-center"
            >
              Apple Podcasts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 11. YOUTUBER WIDGET: Video Player Showcase
  // ----------------------------------------------------
  if (type === "youtuber") {
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <Video className="w-4 h-4 text-red-400" /> Featured Video Spotlight
        </h4>

        <div className="bg-zinc-950/60 border border-white/5 rounded-xl overflow-hidden shadow-inner">
          <div className="w-full h-36 bg-gradient-to-tr from-zinc-900 to-zinc-950 relative flex flex-col items-center justify-center p-4 text-center cursor-pointer group" onClick={() => toast.success("Opening YouTube video URL...")}>
            <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-500 group-hover:scale-105 transition-all flex items-center justify-center text-white shadow-lg relative z-10">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
            <div className="absolute inset-0 bg-red-950/5 group-hover:bg-red-950/10 transition-colors" />
          </div>

          <div className="p-3">
            <span className="text-[9px] font-black text-red-400 uppercase">NEW VIDEO RELEASE</span>
            <h5 className="text-xs font-bold text-white mt-0.5">Custom layout configuration in Tailwind v4!</h5>
            <p className="text-[10px] text-zinc-500 leading-tight mt-1">
              Check out all the new features and design systems. Make sure to subscribe!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 12. SMALL BUSINESS: Booking Services Sheet
  // ----------------------------------------------------
  if (type === "smallbusiness") {
    const services = [
      { name: "Consulting Hour", duration: "60 mins", price: "$120" },
      { name: "Code Review session", duration: "90 mins", price: "$180" }
    ];
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-violet-400" /> Professional Core Services
        </h4>

        <div className="space-y-2">
          {services.map((s, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div>
                <div className="text-xs font-bold text-white">{s.name}</div>
                <div className="text-[9px] text-zinc-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {s.duration}
                </div>
              </div>
              <button
                onClick={() => toast.success(`Service request generated for ${s.name}!`)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
                style={{ backgroundColor: accentColor || "#8b5cf6" }}
              >
                Book {s.price}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 13. SPEAKER WIDGET: Topic Showcase
  // ----------------------------------------------------
  if (type === "speaker") {
    const topics = [
      "The Future of Micro-Frontend Layouts",
      "Scaling Secure Multi-Tenant Frameworks",
      "Dynamic Real-Time Web Design Best Practices"
    ];
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-violet-400" /> Signature Speaking Topics
        </h4>

        <div className="space-y-2">
          {topics.map((t, idx) => (
            <div key={idx} className="p-3 bg-zinc-950/60 border border-white/5 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-zinc-300 font-medium leading-normal">{t}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => toast.success("Speaker booking inquiry form loaded!")}
          className="w-full py-2.5 rounded-lg text-xs font-bold text-white text-center hover:scale-102 transition-all mt-4 cursor-pointer"
          style={{ backgroundColor: accentColor || "#8b5cf6" }}
        >
          Request Speaker Booking Rate Sheet
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // 14. TEACHER WIDGET: Course Resource Hub
  // ----------------------------------------------------
  if (type === "teacher") {
    const files = [
      { name: "Syllabus_2026.pdf", size: "1.2 MB" },
      { name: "Lecture_Notes_Week1.pdf", size: "2.4 MB" }
    ];
    return (
      <div className={getWidgetClass()} style={getWidgetStyle()}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-xl rounded-full" />
        <h4 className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-400" /> Student Material Downloads
        </h4>

        <div className="space-y-2">
          {files.map((f, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
              <div>
                <div className="text-xs font-bold text-white">{f.name}</div>
                <div className="text-[9px] text-zinc-500">{f.size} • PDF Document</div>
              </div>
              <button
                onClick={() => toast.success(`Downloading file ${f.name}...`)}
                className="w-8 h-8 rounded-lg bg-zinc-950 border border-white/10 hover:bg-zinc-900 transition-colors flex items-center justify-center text-white cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If type is not recognized, return nothing
  return null;
}
