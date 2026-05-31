import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
import User from "@/models/User";
import Tree from "@/models/Tree";
import LinkModel from "@/models/Link";
import ViewTracker from "./ViewTracker";
import ContentTabs from "@/components/ContentTabs";
import {
  Mail,
  Phone,
  ArrowUpRight,
  Globe,
  Sparkles,
  AlertTriangle
} from "lucide-react";

// Robust high-fidelity custom brand SVGs
const SocialIcons = {
  twitter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  instagram: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  github: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  youtube: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  ),
  linkedin: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  tiktok: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
};

// Modern theme tokens matching the Admin preview options
const THEMES: {
  [key: string]: {
    bg: string;
    cardBg: string;
    text: string;
    accentText: string;
    btnHover: string;
    gridPattern?: boolean;
  };
} = {
  midnight: {
    bg: "bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950",
    cardBg: "bg-white/10 border-white/20 text-white shadow-xl hover:bg-white/15",
    text: "text-white",
    accentText: "text-violet-400",
    btnHover: "hover:scale-[1.02] active:scale-[0.98] transition-all"
  },
  sunset: {
    bg: "bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400",
    cardBg: "bg-white/95 border-white text-orange-950 shadow-lg hover:bg-white",
    text: "text-white",
    accentText: "text-amber-100",
    btnHover: "hover:scale-[1.02] active:scale-[0.98] transition-all"
  },
  cyberpunk: {
    bg: "bg-zinc-950",
    cardBg: "bg-black/90 border-cyan-500/50 hover:border-fuchsia-500 hover:text-fuchsia-400 text-cyan-400 font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    text: "text-zinc-100",
    accentText: "text-cyan-400",
    btnHover: "hover:scale-[1.02] active:scale-[0.98] transition-all",
    gridPattern: true
  },
  emerald: {
    bg: "bg-gradient-to-br from-emerald-950 via-teal-900 to-zinc-900",
    cardBg: "bg-emerald-800/10 border-emerald-500/20 text-emerald-100 shadow-xl hover:bg-emerald-800/20 hover:border-emerald-500/40",
    text: "text-emerald-50",
    accentText: "text-emerald-400",
    btnHover: "hover:scale-[1.02] active:scale-[0.98] transition-all"
  }
};

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const lowerUsername = username.toLowerCase();

  await dbConnect();

  // Try finding a Tree profile first
  let tree = await Tree.findOne({ slug: lowerUsername });
  let user: any = null;
  let profileSource: any = null;

  if (tree) {
    user = await User.findById(tree.userId);
    profileSource = tree;
  } else {
    // Fallback to legacy User username resolving
    user = await User.findOne({ username: lowerUsername });
    profileSource = user;
  }

  if (!profileSource || !user) {
    // Elegant custom 404 block for unclaimed usernames
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="z-10 max-w-md w-full p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white tracking-tight">Username Not Found</h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            The profile page <span className="text-rose-400 font-bold">offcutapp.com/{username}</span> is currently unclaimed or has been deactivated.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg transition-all duration-150 text-sm cursor-pointer"
            >
              Claim this Username Handle
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-semibold text-sm transition-all duration-150 cursor-pointer"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fetch Active Links sorted by Order
  const activeLinks = tree
    ? await LinkModel.find({ treeId: tree._id, isActive: true }).sort({ order: 1 })
    : await LinkModel.find({ userId: user._id, isActive: true, treeId: { $exists: false } }).sort({ order: 1 });

  // 3. Resolve active Theme configurations
  const themeKey = profileSource.theme || "midnight";
  const theme = THEMES[themeKey] || THEMES.midnight;

  // Dynamic customized theme options resolving
  const isCustomTheme = profileSource.themeSettings?.themeType === "custom";
  const customSettings = profileSource.themeSettings || {
    themeType: "preset",
    backgroundType: "gradient",
    backgroundColor: "#09090b",
    backgroundGradientStart: "#0f172a",
    backgroundGradientEnd: "#1e1b4b",
    backgroundImageUrl: "",
    fontFamily: "sans",
    cardStyle: "glassmorphic",
    cardRoundness: "rounded-xl",
    textColor: "#ffffff",
    accentColor: "#8b5cf6",
    buttonColor: ""
  };

  const finalBgStyle: React.CSSProperties = isCustomTheme
    ? customSettings.backgroundType === "solid"
      ? { backgroundColor: customSettings.backgroundColor }
      : customSettings.backgroundType === "image"
      ? {
          backgroundImage: `url(${customSettings.backgroundImageUrl || ""})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {
          backgroundImage: `linear-gradient(to bottom right, ${customSettings.backgroundGradientStart}, ${customSettings.backgroundGradientEnd})`,
        }
    : {};

  const finalBgClass = isCustomTheme ? "" : theme.bg;

  const finalFontClass = isCustomTheme
    ? customSettings.fontFamily === "serif"
      ? "font-serif"
      : customSettings.fontFamily === "mono"
      ? "font-mono"
      : customSettings.fontFamily === "display"
      ? "font-black tracking-tight"
      : "font-sans"
    : "font-sans";

  const finalTextStyle: React.CSSProperties = isCustomTheme ? { color: customSettings.textColor } : {};
  const finalTextClass = isCustomTheme ? "" : theme.text;
  const finalAccentTextStyle: React.CSSProperties = isCustomTheme ? { color: customSettings.accentColor } : {};
  const finalAccentTextClass = isCustomTheme ? "" : theme.accentText;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center p-6 relative overflow-hidden ${finalBgClass} ${finalFontClass}`} style={finalBgStyle}>
      {/* Client view logs trigger */}
      <ViewTracker username={lowerUsername} treeId={tree ? tree._id.toString() : undefined} />

      {/* Cyberpunk Grid Background Pattern */}
      {theme.gridPattern && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f12_1px,transparent_1px),linear-gradient(to_bottom,#0f0f12_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      )}

      {/* Glowing accents background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Core Profile Layout Container */}
      <div className="w-full max-w-xl mx-auto flex-1 flex flex-col items-center justify-between z-10 py-12">
        
        {/* Profile Card Header */}
        <div className="text-center flex flex-col items-center w-full">
          {profileSource.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profileSource.avatarUrl}
              alt={profileSource.name || lowerUsername}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/10 shadow-xl mb-4 bg-zinc-900"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border-4 border-white/10 shadow-xl mb-4 flex items-center justify-center font-extrabold text-white text-3xl">
              {profileSource.name ? profileSource.name.slice(0, 1).toUpperCase() : lowerUsername.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="flex items-center gap-1.5 justify-center">
            <h2 className={`text-2xl font-black tracking-tight ${finalTextClass}`} style={finalTextStyle}>
              {profileSource.name || `@${lowerUsername}`}
            </h2>
            {/* Verified Badge */}
            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shadow-md shadow-violet-500/20 select-none">
              <Sparkles className="w-3.5 h-3.5 text-white fill-white/20" />
            </div>
          </div>

          {profileSource.bio && (
            <p className={`text-sm mt-3 leading-relaxed max-w-sm opacity-90 ${finalTextClass}`} style={finalTextStyle}>
              {profileSource.bio}
            </p>
          )}

          {/* Social icons list */}
          {profileSource.socials && (
            <div className={`flex flex-wrap gap-4 items-center justify-center mt-6 opacity-95 ${finalTextClass}`} style={finalTextStyle}>
              {profileSource.socials.twitter && (
                <a
                  href={`https://twitter.com/${profileSource.socials.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:text-white transition-transform"
                >
                  <SocialIcons.twitter className="w-5 h-5" />
                </a>
              )}
              {profileSource.socials.instagram && (
                <a
                  href={`https://instagram.com/${profileSource.socials.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:text-white transition-transform"
                >
                  <SocialIcons.instagram className="w-5 h-5" />
                </a>
              )}
              {profileSource.socials.github && (
                <a
                  href={`https://github.com/${profileSource.socials.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:text-white transition-transform"
                >
                  <SocialIcons.github className="w-5 h-5" />
                </a>
              )}
              {profileSource.socials.youtube && (
                <a
                  href={`https://youtube.com/${profileSource.socials.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:text-white transition-transform"
                >
                  <SocialIcons.youtube className="w-5 h-5" />
                </a>
              )}
              {profileSource.socials.linkedin && (
                <a
                  href={`https://linkedin.com/${profileSource.socials.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:text-white transition-transform"
                >
                  <SocialIcons.linkedin className="w-5 h-5" />
                </a>
              )}
              {profileSource.socials.tiktok && (
                <a
                  href={`https://tiktok.com/${profileSource.socials.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 hover:text-white transition-transform"
                >
                  <SocialIcons.tiktok className="w-5 h-5" />
                </a>
              )}
              {profileSource.socials.email && (
                <a
                  href={`mailto:${profileSource.socials.email}`}
                  className="hover:scale-110 hover:text-white transition-transform"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Content Tabs - Links and Widgets */}
        <div className="w-full mt-8">
          {(() => {
            const presetColorMap: Record<string, string> = {
              midnight: "#8b5cf6",
              sunset: "#f59e0b",
              cyberpunk: "#06b6d4",
              emerald: "#10b981"
            };

            const serializedLinks = activeLinks.map((link) => ({
              _id: link._id.toString(),
              title: link.title,
              url: link.url,
              icon: link.icon || "",
              animationStyle: link.animationStyle || "none",
              tab: link.tab || "",
            }));

            const calculatedAccentColor = isCustomTheme
              ? customSettings.accentColor
              : (presetColorMap[profileSource.theme || "midnight"] || "#8b5cf6");

            // Only use widget-specific settings if they're explicitly set
            const useWidgetAccent = isCustomTheme && customSettings.widgetAccentColor;
            const useWidgetText = isCustomTheme && customSettings.widgetTextColor;
            const useWidgetRoundness = isCustomTheme && customSettings.widgetCardRoundness;
            const useWidgetStyle = isCustomTheme && customSettings.widgetCardStyle;
            const useWidgetButtonColor = isCustomTheme && customSettings.widgetButtonColor;

            return (
              <ContentTabs
                treeId={tree ? tree._id.toString() : ""}
                initialLinks={serializedLinks}
                tabs={profileSource.tabs || []}
                accentColor={calculatedAccentColor}
                textColor={isCustomTheme ? customSettings.textColor : "#ffffff"}
                cardRoundness="rounded-xl"
                cardStyle="glassmorphic"
                isCustomTheme={isCustomTheme}
                themeCardBg={theme.cardBg}
                themeBtnHover={theme.btnHover}
                widgetAccentColor={useWidgetAccent ? customSettings.widgetAccentColor : undefined}
                widgetTextColor={useWidgetText ? customSettings.widgetTextColor : undefined}
                widgetCardRoundness={useWidgetRoundness ? customSettings.widgetCardRoundness : undefined}
                widgetCardStyle={useWidgetStyle ? customSettings.widgetCardStyle : undefined}
                widgetButtonColor={useWidgetButtonColor ? customSettings.widgetButtonColor : undefined}
              />
            );
          })()}
        </div>

        {/* Brand Footer */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className={`inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase hover:underline opacity-60 hover:opacity-100 transition-opacity ${finalAccentTextClass}`}
            style={finalAccentTextStyle}
          >
            <Globe className="w-3.5 h-3.5" />
            Create your Offcut Link
          </Link>
        </div>

      </div>
    </div>
  );
}
