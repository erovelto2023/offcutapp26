import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Link as LinkIcon, BarChart3, ShieldAlert, Palette, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-zinc-950 via-slate-950 to-indigo-950">
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
            <LinkIcon className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Offcut<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Links</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-150"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-150 backdrop-blur-md"
          >
            Create Page
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center z-10 py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Modern Bio Link Infrastructure
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1]">
          The single link for{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            everything you create.
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed">
          Build a gorgeous, responsive, glassmorphic bio page. Personalize with modern themes, easily manage your links, and track clicks with detailed real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <Link
            href="/register"
            className="px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg hover:shadow-violet-600/30 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
          >
            Get Started For Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 hover:text-white font-semibold transition-all duration-200 backdrop-blur-md cursor-pointer"
          >
            Manage Your Links
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 text-left backdrop-blur-md group">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400 group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-white text-lg font-bold">Premium Themes</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Ditch basic styles. Choose between high-end glassmorphism, sunrise gradients, cyberpunk glow, or natural sage tokens.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 text-left backdrop-blur-md group">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-white text-lg font-bold">Deep Click-Tracking</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Track exactly where your audience goes. Measure CTR, visitor browsers, device profiles, referrers, and daily views.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 text-left backdrop-blur-md group">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-white text-lg font-bold">Harden Security</h3>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              Powered by secure HTTP-only cookies, Edge JWT cryptographic tokens, Zod schema isolation, and protocol sanitation.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between border-t border-white/5 z-10 mt-16 text-xs text-zinc-500">
        <div>
          © {new Date().getFullYear()} Offcut Links. Built with Next.js & MongoDB.
        </div>
        <div className="flex items-center gap-1 mt-3 sm:mt-0">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for creator autonomy.
        </div>
      </footer>
    </div>
  );
}
