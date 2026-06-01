"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import NicheWidgets from "@/components/NicheWidgets";
import WidgetManager from "@/components/WidgetManager";
import ModularWidgets from "@/components/ModularWidgets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Link2,
  Palette,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Globe,
  Settings2,
  CheckCircle,
  Eye,
  MousePointerClick,
  Percent,
  Mail,
  Phone,
  Compass,
  Monitor,
  PhoneCall,
  Laptop,
  Sparkles,
  Folder,
  X,
  Layers
} from "lucide-react";

// Custom SVG Brand Icons (resolves lucide deprecations)
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

// Theme custom settings default variables fallback
const THEME_SETTINGS_DEFAULT = {
  themeType: "preset" as const,
  backgroundType: "gradient" as const,
  backgroundColor: "#09090b",
  backgroundGradientStart: "#0f172a",
  backgroundGradientEnd: "#1e1b4b",
  backgroundImageUrl: "",
  fontFamily: "sans" as const,
  cardStyle: "glassmorphic" as const,
  cardRoundness: "rounded-xl" as const,
  textColor: "#ffffff",
  accentColor: "#8b5cf6",
  buttonColor: "",
  tabSelectedColor: "#8b5cf6",
  tabUnselectedColor: "#0d0d0d",
  widgetCardStyle: undefined as "glassmorphic" | "flat" | "outline" | "neon" | undefined,
  widgetCardRoundness: undefined as "rounded-none" | "rounded-xl" | "rounded-full" | undefined,
  widgetAccentColor: undefined as string | undefined,
  widgetTextColor: undefined as string | undefined,
  widgetButtonColor: undefined as string | undefined
};

// Modern theme tokens matching /[username] styling
const THEMES = [
  {
    id: "midnight",
    name: "Midnight Glass",
    bg: "bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950",
    cardBg: "bg-white/10 border-white/20 text-white",
    text: "text-white",
    desc: "Slate glassmorphism on deep purple"
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    bg: "bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400",
    cardBg: "bg-white/90 border-white text-orange-950 shadow-md",
    text: "text-orange-950",
    desc: "Clean solid white cards on warm dusk"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Neon",
    bg: "bg-zinc-950 border border-zinc-800",
    cardBg: "bg-black/80 border-cyan-500/50 hover:border-fuchsia-500 text-cyan-400 font-mono shadow-[0_0_10px_rgba(6,182,212,0.15)]",
    text: "text-cyan-400",
    desc: "Cyberpunk grid aesthetic with neon accents"
  },
  {
    id: "emerald",
    name: "Emerald Forest",
    bg: "bg-gradient-to-br from-emerald-950 via-teal-900 to-zinc-900",
    cardBg: "bg-emerald-800/20 border-emerald-500/30 text-emerald-100",
    text: "text-emerald-100",
    desc: "Soft sage cards on deep jade forest"
  }
];

// Presets for emojis to picker
const EMOJI_PRESETS = ["💼", "🎥", "🎧", "✍️", "💻", "🛒", "🔥", "🌍", "✨", "📱", "🎵", "💬", "📧"];

interface LinkItem {
  _id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  order: number;
  clicksCount: number;
  animationStyle?: "none" | "pulse" | "bounce" | "shine";
  tab?: string;
}

interface UserProfile {
  _id?: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  theme: "midnight" | "sunset" | "cyberpunk" | "emerald";
  type?: string;
  nicheSettings?: Record<string, any>;
  themeSettings?: {
    themeType: "preset" | "custom";
    backgroundType: "solid" | "gradient" | "image";
    backgroundColor: string;
    backgroundGradientStart: string;
    backgroundGradientEnd: string;
    backgroundImageUrl?: string;
    fontFamily: "sans" | "serif" | "mono" | "display";
    cardStyle: "glassmorphic" | "flat" | "outline" | "neon";
    cardRoundness: "rounded-none" | "rounded-xl" | "rounded-full";
    textColor: string;
    accentColor: string;
    buttonColor?: string;
    tabSelectedColor?: string;
    tabUnselectedColor?: string;
    widgetCardStyle?: "glassmorphic" | "flat" | "outline" | "neon";
    widgetCardRoundness?: "rounded-none" | "rounded-xl" | "rounded-full";
    widgetAccentColor?: string;
    widgetTextColor?: string;
    widgetButtonColor?: string;
  };
  socials: {
    twitter: string;
    instagram: string;
    github: string;
    youtube: string;
    linkedin: string;
    tiktok: string;
    email: string;
    phone: string;
  };
  tabs?: string[];
}

function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = (searchParams.get("slug") || "").replace(/:.+$/, ""); // Remove any trailing :1 artifacts

  // Core Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [treeId, setTreeId] = useState<string | null>(null);

  // Loading States
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [addingLink, setAddingLink] = useState(false);

  // Form States (New Link)
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("✨");
  const [newLinkTab, setNewLinkTab] = useState("");

  // Inline editing link states
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editLinkTab, setEditLinkTab] = useState("");
  const [newAnimationStyle, setNewAnimationStyle] = useState<"none" | "pulse" | "bounce" | "shine">("none");
  const [editAnimationStyle, setEditAnimationStyle] = useState<"none" | "pulse" | "bounce" | "shine">("none");

  // Tab Manager States
  const [tabInput, setTabInput] = useState("");
  const [activeAdminTabFilter, setActiveAdminTabFilter] = useState("All");
  const [activePreviewTabFilter, setActivePreviewTabFilter] = useState("All");
  const [activePreviewContent, setActivePreviewContent] = useState<"links" | "widgets">("links");

  // Avatar Selection states
  const [avatarOption, setAvatarOption] = useState<"upload" | "url">("upload");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Background Custom Image states
  const [bgOption, setBgOption] = useState<"upload" | "url">("upload");
  const [uploadingBg, setUploadingBg] = useState(false);

  // Custom Icon states
  const [customIcons, setCustomIcons] = useState<string[]>([]);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [iconOption, setIconOption] = useState<"emoji" | "upload">("emoji");
  const [editIconOption, setEditIconOption] = useState<"emoji" | "upload">("emoji");

  // Fetch initial profile & links & analytics data
  useEffect(() => {
    if (!slug) return;
    fetchProfile();
    fetchLinks();
    fetchAnalytics();
  }, [slug]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/admin/profile?slug=${slug}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data);

      // Fetch tree ID for widgets
      if (data._id) {
        setTreeId(data._id);
      } else {
        // Try to get tree by slug if profile doesn't have _id
        try {
          const treeRes = await fetch(`/api/admin/trees?slug=${slug}`);
          if (treeRes.ok) {
            const treeData = await treeRes.json();
            if (treeData && treeData.length > 0) {
              setTreeId(treeData[0]._id);
            }
          }
        } catch (err) {
          console.error("Failed to fetch tree:", err);
        }
      }
    } catch {
      toast.error("Failed to load profile details.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch(`/api/admin/links?slug=${slug}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLinks(data);
    } catch {
      toast.error("Failed to fetch links.");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/admin/analytics?slug=${slug}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAnalytics(data);
    } catch {
      console.error("Failed to fetch analytics metrics.");
    }
  };

  // 1. Profile Modification
  const handleUpdateProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!profile) return;
    setSavingProfile(true);

    const newProfile = { ...profile, ...updatedFields };

    try {
      const res = await fetch(`/api/admin/profile?slug=${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Save profile failed");
      }

      const saved = await res.json();
      setProfile(saved);
      toast.success("Appearance settings synced successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile settings.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdateThemeSettings = async (settingsFields: Partial<NonNullable<UserProfile["themeSettings"]>>) => {
    if (!profile) return;
    const currentSettings = profile.themeSettings || THEME_SETTINGS_DEFAULT;
    const newSettings = { ...currentSettings, ...settingsFields };
    handleUpdateProfile({ themeSettings: newSettings });
  };

  const handleLocalThemeSettingsChange = (fields: Partial<NonNullable<UserProfile["themeSettings"]>>) => {
    setProfile((p) => {
      if (!p) return null;
      const current = p.themeSettings || THEME_SETTINGS_DEFAULT;
      return {
        ...p,
        themeSettings: { ...current, ...fields }
      };
    });
  };

  // Avatar Upload Handlers (NEW!)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. JPEG, PNG, WEBP, and GIF are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/avatar/upload?slug=${slug}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      setProfile((p) => p ? { ...p, avatarUrl: data.url } : null);
      await handleUpdateProfile({ avatarUrl: data.url });
      toast.success("Avatar photo updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. JPEG, PNG, WEBP, and GIF are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/avatar/upload?slug=${slug}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      setProfile((p) => p ? { ...p, avatarUrl: data.url } : null);
      await handleUpdateProfile({ avatarUrl: data.url });
      toast.success("Avatar photo updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Background Upload Handlers (NEW!)
  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. JPEG, PNG, WEBP, and GIF are allowed.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 8MB for backgrounds.");
      return;
    }

    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/background/upload?slug=${slug}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload background image");
      }

      handleUpdateThemeSettings({ backgroundImageUrl: data.url });
      toast.success("Background custom photo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload background image");
    } finally {
      setUploadingBg(false);
    }
  };

  // Icon Upload Handler
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. JPEG, PNG, WEBP, GIF, and SVG are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB for icons.");
      return;
    }

    setUploadingIcon(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/icons/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload icon");
      }

      setCustomIcons((prev) => [...prev, data.url]);
      // Set icon based on which mode we're in
      if (editingLinkId) {
        setEditIcon(data.url);
      } else {
        setNewIcon(data.url);
      }
      toast.success("Custom icon uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload icon");
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleBgDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. JPEG, PNG, WEBP, and GIF are allowed.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 8MB.");
      return;
    }

    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/admin/background/upload?slug=${slug}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload background image");
      }

      handleUpdateThemeSettings({ backgroundImageUrl: data.url });
      toast.success("Background custom photo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload background image");
    } finally {
      setUploadingBg(false);
    }
  };

  // Tab Categories Handlers (NEW!)
  const handleAddTabCategory = async () => {
    if (!tabInput.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }
    const cleanTab = tabInput.trim();
    if (cleanTab.toLowerCase() === "all" || cleanTab.toLowerCase() === "uncategorized") {
      toast.error("Invalid category name.");
      return;
    }
    const currentTabs = profile?.tabs || [];
    if (currentTabs.includes(cleanTab)) {
      toast.error("This category already exists.");
      return;
    }
    const updatedTabs = [...currentTabs, cleanTab];
    setTabInput("");
    await handleUpdateProfile({ tabs: updatedTabs });
    toast.success(`Category "${cleanTab}" created!`);
  };

  const handleRemoveTabCategory = async (tabName: string) => {
    if (!confirm(`Are you sure you want to delete the "${tabName}" category? The links inside it will be moved to uncategorized.`)) return;
    const currentTabs = profile?.tabs || [];
    const updatedTabs = currentTabs.filter((t) => t !== tabName);

    // Update frontend state
    setLinks((prev) => prev.map((l) => l.tab === tabName ? { ...l, tab: "" } : l));

    // Asynchronously update links that were in this tab on backend to be empty string
    const linksToUpdate = links.filter((l) => l.tab === tabName);
    for (const link of linksToUpdate) {
      fetch(`/api/admin/links?slug=${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: link._id, tab: "" }),
      }).catch((err) => console.error("Failed to un-categorize link:", err));
    }

    await handleUpdateProfile({ tabs: updatedTabs });
    toast.success(`Category "${tabName}" removed.`);
    
    if (activeAdminTabFilter === tabName) {
      setActiveAdminTabFilter("All");
    }
    if (activePreviewTabFilter === tabName) {
      setActivePreviewTabFilter("All");
    }
  };

  // 2. Add New Link
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) {
      toast.error("Please provide both title and url.");
      return;
    }

    setAddingLink(true);
    try {
      const res = await fetch(`/api/admin/links?slug=${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          url: newUrl,
          icon: newIcon,
          animationStyle: newAnimationStyle,
          tab: newLinkTab,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Add link failed");
      }

      setLinks((prev) => [...prev, data]);
      setNewTitle("");
      setNewUrl("");
      setNewIcon("✨");
      setNewAnimationStyle("none");
      setNewLinkTab("");
      toast.success("New custom link added!");
      fetchAnalytics(); // Refresh analytics list
    } catch (err: any) {
      toast.error(err.message || "Failed to create link.");
    } finally {
      setAddingLink(false);
    }
  };

  // 3. Toggle Link Active State
  const handleToggleLink = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/links?slug=${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLinks((prev) => prev.map((l) => (l._id === id ? data : l)));
      toast.success(currentStatus ? "Link disabled" : "Link enabled!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  // 4. Trigger Inline Edit Save
  const handleSaveEdit = async (id: string) => {
    if (!editTitle || !editUrl) {
      toast.error("Title and URL cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/links?slug=${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: editTitle,
          url: editUrl,
          icon: editIcon,
          animationStyle: editAnimationStyle,
          tab: editLinkTab,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setLinks((prev) => prev.map((l) => (l._id === id ? data : l)));
      setEditingLinkId(null);
      toast.success("Link updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update link.");
    }
  };

  // 5. Delete Link
  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this link?")) return;

    try {
      const res = await fetch(`/api/admin/links?id=${id}&slug=${slug}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setLinks((prev) => prev.filter((l) => l._id !== id));
      toast.success("Link deleted.");
      fetchAnalytics(); // Refresh metrics
    } catch (err: any) {
      toast.error(err.message || "Failed to delete link.");
    }
  };

  // 6. Manual Reordering
  const handleReorder = async (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= links.length) return;

    const listCopy = [...links];
    // Swap items
    const temp = listCopy[index];
    listCopy[index] = listCopy[nextIndex];
    listCopy[nextIndex] = temp;

    // Recalculate ordering sequence index numbers
    const updatedOrders = listCopy.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));

    // Optimistic local state update
    setLinks(listCopy.map((item, idx) => ({ ...item, order: idx })));

    try {
      const res = await fetch(`/api/admin/links?slug=${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: updatedOrders }),
      });

      const sortedResult = await res.json();
      if (!res.ok) throw new Error();
      setLinks(sortedResult);
    } catch {
      toast.error("Failed to save reorder details to DB.");
      fetchLinks(); // Revert on failure
    }
  };

  // 7. Sign Out flow
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
        <div className="w-10 h-10 border-4 border-violet-600/30 border-t-violet-500 rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Synchronizing dashboard settings...</p>
      </div>
    );
  }

  // Active preview styling tokens resolving
  const selectedThemeToken = THEMES.find((t) => t.id === (profile?.theme || "midnight")) || THEMES[0];

  // Dynamically resolve custom or preset styles for the mockup preview
  const isCustomTheme = profile?.themeSettings?.themeType === "custom";
  const customSettings = profile?.themeSettings || THEME_SETTINGS_DEFAULT;

  // Background style
  const previewBgStyle: React.CSSProperties = isCustomTheme
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

  const previewBgClass = isCustomTheme ? "" : selectedThemeToken.bg;

  // Font family class
  const previewFontClass = isCustomTheme
    ? customSettings.fontFamily === "serif"
      ? "font-serif"
      : customSettings.fontFamily === "mono"
      ? "font-mono"
      : customSettings.fontFamily === "display"
      ? "font-black tracking-tight"
      : "font-sans"
    : "font-sans";

  // Text color style
  const previewTextStyle: React.CSSProperties = isCustomTheme ? { color: customSettings.textColor } : {};
  const previewTextClass = isCustomTheme ? "" : selectedThemeToken.text;

  // Card style class
  const getPreviewCardStyle = (isActive: boolean) => {
    if (!isCustomTheme) return selectedThemeToken.cardBg;

    const roundness = customSettings.cardRoundness; // "rounded-none" | "rounded-xl" | "rounded-full"
    let base = `w-full py-2.5 px-4 text-center font-bold text-xs flex items-center justify-center relative cursor-pointer active:scale-[0.98] transition-transform ${roundness} `;

    if (customSettings.cardStyle === "glassmorphic") {
      base += "bg-white/10 border border-white/20";
    } else if (customSettings.cardStyle === "flat") {
      base += "bg-zinc-900 border border-zinc-800";
    } else if (customSettings.cardStyle === "outline") {
      base += "bg-transparent border border-white/30";
    } else if (customSettings.cardStyle === "neon") {
      base += "bg-black/85 border";
    }
    return base;
  };

  const getPreviewCardInlineStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties & Record<string, any> = {};
    if (isCustomTheme) {
      styles.color = customSettings.textColor;
      if (customSettings.cardStyle === "neon") {
        styles.borderColor = customSettings.accentColor;
        styles.boxShadow = `0 0 8px ${customSettings.accentColor}50`;
      } else {
        styles.borderColor = `${customSettings.textColor}25`;
      }
      if (customSettings.buttonColor) {
        styles.backgroundColor = customSettings.buttonColor;
      }
      styles["--accent-color" as any] = customSettings.accentColor;
    } else {
      const presetColorMap: Record<string, string> = {
        midnight: "#8b5cf6",
        sunset: "#f59e0b",
        cyberpunk: "#06b6d4",
        emerald: "#10b981"
      };
      styles["--accent-color" as any] = presetColorMap[profile?.theme || "midnight"] || "#8b5cf6";
    }
    return styles;
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 min-h-screen">
      {/* Top Navbar */}
      <header className="w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/members"
            className="flex p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer items-center justify-center"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-white tracking-tight">Offcut Links Studio</span>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Globe className="w-3 h-3 text-violet-400" />
                Public: <a href={`/${slug}`} target="_blank" className="underline text-zinc-300 hover:text-white">offcutapp.com/{slug}</a>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${slug}`}
            target="_blank"
            className="hidden sm:flex px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 gap-1.5 items-center transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            View Page
          </a>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleSignOut}
            className="bg-red-950/60 border border-red-500/20 hover:bg-red-900/60 text-red-200 font-semibold gap-1.5 text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </Button>
        </div>
      </header>

      {/* Workspace Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Editor Tabs */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="links" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-6 grid grid-cols-4">
              <TabsTrigger
                value="links"
                className="rounded-lg py-2 text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Manage Links
              </TabsTrigger>
              <TabsTrigger
                value="widgets"
                className="rounded-lg py-2 text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 mr-2" />
                Widgets
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="rounded-lg py-2 text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer"
              >
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-lg py-2 text-xs font-semibold data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer"
                onClick={fetchAnalytics}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: LINKS MANAGEMENT */}
            <TabsContent value="links" className="space-y-6 outline-none">
              {/* Category Tabs Manager (NEW!) */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                    <Folder className="w-5 h-5 text-violet-400" />
                    Link Categories (Tabs)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Videos, Portfolio, Shop..."
                      value={tabInput}
                      onChange={(e) => setTabInput(e.target.value)}
                      className="bg-zinc-950 border-white/10 text-white placeholder-zinc-600 text-xs flex-1 h-9"
                    />
                    <Button
                      onClick={handleAddTabCategory}
                      type="button"
                      className="bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white h-9 px-4 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Tab
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveAdminTabFilter("All")}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        activeAdminTabFilter === "All"
                          ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/25 scale-[1.03]"
                          : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      All Links ({links.length})
                    </button>
                    {profile?.tabs?.map((tabName) => {
                      const count = links.filter((l) => l.tab === tabName).length;
                      return (
                        <div
                          key={tabName}
                          className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-full px-3 py-1 pl-3.5"
                        >
                          <button
                            type="button"
                            onClick={() => setActiveAdminTabFilter(tabName)}
                            className={`text-xs font-bold transition-all ${
                              activeAdminTabFilter === tabName
                                ? "text-violet-400 font-extrabold scale-[1.03]"
                                : "text-zinc-300 hover:text-white"
                            }`}
                          >
                            {tabName} <span className="text-[10px] text-zinc-500 font-normal">({count})</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTabCategory(tabName)}
                            className="p-0.5 rounded-full hover:bg-white/10 text-zinc-500 hover:text-red-400 transition-colors ml-1"
                            title="Delete this Category Tab"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Form to create link */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-violet-400" />
                    Create New Link Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="title" className="text-zinc-300 text-xs">Link Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g. Visit My Portfolio Site"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="bg-zinc-950 border-white/10 text-white placeholder-zinc-600 text-xs h-9"
                          disabled={addingLink}
                          required
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="url" className="text-zinc-300 text-xs">Destination URL</Label>
                        <Input
                          id="url"
                          placeholder="https://mywebsite.com"
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          className="bg-zinc-950 border-white/10 text-white placeholder-zinc-600 text-xs h-9"
                          disabled={addingLink}
                          required
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="tabCategory" className="text-zinc-300 text-xs">Tab Category (Optional)</Label>
                        <select
                          id="tabCategory"
                          value={newLinkTab}
                          onChange={(e) => setNewLinkTab(e.target.value)}
                          className="w-full h-9 rounded-lg bg-zinc-950 border border-white/10 text-zinc-300 px-3 text-xs focus:outline-none focus:border-violet-500 cursor-pointer"
                        >
                          <option value="">Uncategorized (General)</option>
                          {profile?.tabs?.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-300 text-xs">Choose Icon</Label>
                      
                      {/* Icon Type Toggle */}
                      <div className="flex gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => setIconOption("emoji")}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            iconOption === "emoji"
                              ? "bg-violet-600 text-white"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                          }`}
                        >
                          Emoji
                        </button>
                        <button
                          type="button"
                          onClick={() => setIconOption("upload")}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                            iconOption === "upload"
                              ? "bg-violet-600 text-white"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                          }`}
                        >
                          Custom Image
                        </button>
                      </div>

                      {iconOption === "emoji" ? (
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            type="text"
                            maxLength={3}
                            value={newIcon}
                            onChange={(e) => setNewIcon(e.target.value)}
                            className="w-12 h-9 rounded-lg bg-zinc-950 border border-white/10 text-center text-md text-white focus:outline-none focus:border-violet-500"
                          />
                          <div className="flex gap-1.5 overflow-x-auto py-1">
                            {EMOJI_PRESETS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => setNewIcon(emoji)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border hover:bg-white/10 transition-colors ${
                                  newIcon === emoji ? "border-violet-500 bg-violet-500/25" : "border-white/10 bg-zinc-950/40"
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              id="iconUpload"
                              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                              onChange={handleIconUpload}
                              className="hidden"
                              disabled={uploadingIcon}
                            />
                            <label
                              htmlFor="iconUpload"
                              className={`flex-1 py-2 px-4 rounded-lg border border-dashed border-white/20 text-center text-xs cursor-pointer transition-colors ${
                                uploadingIcon
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:border-violet-500 hover:bg-violet-500/10"
                              }`}
                            >
                              {uploadingIcon ? "Uploading..." : "Click to upload icon"}
                            </label>
                          </div>
                          
                          {/* Show uploaded custom icons */}
                          {customIcons.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-1">
                              {customIcons.map((iconUrl, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => setNewIcon(iconUrl)}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center border hover:bg-white/10 transition-colors ${
                                    newIcon === iconUrl ? "border-violet-500 bg-violet-500/25" : "border-white/10 bg-zinc-950/40"
                                  }`}
                                >
                                  <img src={iconUrl} alt="" className="w-5 h-5 object-contain" />
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {/* Show current selected custom icon */}
                          {newIcon.startsWith("/api/uploads/icons/") && (
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                              <img src={newIcon} alt="" className="w-6 h-6 object-contain" />
                              <span>Custom icon selected</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-300 text-xs">Featured Highlight Style</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { id: "none", name: "Standard", desc: "Classic static link" },
                          { id: "pulse", name: "Pulse Glow", desc: "Infinite soft wave" },
                          { id: "bounce", name: "Bounce Up", desc: "Continuous bounce" },
                          { id: "shine", name: "Hover Shine", desc: "Animated light flash" }
                        ].map((anim) => (
                          <button
                            key={anim.id}
                            type="button"
                            onClick={() => setNewAnimationStyle(anim.id as any)}
                            className={`p-2 border rounded-lg text-left transition-all cursor-pointer ${
                              newAnimationStyle === anim.id
                                ? "border-violet-500 bg-violet-500/10 text-white"
                                : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <div className="text-[10px] font-bold">{anim.name}</div>
                            <div className="text-[8px] text-zinc-500 mt-0.5">{anim.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={addingLink}
                      className="w-full bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white shadow-lg cursor-pointer"
                    >
                      {addingLink ? "Adding Link..." : "Create Link Card"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Display links collection */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-1.5">
                  <Settings2 className="w-4 h-4 text-violet-400" />
                  Your Active & Draft Links ({links.length})
                </h3>

                {links.length === 0 ? (
                  <div className="p-10 border border-dashed border-white/10 rounded-xl text-center">
                    <Link2 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                    <p className="text-sm text-zinc-400 font-medium">You haven&apos;t added any links yet.</p>
                    <p className="text-xs text-zinc-500 mt-1">Complete the creation card above to add your first bio-link!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {links
                      .filter((l) => activeAdminTabFilter === "All" || l.tab === activeAdminTabFilter)
                      .map((link, idx) => (
                        <Card key={link._id} className={`border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden transition-all ${
                          !link.isActive ? "opacity-60" : ""
                        }`}>
                          <div className="p-4 flex items-center justify-between gap-4">
                            {/* Re-order arrows */}
                            <div className="flex flex-col gap-1 items-center justify-center">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleReorder(idx, "up")}
                                className="p-1 rounded bg-zinc-900 border border-white/5 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-900 text-zinc-400 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === links.length - 1}
                                onClick={() => handleReorder(idx, "down")}
                                className="p-1 rounded bg-zinc-900 border border-white/5 hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-900 text-zinc-400 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Content / Info or Edit inputs */}
                            <div className="flex-1 min-w-0">
                              {editingLinkId === link._id ? (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-zinc-400">Choose Icon</Label>
                                    
                                    {/* Icon Type Toggle */}
                                    <div className="flex gap-2 mb-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditIconOption("emoji")}
                                        className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                                          editIconOption === "emoji"
                                            ? "bg-violet-600 text-white"
                                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                        }`}
                                      >
                                        Emoji
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditIconOption("upload")}
                                        className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                                          editIconOption === "upload"
                                            ? "bg-violet-600 text-white"
                                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                        }`}
                                      >
                                        Custom Image
                                      </button>
                                    </div>

                                    {editIconOption === "emoji" ? (
                                      <div className="flex flex-wrap gap-1 items-center">
                                        <input
                                          type="text"
                                          maxLength={3}
                                          value={editIcon}
                                          onChange={(e) => setEditIcon(e.target.value)}
                                          className="w-10 h-7 rounded bg-zinc-950 border border-white/10 text-center text-sm text-white focus:outline-none focus:border-violet-500"
                                        />
                                        <div className="flex gap-1 overflow-x-auto py-1">
                                          {EMOJI_PRESETS.map((emoji) => (
                                            <button
                                              key={emoji}
                                              type="button"
                                              onClick={() => setEditIcon(emoji)}
                                              className={`w-7 h-7 rounded flex items-center justify-center text-xs border hover:bg-white/10 transition-colors ${
                                                editIcon === emoji ? "border-violet-500 bg-violet-500/25" : "border-white/10 bg-zinc-950/40"
                                              }`}
                                            >
                                              {emoji}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="file"
                                            id="editIconUpload"
                                            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                            onChange={handleIconUpload}
                                            className="hidden"
                                            disabled={uploadingIcon}
                                          />
                                          <label
                                            htmlFor="editIconUpload"
                                            className={`flex-1 py-1.5 px-3 rounded border border-dashed border-white/20 text-center text-[10px] cursor-pointer transition-colors ${
                                              uploadingIcon
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:border-violet-500 hover:bg-violet-500/10"
                                            }`}
                                          >
                                            {uploadingIcon ? "Uploading..." : "Click to upload icon"}
                                          </label>
                                        </div>
                                        
                                        {/* Show uploaded custom icons */}
                                        {customIcons.length > 0 && (
                                          <div className="flex gap-1 overflow-x-auto py-1">
                                            {customIcons.map((iconUrl, index) => (
                                              <button
                                                key={index}
                                                type="button"
                                                onClick={() => setEditIcon(iconUrl)}
                                                className={`w-7 h-7 rounded flex items-center justify-center border hover:bg-white/10 transition-colors ${
                                                  editIcon === iconUrl ? "border-violet-500 bg-violet-500/25" : "border-white/10 bg-zinc-950/40"
                                                }`}
                                              >
                                                <img src={iconUrl} alt="" className="w-4 h-4 object-contain" />
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                        
                                        {/* Show current selected custom icon */}
                                        {editIcon.startsWith("/api/uploads/icons/") && (
                                          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                                            <img src={editIcon} alt="" className="w-5 h-5 object-contain" />
                                            <span>Custom icon selected</span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <Label className="text-[10px] text-zinc-400">Title</Label>
                                      <Input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="bg-zinc-950 border-white/15 text-xs h-8"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-[10px] text-zinc-400">URL</Label>
                                      <Input
                                        value={editUrl}
                                        onChange={(e) => setEditUrl(e.target.value)}
                                        className="bg-zinc-950 border-white/15 text-xs h-8"
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                      <Label className="text-[10px] text-zinc-400">Featured Highlight Style</Label>
                                      <div className="grid grid-cols-4 gap-1 mt-1">
                                        {[
                                          { id: "none", name: "Standard" },
                                          { id: "pulse", name: "Pulse" },
                                          { id: "bounce", name: "Bounce" },
                                          { id: "shine", name: "Shine" }
                                        ].map((anim) => (
                                          <button
                                            key={anim.id}
                                            type="button"
                                            onClick={() => setEditAnimationStyle(anim.id as any)}
                                            className={`py-1 border rounded text-center text-[9px] capitalize cursor-pointer ${
                                              editAnimationStyle === anim.id
                                                ? "border-violet-500 bg-violet-500/10 text-white"
                                                : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                                            }`}
                                          >
                                            {anim.name}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <Label className="text-[10px] text-zinc-400">Tab Category</Label>
                                      <select
                                        value={editLinkTab}
                                        onChange={(e) => setEditLinkTab(e.target.value)}
                                        className="w-full h-8 rounded bg-zinc-950 border border-white/15 text-zinc-300 px-3 text-[10px] focus:outline-none focus:border-violet-500 cursor-pointer"
                                      >
                                        <option value="">Uncategorized (General)</option>
                                        {profile?.tabs?.map((t) => (
                                          <option key={t} value={t}>
                                            {t}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleSaveEdit(link._id)}
                                      className="bg-emerald-600 hover:bg-emerald-500 text-[10px] font-semibold text-white px-3 py-1 cursor-pointer"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingLinkId(null)}
                                      className="border-white/10 hover:bg-white/5 text-[10px] font-semibold text-zinc-300 px-3 py-1 cursor-pointer"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg select-none">{link.icon || "✨"}</span>
                                    <span className="font-bold text-sm text-white truncate">{link.title}</span>
                                    {link.tab && (
                                      <span className="px-2 py-0.5 rounded-full bg-violet-950/40 border border-violet-500/10 text-violet-400 text-[8px] font-bold">
                                        {link.tab}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-zinc-500 font-medium truncate mt-0.5 max-w-md">
                                    {link.url}
                                  </div>
                                  <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-400">
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-white/5 font-semibold text-violet-400">
                                      {link.clicksCount} Clicks
                                    </span>
                                    {!link.isActive && (
                                      <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/10 text-red-400 font-semibold">
                                        Draft Mode
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Control toggle switch & edit/delete */}
                            <div className="flex items-center gap-3">
                              {editingLinkId !== link._id && (
                                <button
                                  onClick={() => {
                                    setEditingLinkId(link._id);
                                    setEditTitle(link.title);
                                    setEditUrl(link.url);
                                    setEditIcon(link.icon || "✨");
                                    setEditIconOption(link.icon?.startsWith("/api/uploads/icons/") ? "upload" : "emoji");
                                    setEditAnimationStyle(link.animationStyle || "none");
                                    setEditLinkTab(link.tab || "");
                                  }}
                                  className="p-2 rounded bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>
                              )}

                              <Switch
                                checked={link.isActive}
                                onCheckedChange={() => handleToggleLink(link._id, link.isActive)}
                                className="data-[state=checked]:bg-violet-600 cursor-pointer"
                              />

                              <button
                                onClick={() => handleDeleteLink(link._id)}
                                className="p-2 rounded bg-red-950/30 border border-red-500/10 hover:bg-red-950/60 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: WIDGETS MANAGEMENT */}
            <TabsContent value="widgets" className="space-y-6 outline-none">
              {treeId && <WidgetManager treeId={treeId} />}
            </TabsContent>

            {/* TAB 3: APPEARANCE & THEMES */}
            <TabsContent value="appearance" className="space-y-6 outline-none">
              {/* Profile Bio Details */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-violet-400" />
                    Customize Profile Card
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Sync your name, biographical summary, avatar url and social links.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-zinc-300 text-xs">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile?.name || ""}
                        onChange={(e) => setProfile((p) => p ? { ...p, name: e.target.value } : null)}
                        onBlur={() => handleUpdateProfile({ name: profile?.name })}
                        className="bg-zinc-950 border-white/10 text-white text-xs"
                      />
                    </div>
                     <div className="space-y-2 col-span-2 md:col-span-1">
                      <div className="flex justify-between items-center h-8">
                        <Label className="text-zinc-300 text-xs">Avatar Photo Option</Label>
                        <div className="flex bg-zinc-950 border border-white/10 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => setAvatarOption("upload")}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                              avatarOption === "upload"
                                ? "bg-violet-600 text-white shadow"
                                : "text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            Upload Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setAvatarOption("url")}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                              avatarOption === "url"
                                ? "bg-violet-600 text-white shadow"
                                : "text-zinc-400 hover:text-zinc-200"
                            }`}
                          >
                            Image URL
                          </button>
                        </div>
                      </div>

                      {avatarOption === "url" ? (
                        <div className="space-y-1 mt-1.5">
                          <Input
                            id="avatarUrl"
                            placeholder="https://yourdomain.com/photo.jpg"
                            value={profile?.avatarUrl || ""}
                            onChange={(e) => setProfile((p) => p ? { ...p, avatarUrl: e.target.value } : null)}
                            onBlur={() => handleUpdateProfile({ avatarUrl: profile?.avatarUrl })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                          {profile?.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setProfile((p) => p ? { ...p, avatarUrl: "" } : null);
                                handleUpdateProfile({ avatarUrl: "" });
                              }}
                              className="text-[10px] text-red-400 hover:underline font-bold mt-1 block cursor-pointer text-left"
                            >
                              Clear Avatar Photo URL
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1.5 mt-1.5">
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleAvatarDrop}
                            className={`border border-dashed rounded-lg p-3 text-center cursor-pointer relative bg-zinc-950/40 transition-all ${
                              uploadingAvatar
                                ? "border-violet-500 bg-violet-500/5 animate-pulse"
                                : "border-white/10 hover:border-violet-500/50 hover:bg-zinc-950/80"
                            }`}
                            onClick={() => document.getElementById("avatar-file-input")?.click()}
                          >
                            <input
                              type="file"
                              id="avatar-file-input"
                              className="hidden"
                              accept="image/*"
                              onChange={handleAvatarUpload}
                              disabled={uploadingAvatar}
                            />
                            {uploadingAvatar ? (
                              <div className="space-y-1 flex flex-col items-center justify-center py-1">
                                <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                                <span className="text-[9px] text-violet-400 font-bold">Uploading file...</span>
                              </div>
                            ) : profile?.avatarUrl ? (
                              <div className="flex items-center justify-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={profile.avatarUrl}
                                  alt="avatar"
                                  className="w-8 h-8 rounded-full object-cover border border-white/15"
                                />
                                <div className="text-left">
                                  <span className="text-[9px] text-zinc-300 font-bold block truncate max-w-[120px]">
                                    {profile.avatarUrl.split("/").pop()}
                                  </span>
                                  <span className="text-[8px] text-emerald-400 font-bold block">✓ Uploaded successfully</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1 py-1">
                                <span className="text-[10px] text-zinc-300 font-bold block">Click to upload or drag & drop</span>
                                <span className="text-[8px] text-zinc-500 block">PNG, JPG, WEBP, GIF (Max 5MB)</span>
                              </div>
                            )}
                          </div>
                          {profile?.avatarUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setProfile((p) => p ? { ...p, avatarUrl: "" } : null);
                                handleUpdateProfile({ avatarUrl: "" });
                              }}
                              className="text-[10px] text-red-400 hover:underline font-bold block cursor-pointer text-left"
                            >
                              Remove Avatar Photo
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bioText" className="text-zinc-300 text-xs">Bio Summary</Label>
                    <textarea
                      id="bioText"
                      rows={3}
                      value={profile?.bio || ""}
                      onChange={(e) => setProfile((p) => p ? { ...p, bio: e.target.value } : null)}
                      onBlur={() => handleUpdateProfile({ bio: profile?.bio })}
                      className="w-full rounded-lg bg-zinc-950 border border-white/10 text-white p-3 text-xs focus:outline-none focus:border-violet-500"
                      maxLength={160}
                      placeholder="Write a brief tagline about yourself..."
                    />
                    <div className="text-[10px] text-zinc-500 text-right">
                      {(profile?.bio || "").length}/160 characters
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Customizer Picker */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-violet-400" />
                    Select & Customize Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mode switcher tabs */}
                  <div className="flex gap-2 p-1 bg-zinc-950 rounded-lg border border-white/5 mb-6">
                    <button
                      type="button"
                      onClick={() => handleUpdateThemeSettings({ themeType: "preset" })}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        (profile?.themeSettings?.themeType || "preset") === "preset"
                          ? "bg-violet-600 text-white shadow-md"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Preset Themes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateThemeSettings({ themeType: "custom" })}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        (profile?.themeSettings?.themeType || "preset") === "custom"
                          ? "bg-violet-600 text-white shadow-md"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Custom Designer (Pro)
                    </button>
                  </div>

                  {(profile?.themeSettings?.themeType || "preset") === "preset" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleUpdateProfile({ theme: theme.id as any })}
                          className={`rounded-xl border text-left p-4 transition-all overflow-hidden relative group cursor-pointer ${
                            profile?.theme === theme.id
                              ? "border-violet-500 ring-2 ring-violet-500/20 bg-zinc-900"
                              : "border-white/5 bg-zinc-950/40 hover:bg-zinc-900"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-sm text-white">{theme.name}</span>
                            {profile?.theme === theme.id && (
                              <CheckCircle className="w-4 h-4 text-violet-500 fill-violet-500/25" />
                            )}
                          </div>

                          {/* Visual mini-preview inside layout picker */}
                          <div className={`w-full h-16 rounded-lg ${theme.bg} p-2 flex flex-col gap-1 items-center justify-center`}>
                            <div className="w-1/2 h-2.5 rounded-full bg-white/20 blur-[1px] mb-1" />
                            <div className={`w-3/4 h-3 rounded ${theme.cardBg} flex items-center px-1`}>
                              <div className="w-2 h-2 rounded-full bg-white/30 mr-1" />
                              <div className="w-8 h-1 rounded-full bg-white/20" />
                            </div>
                          </div>

                          <p className="text-[10px] text-zinc-400 mt-2">{theme.desc}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* 1. Background Config */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-extrabold text-violet-400 uppercase tracking-wider">1. Background Styling</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[10px] text-zinc-400">Background Mode</Label>
                            <div className="flex gap-2 mt-1">
                              {["solid", "gradient", "image"].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => handleUpdateThemeSettings({ backgroundType: type as any })}
                                  className={`flex-1 py-1.5 border rounded-lg text-xs capitalize cursor-pointer ${
                                    (profile?.themeSettings?.backgroundType || "gradient") === type
                                      ? "border-violet-500 bg-violet-500/10 text-white"
                                      : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          {(profile?.themeSettings?.backgroundType || "gradient") === "solid" ? (
                            <div>
                              <Label className="text-[10px] text-zinc-400">Solid Hex Color</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <input
                                  type="color"
                                  value={profile?.themeSettings?.backgroundColor || "#09090b"}
                                  onChange={(e) => handleLocalThemeSettingsChange({ backgroundColor: e.target.value })}
                                  onBlur={(e) => handleUpdateThemeSettings({ backgroundColor: (e.target as HTMLInputElement).value })}
                                  className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                                />
                                <Input
                                  type="text"
                                  value={profile?.themeSettings?.backgroundColor || "#09090b"}
                                  onChange={(e) => handleLocalThemeSettingsChange({ backgroundColor: e.target.value })}
                                  onBlur={(e) => handleUpdateThemeSettings({ backgroundColor: e.target.value })}
                                  className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                                />
                              </div>
                            </div>
                          ) : (profile?.themeSettings?.backgroundType || "gradient") === "image" ? (
                            <div className="col-span-1">
                              <div className="flex justify-between items-center h-5">
                                <Label className="text-[10px] text-zinc-400">Image Resource Option</Label>
                                <div className="flex bg-zinc-950 border border-white/10 rounded p-0.5 scale-90">
                                  <button
                                    type="button"
                                    onClick={() => setBgOption("upload")}
                                    className={`px-2 py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer ${
                                      bgOption === "upload"
                                        ? "bg-violet-600 text-white shadow"
                                        : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                  >
                                    Upload
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setBgOption("url")}
                                    className={`px-2 py-0.5 rounded text-[8px] font-bold transition-all cursor-pointer ${
                                      bgOption === "url"
                                        ? "bg-violet-600 text-white shadow"
                                        : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                                  >
                                    URL
                                  </button>
                                </div>
                              </div>

                              {bgOption === "url" ? (
                                <div className="space-y-1 mt-1.5">
                                  <Input
                                    id="backgroundImageUrl"
                                    placeholder="https://yourdomain.com/bg.jpg"
                                    value={profile?.themeSettings?.backgroundImageUrl || ""}
                                    onChange={(e) => handleLocalThemeSettingsChange({ backgroundImageUrl: e.target.value })}
                                    onBlur={() => handleUpdateThemeSettings({ backgroundImageUrl: profile?.themeSettings?.backgroundImageUrl })}
                                    className="bg-zinc-950 border-white/10 text-white text-[10px] h-8"
                                  />
                                  {profile?.themeSettings?.backgroundImageUrl && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleUpdateThemeSettings({ backgroundImageUrl: "" });
                                      }}
                                      className="text-[9px] text-red-400 hover:underline font-bold mt-0.5 block cursor-pointer text-left"
                                    >
                                      Clear Background Image URL
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-1 mt-1.5">
                                  <div
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleBgDrop}
                                    className={`border border-dashed rounded-lg p-2.5 text-center cursor-pointer relative bg-zinc-950/40 transition-all ${
                                      uploadingBg
                                        ? "border-violet-500 bg-violet-500/5 animate-pulse"
                                        : "border-white/10 hover:border-violet-500/50 hover:bg-zinc-950/80"
                                    }`}
                                    onClick={() => document.getElementById("bg-file-input")?.click()}
                                  >
                                    <input
                                      type="file"
                                      id="bg-file-input"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={handleBgUpload}
                                      disabled={uploadingBg}
                                    />
                                    {uploadingBg ? (
                                      <div className="space-y-1 flex flex-col items-center justify-center py-0.5">
                                        <div className="w-3.5 h-3.5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                                        <span className="text-[8px] text-violet-400 font-bold">Uploading file...</span>
                                      </div>
                                    ) : profile?.themeSettings?.backgroundImageUrl ? (
                                      <div className="flex items-center justify-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={profile.themeSettings.backgroundImageUrl}
                                          alt="bg"
                                          className="w-6 h-6 rounded object-cover border border-white/15"
                                        />
                                        <div className="text-left">
                                          <span className="text-[8px] text-zinc-300 font-bold block truncate max-w-[100px]">
                                            {profile.themeSettings.backgroundImageUrl.split("/").pop()}
                                          </span>
                                          <span className="text-[7px] text-emerald-400 font-bold block">✓ Uploaded successfully</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-0.5 py-0.5">
                                        <span className="text-[9px] text-zinc-300 font-bold block">Click to upload or drag & drop</span>
                                        <span className="text-[7px] text-zinc-500 block">PNG, JPG, WEBP, GIF (Max 8MB)</span>
                                      </div>
                                    )}
                                  </div>
                                  {profile?.themeSettings?.backgroundImageUrl && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleUpdateThemeSettings({ backgroundImageUrl: "" });
                                      }}
                                      className="text-[9px] text-red-400 hover:underline font-bold block cursor-pointer text-left"
                                    >
                                      Remove Background Image
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-[10px] text-zinc-400">Gradient Start</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="color"
                                    value={profile?.themeSettings?.backgroundGradientStart || "#0f172a"}
                                    onChange={(e) => handleLocalThemeSettingsChange({ backgroundGradientStart: e.target.value })}
                                    onBlur={(e) => handleUpdateThemeSettings({ backgroundGradientStart: (e.target as HTMLInputElement).value })}
                                    className="w-6 h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                                  />
                                  <Input
                                    type="text"
                                    value={profile?.themeSettings?.backgroundGradientStart || "#0f172a"}
                                    onChange={(e) => handleLocalThemeSettingsChange({ backgroundGradientStart: e.target.value })}
                                    onBlur={(e) => handleUpdateThemeSettings({ backgroundGradientStart: e.target.value })}
                                    className="bg-zinc-950 border-white/10 text-[9px] h-7 px-1 text-white font-mono"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-[10px] text-zinc-400">Gradient End</Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="color"
                                    value={profile?.themeSettings?.backgroundGradientEnd || "#1e1b4b"}
                                    onChange={(e) => handleLocalThemeSettingsChange({ backgroundGradientEnd: e.target.value })}
                                    onBlur={(e) => handleUpdateThemeSettings({ backgroundGradientEnd: (e.target as HTMLInputElement).value })}
                                    className="w-6 h-6 rounded border border-white/10 cursor-pointer bg-transparent"
                                  />
                                  <Input
                                    type="text"
                                    value={profile?.themeSettings?.backgroundGradientEnd || "#1e1b4b"}
                                    onChange={(e) => handleLocalThemeSettingsChange({ backgroundGradientEnd: e.target.value })}
                                    onBlur={(e) => handleUpdateThemeSettings({ backgroundGradientEnd: e.target.value })}
                                    className="bg-zinc-950 border-white/10 text-[9px] h-7 px-1 text-white font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. Custom Typography */}
                      <div className="space-y-3 border-t border-white/5 pt-4">
                        <h4 className="text-[10px] font-extrabold text-violet-400 uppercase tracking-wider">2. Typography Fonts</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: "sans", name: "Outfit Sans", desc: "Inter / Outfit" },
                            { id: "serif", name: "Classic Lora", desc: "Playfair / Lora" },
                            { id: "mono", name: "Code Mono", desc: "Fira / JetBrains" },
                            { id: "display", name: "Bold Syne", desc: "Syne / Display" }
                          ].map((font) => (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => handleUpdateThemeSettings({ fontFamily: font.id as any })}
                              className={`p-2 border rounded-lg text-left transition-all cursor-pointer ${
                                (profile?.themeSettings?.fontFamily || "sans") === font.id
                                  ? "border-violet-500 bg-violet-500/10 text-white"
                                  : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                              }`}
                            >
                              <div className={`text-xs font-bold ${
                                font.id === "serif" ? "font-serif" : font.id === "mono" ? "font-mono" : font.id === "display" ? "font-black" : "font-sans"
                              }`}>{font.name}</div>
                              <div className="text-[8px] text-zinc-500 mt-0.5">{font.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. Card Configuration */}
                      <div className="space-y-4 border-t border-white/5 pt-4">
                        <h4 className="text-[10px] font-extrabold text-violet-400 uppercase tracking-wider">3. Card Styles & Corners</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[10px] text-zinc-400">Card Frame Aesthetics</Label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              {[
                                { id: "glassmorphic", name: "Glass Blur" },
                                { id: "flat", name: "Solid Dark" },
                                { id: "outline", name: "Thin Outline" },
                                { id: "neon", name: "Neon Border" }
                              ].map((style) => (
                                <button
                                  key={style.id}
                                  type="button"
                                  onClick={() => handleUpdateThemeSettings({ cardStyle: style.id as any })}
                                  className={`py-1.5 px-2 border rounded-lg text-xs capitalize cursor-pointer ${
                                    (profile?.themeSettings?.cardStyle || "glassmorphic") === style.id
                                      ? "border-violet-500 bg-violet-500/10 text-white"
                                      : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  {style.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-[10px] text-zinc-400">Corner Roundness</Label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              {[
                                { id: "rounded-none", name: "Sharp" },
                                { id: "rounded-xl", name: "Smooth" },
                                { id: "rounded-full", name: "Pill" }
                              ].map((round) => (
                                <button
                                  key={round.id}
                                  type="button"
                                  onClick={() => handleUpdateThemeSettings({ cardRoundness: round.id as any })}
                                  className={`py-1.5 px-2 border rounded-lg text-xs capitalize cursor-pointer ${
                                    (profile?.themeSettings?.cardRoundness || "rounded-xl") === round.id
                                      ? "border-violet-500 bg-violet-500/10 text-white"
                                      : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  {round.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Text, Accent & Button Colors */}
                      <div className="space-y-3 border-t border-white/5 pt-4">
                        <h4 className="text-[10px] font-extrabold text-violet-400 uppercase tracking-wider">4. Color Details</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-[10px] text-zinc-400">Text Color</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="color"
                                value={profile?.themeSettings?.textColor || "#ffffff"}
                                onChange={(e) => handleLocalThemeSettingsChange({ textColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ textColor: (e.target as HTMLInputElement).value })}
                                className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                              />
                              <Input
                                type="text"
                                value={profile?.themeSettings?.textColor || "#ffffff"}
                                onChange={(e) => handleLocalThemeSettingsChange({ textColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ textColor: e.target.value })}
                                className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-[10px] text-zinc-400">Accent Theme Highlight</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="color"
                                value={profile?.themeSettings?.accentColor || "#8b5cf6"}
                                onChange={(e) => handleLocalThemeSettingsChange({ accentColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ accentColor: (e.target as HTMLInputElement).value })}
                                className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                              />
                              <Input
                                type="text"
                                value={profile?.themeSettings?.accentColor || "#8b5cf6"}
                                onChange={(e) => handleLocalThemeSettingsChange({ accentColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ accentColor: e.target.value })}
                                className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-[10px] text-zinc-400">Button Background Color</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="color"
                                value={profile?.themeSettings?.buttonColor || "#1e1b4b"}
                                onChange={(e) => handleLocalThemeSettingsChange({ buttonColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ buttonColor: (e.target as HTMLInputElement).value })}
                                className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                              />
                              <Input
                                type="text"
                                placeholder="Theme Default"
                                value={profile?.themeSettings?.buttonColor || ""}
                                onChange={(e) => handleLocalThemeSettingsChange({ buttonColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ buttonColor: e.target.value })}
                                className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                              />
                            </div>
                            {profile?.themeSettings?.buttonColor && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateThemeSettings({ buttonColor: "" });
                                }}
                                className="text-[9px] text-red-400 hover:underline font-bold mt-1 block cursor-pointer text-left"
                              >
                                Reset to Default Card Style
                              </button>
                            )}
                          </div>

                          <div>
                            <Label className="text-[10px] text-zinc-400">Tab Selected Color</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="color"
                                value={profile?.themeSettings?.tabSelectedColor || "#8b5cf6"}
                                onChange={(e) => {
                                  handleLocalThemeSettingsChange({ tabSelectedColor: e.target.value });
                                  handleUpdateThemeSettings({ tabSelectedColor: e.target.value });
                                }}
                                className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                              />
                              <Input
                                type="text"
                                value={profile?.themeSettings?.tabSelectedColor || "#8b5cf6"}
                                onChange={(e) => handleLocalThemeSettingsChange({ tabSelectedColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ tabSelectedColor: e.target.value })}
                                className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-[10px] text-zinc-400">Tab Unselected Color</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="color"
                                value={profile?.themeSettings?.tabUnselectedColor || "#0d0d0d"}
                                onChange={(e) => {
                                  handleLocalThemeSettingsChange({ tabUnselectedColor: e.target.value });
                                  handleUpdateThemeSettings({ tabUnselectedColor: e.target.value });
                                }}
                                className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                              />
                              <Input
                                type="text"
                                value={profile?.themeSettings?.tabUnselectedColor || "#0d0d0d"}
                                onChange={(e) => handleLocalThemeSettingsChange({ tabUnselectedColor: e.target.value })}
                                onBlur={(e) => handleUpdateThemeSettings({ tabUnselectedColor: e.target.value })}
                                className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Handles Configuration */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-violet-400" />
                    Configure Social Networks
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-xs flex items-center gap-1.5">
                      <SocialIcons.twitter className="w-3.5 h-3.5 text-sky-400" />
                      Twitter Handle
                    </Label>
                    <Input
                      placeholder="e.g. username"
                      value={profile?.socials?.twitter || ""}
                      onChange={(e) =>
                        setProfile((p) =>
                          p ? { ...p, socials: { ...p.socials, twitter: e.target.value } } : null
                        )
                      }
                      onBlur={() => handleUpdateProfile({ socials: profile?.socials })}
                      className="bg-zinc-950 border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-xs flex items-center gap-1.5">
                      <SocialIcons.instagram className="w-3.5 h-3.5 text-pink-400" />
                      Instagram Handle
                    </Label>
                    <Input
                      placeholder="e.g. username"
                      value={profile?.socials?.instagram || ""}
                      onChange={(e) =>
                        setProfile((p) =>
                          p ? { ...p, socials: { ...p.socials, instagram: e.target.value } } : null
                        )
                      }
                      onBlur={() => handleUpdateProfile({ socials: profile?.socials })}
                      className="bg-zinc-950 border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-xs flex items-center gap-1.5">
                      <SocialIcons.github className="w-3.5 h-3.5 text-white" />
                      GitHub Handle
                    </Label>
                    <Input
                      placeholder="e.g. username"
                      value={profile?.socials?.github || ""}
                      onChange={(e) =>
                        setProfile((p) =>
                          p ? { ...p, socials: { ...p.socials, github: e.target.value } } : null
                        )
                      }
                      onBlur={() => handleUpdateProfile({ socials: profile?.socials })}
                      className="bg-zinc-950 border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-xs flex items-center gap-1.5">
                      <SocialIcons.youtube className="w-3.5 h-3.5 text-red-500" />
                      YouTube Channel slug
                    </Label>
                    <Input
                      placeholder="e.g. @channel"
                      value={profile?.socials?.youtube || ""}
                      onChange={(e) =>
                        setProfile((p) =>
                          p ? { ...p, socials: { ...p.socials, youtube: e.target.value } } : null
                        )
                      }
                      onBlur={() => handleUpdateProfile({ socials: profile?.socials })}
                      className="bg-zinc-950 border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-xs flex items-center gap-1.5">
                      <SocialIcons.linkedin className="w-3.5 h-3.5 text-blue-400" />
                      LinkedIn Profile path
                    </Label>
                    <Input
                      placeholder="e.g. in/fullname"
                      value={profile?.socials?.linkedin || ""}
                      onChange={(e) =>
                        setProfile((p) =>
                          p ? { ...p, socials: { ...p.socials, linkedin: e.target.value } } : null
                        )
                      }
                      onBlur={() => handleUpdateProfile({ socials: profile?.socials })}
                      className="bg-zinc-950 border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-xs flex items-center gap-1.5">
                      <SocialIcons.tiktok className="w-3.5 h-3.5 text-white" />
                      TikTok Username
                    </Label>
                    <Input
                      placeholder="e.g. @username"
                      value={profile?.socials?.tiktok || ""}
                      onChange={(e) =>
                        setProfile((p) =>
                          p ? { ...p, socials: { ...p.socials, tiktok: e.target.value } } : null
                        )
                      }
                      onBlur={() => handleUpdateProfile({ socials: profile?.socials })}
                      className="bg-zinc-950 border-white/10 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-300 text-xs flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-violet-400" />
                      Contact Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="hello@domain.com"
                      value={profile?.socials?.email || ""}
                      onChange={(e) =>
                        setProfile((p) =>
                          p ? { ...p, socials: { ...p.socials, email: e.target.value } } : null
                        )
                      }
                      onBlur={() => handleUpdateProfile({ socials: profile?.socials })}
                      className="bg-zinc-950 border-white/10 text-white text-xs"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Widget Appearance Controls */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                    Widget Appearance
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400">
                    Customize the styling of your modular widgets. These settings are independent from the global Card Styles & Corners.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[10px] text-zinc-400">Widget Card Style</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {[
                          { id: "glassmorphic", name: "Glass Blur" },
                          { id: "flat", name: "Solid Dark" },
                          { id: "outline", name: "Thin Outline" },
                          { id: "neon", name: "Neon Border" }
                        ].map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => handleUpdateThemeSettings({ widgetCardStyle: style.id as any })}
                            className={`py-1.5 px-2 border rounded-lg text-xs capitalize cursor-pointer ${
                              profile?.themeSettings?.widgetCardStyle === style.id
                                ? "border-violet-500 bg-violet-500/10 text-white"
                                : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] text-zinc-400">Widget Corner Roundness</Label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {[
                          { id: "rounded-none", name: "Sharp" },
                          { id: "rounded-xl", name: "Smooth" },
                          { id: "rounded-full", name: "Pill" }
                        ].map((round) => (
                          <button
                            key={round.id}
                            type="button"
                            onClick={() => handleUpdateThemeSettings({ widgetCardRoundness: round.id as any })}
                            className={`py-1.5 px-2 border rounded-lg text-xs capitalize cursor-pointer ${
                              profile?.themeSettings?.widgetCardRoundness === round.id
                                ? "border-violet-500 bg-violet-500/10 text-white"
                                : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {round.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-[10px] text-zinc-400">Widget Accent Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={profile?.themeSettings?.widgetAccentColor || "#8b5cf6"}
                          onChange={(e) => handleLocalThemeSettingsChange({ widgetAccentColor: e.target.value })}
                          onBlur={(e) => handleUpdateThemeSettings({ widgetAccentColor: (e.target as HTMLInputElement).value })}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <Input
                          type="text"
                          value={profile?.themeSettings?.widgetAccentColor || ""}
                          onChange={(e) => handleLocalThemeSettingsChange({ widgetAccentColor: e.target.value })}
                          onBlur={(e) => handleUpdateThemeSettings({ widgetAccentColor: e.target.value })}
                          placeholder="#8b5cf6"
                          className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] text-zinc-400">Widget Text Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={profile?.themeSettings?.widgetTextColor || "#ffffff"}
                          onChange={(e) => handleLocalThemeSettingsChange({ widgetTextColor: e.target.value })}
                          onBlur={(e) => handleUpdateThemeSettings({ widgetTextColor: (e.target as HTMLInputElement).value })}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <Input
                          type="text"
                          value={profile?.themeSettings?.widgetTextColor || ""}
                          onChange={(e) => handleLocalThemeSettingsChange({ widgetTextColor: e.target.value })}
                          onBlur={(e) => handleUpdateThemeSettings({ widgetTextColor: e.target.value })}
                          placeholder="#ffffff"
                          className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-[10px] text-zinc-400">Widget Button Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={profile?.themeSettings?.widgetButtonColor || "#8b5cf6"}
                          onChange={(e) => handleLocalThemeSettingsChange({ widgetButtonColor: e.target.value })}
                          onBlur={(e) => handleUpdateThemeSettings({ widgetButtonColor: (e.target as HTMLInputElement).value })}
                          className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                        />
                        <Input
                          type="text"
                          value={profile?.themeSettings?.widgetButtonColor || ""}
                          onChange={(e) => handleLocalThemeSettingsChange({ widgetButtonColor: e.target.value })}
                          onBlur={(e) => handleUpdateThemeSettings({ widgetButtonColor: e.target.value })}
                          placeholder="#8b5cf6"
                          className="bg-zinc-950 border-white/10 text-xs h-8 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Widget Live Preview */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-violet-400" />
                    Widget Live Preview
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400">
                    See how your widgets will appear with current settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-zinc-950/50 rounded-lg border border-white/10">
                    <div
                      className={`p-6 border text-left shadow-lg relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${
                        profile?.themeSettings?.widgetCardRoundness || "rounded-xl"
                      } ${
                        (profile?.themeSettings?.widgetCardStyle || "glassmorphic") === "glassmorphic"
                          ? "bg-white/5 border-white/10"
                          : (profile?.themeSettings?.widgetCardStyle || "glassmorphic") === "flat"
                          ? "bg-zinc-900 border-zinc-800"
                          : (profile?.themeSettings?.widgetCardStyle || "glassmorphic") === "outline"
                          ? "bg-transparent border-white/20"
                          : "bg-black/90 border"
                      }`}
                      style={{
                        borderColor:
                          (profile?.themeSettings?.widgetCardStyle || "glassmorphic") === "neon"
                            ? profile?.themeSettings?.widgetAccentColor || "#8b5cf6"
                            : undefined,
                        color: profile?.themeSettings?.widgetTextColor || "#ffffff",
                      }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-xl rounded-full" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-violet-500/20 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-violet-400" />
                          </div>
                          <h3 className="text-sm font-bold">Sample Widget</h3>
                        </div>
                        <p className="text-xs opacity-70">This is how your widgets will look with the current appearance settings.</p>
                        <button
                          className="px-4 py-2 rounded-md text-xs font-bold text-white transition-all"
                          style={{
                            backgroundColor: profile?.themeSettings?.widgetButtonColor || "#8b5cf6",
                          }}
                        >
                          Sample Button
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Niche Widget Configuration Panel */}
              {profile?.type && profile.type !== "default" && (
                <Card className="border-white/10 bg-white/5 backdrop-blur-md relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-md font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-400" />
                      Configure Professional Niche Widget ({profile.type.toUpperCase()})
                    </CardTitle>
                    <CardDescription className="text-xs text-zinc-400">
                      Customize the dynamic widget displayed on your bio link page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.type === "author" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Featured Book Title</Label>
                          <Input
                            placeholder="e.g. The Offcut Legacy: Book 1"
                            value={profile.nicheSettings?.authorBookTitle || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, authorBookTitle: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Amazon Buy URL</Label>
                          <Input
                            placeholder="e.g. https://amazon.com/..."
                            value={profile.nicheSettings?.authorAmazonUrl || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, authorAmazonUrl: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-zinc-300 text-xs">Book Description</Label>
                          <textarea
                            placeholder="Enter short book teaser description..."
                            value={profile.nicheSettings?.authorBookDesc || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, authorBookDesc: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="w-full h-20 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs p-3 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Cover Spine Title</Label>
                          <Input
                            placeholder="e.g. The Offcut Legacy"
                            value={profile.nicheSettings?.authorCoverTitle || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, authorCoverTitle: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Cover Spine Author</Label>
                          <Input
                            placeholder="e.g. by Kathleen"
                            value={profile.nicheSettings?.authorCoverAuthor || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, authorCoverAuthor: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {profile.type === "musician" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Spotify Embed / Artist Link</Label>
                          <Input
                            placeholder="e.g. https://spotify.com/..."
                            value={profile.nicheSettings?.musicianSpotifyUrl || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, musicianSpotifyUrl: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="border-t border-white/5 pt-3">
                          <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-2">Concert Tour Date 1</span>
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              placeholder="Date (e.g. JUN 12)"
                              value={profile.nicheSettings?.musicianTour1Date || ""}
                              onChange={(e) =>
                                setProfile((p) =>
                                  p ? { ...p, nicheSettings: { ...p.nicheSettings, musicianTour1Date: e.target.value } } : null
                                )
                              }
                              onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                              className="bg-zinc-950 border-white/10 text-white text-xs"
                            />
                            <Input
                              placeholder="City (e.g. New York, NY)"
                              value={profile.nicheSettings?.musicianTour1City || ""}
                              onChange={(e) =>
                                setProfile((p) =>
                                  p ? { ...p, nicheSettings: { ...p.nicheSettings, musicianTour1City: e.target.value } } : null
                                )
                              }
                              onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                              className="bg-zinc-950 border-white/10 text-white text-xs"
                            />
                            <Input
                              placeholder="Venue (e.g. Madison Sq)"
                              value={profile.nicheSettings?.musicianTour1Venue || ""}
                              onChange={(e) =>
                                setProfile((p) =>
                                  p ? { ...p, nicheSettings: { ...p.nicheSettings, musicianTour1Venue: e.target.value } } : null
                                )
                              }
                              onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                              className="bg-zinc-950 border-white/10 text-white text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.type === "coach" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-zinc-300 text-xs">Featured Success Story / Testimonial</Label>
                          <textarea
                            placeholder="Enter a client success testimonial..."
                            value={profile.nicheSettings?.coachSuccessStory || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, coachSuccessStory: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="w-full h-16 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs p-3 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Testimonial Author</Label>
                          <Input
                            placeholder="e.g. Kathleen H."
                            value={profile.nicheSettings?.coachSuccessAuthor || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, coachSuccessAuthor: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">First Available Slot Time</Label>
                          <Input
                            placeholder="e.g. 9:00 AM"
                            value={profile.nicheSettings?.coachSlot1 || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, coachSlot1: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {profile.type === "realtor" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Featured Property Address</Label>
                          <Input
                            placeholder="e.g. 742 Evergreen Terrace"
                            value={profile.nicheSettings?.realtorAddress || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, realtorAddress: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Home Listing Price ($)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 450000"
                            value={profile.nicheSettings?.realtorPrice || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, realtorPrice: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Specs details</Label>
                          <Input
                            placeholder="e.g. 4 Bed • 3 Bath • 2,400 Sq Ft"
                            value={profile.nicheSettings?.realtorDetails || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, realtorDetails: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-zinc-300 text-xs">Listing Short Description</Label>
                          <textarea
                            placeholder="Enter short Zillow description..."
                            value={profile.nicheSettings?.realtorDescription || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, realtorDescription: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="w-full h-16 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs p-3 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>
                    )}

                    {profile.type === "nonprofit" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Campaign Title</Label>
                          <Input
                            placeholder="e.g. Clean Ocean Water Initiative"
                            value={profile.nicheSettings?.nonprofitTitle || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, nonprofitTitle: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Campaign Goal Target Amount ($)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 10000"
                            value={profile.nicheSettings?.nonprofitGoalAmount || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, nonprofitGoalAmount: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-zinc-300 text-xs">Campaign Description</Label>
                          <textarea
                            placeholder="Enter campaign message..."
                            value={profile.nicheSettings?.nonprofitDesc || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, nonprofitDesc: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="w-full h-16 rounded-lg bg-zinc-950 border border-white/10 text-white text-xs p-3 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>
                    )}

                    {profile.type === "gamer" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Twitch / Live Stream Title</Label>
                          <Input
                            placeholder="e.g. Kathleen Plays: Cyberpunk 2077"
                            value={profile.nicheSettings?.gamerStreamTitle || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, gamerStreamTitle: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Graphics GPU Card</Label>
                          <Input
                            placeholder="e.g. NVIDIA RTX 4090"
                            value={profile.nicheSettings?.gamerGpu || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, gamerGpu: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Processor CPU</Label>
                          <Input
                            placeholder="e.g. AMD Ryzen 9 7950X"
                            value={profile.nicheSettings?.gamerCpu || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, gamerCpu: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {profile.type === "influencer" && (
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-[10px]">Follower Count</Label>
                          <Input
                            placeholder="e.g. 124K"
                            value={profile.nicheSettings?.influencerFollowers || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, influencerFollowers: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-[10px]">Total Monthly Reach</Label>
                          <Input
                            placeholder="e.g. 850K"
                            value={profile.nicheSettings?.influencerReach || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, influencerReach: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-[10px]">Engagement Rate</Label>
                          <Input
                            placeholder="e.g. 6.2%"
                            value={profile.nicheSettings?.influencerEngagement || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, influencerEngagement: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {profile.type === "artist" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Featured Artwork Title</Label>
                          <Input
                            placeholder="e.g. Obsidian Echoes"
                            value={profile.nicheSettings?.artistArtTitle1 || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, artistArtTitle1: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Art Medium Tech</Label>
                          <Input
                            placeholder="e.g. Acrylic on Canvas"
                            value={profile.nicheSettings?.artistArtTech1 || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, artistArtTech1: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {profile.type === "photographer" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Base Hourly Session Rate ($)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 150"
                            value={profile.nicheSettings?.photographerHourlyRate || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, photographerHourlyRate: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-zinc-300 text-xs">Backdrop & Lighting Studio Fee ($)</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 75"
                            value={profile.nicheSettings?.photographerStudioFee || ""}
                            onChange={(e) =>
                              setProfile((p) =>
                                p ? { ...p, nicheSettings: { ...p.nicheSettings, photographerStudioFee: e.target.value } } : null
                              )
                            }
                            onBlur={() => handleUpdateProfile({ nicheSettings: profile.nicheSettings })}
                            className="bg-zinc-950 border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* TAB 3: VISITOR ANALYTICS DASHBOARD */}
            <TabsContent value="analytics" className="space-y-6 outline-none">
              {analytics ? (
                <div className="space-y-6">
                  {/* Performance stats row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white/5 border-white/10 p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Eye className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Page Views</div>
                        <div className="text-2xl font-black text-white mt-0.5">{analytics.overview.views}</div>
                      </div>
                    </Card>

                    <Card className="bg-white/5 border-white/10 p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                        <MousePointerClick className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Link Clicks</div>
                        <div className="text-2xl font-black text-white mt-0.5">{analytics.overview.clicks}</div>
                      </div>
                    </Card>

                    <Card className="bg-white/5 border-white/10 p-5 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Average CTR</div>
                        <div className="text-2xl font-black text-white mt-0.5">{analytics.overview.ctr}%</div>
                      </div>
                    </Card>
                  </div>

                  {/* Daily Trend Line Chart */}
                  <Card className="border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Traffic Performance (Last 7 Days)</h3>
                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                          <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                          <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                            labelStyle={{ color: "#fff", fontWeight: "bold" }}
                          />
                          <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2.5} name="Views" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={2.5} name="Clicks" dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Device and Browser Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Device Pie Chart */}
                    <Card className="border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-zinc-300 mb-4 flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-sky-400" />
                        Device Breakdowns
                      </h4>
                      <div className="h-44 w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.devices}
                              cx="50%"
                              cy="50%"
                              innerRadius={35}
                              outerRadius={55}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {analytics.devices.map((entry: any, index: number) => {
                                const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                              })}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col gap-1 text-[10px] text-zinc-400 px-2">
                        {analytics.devices.map((entry: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="capitalize">{entry.name}</span>
                            <span className="font-bold text-white">{entry.value} events</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Referrer Bar Chart */}
                    <Card className="border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-zinc-300 mb-4 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-emerald-400" />
                        Top Traffic Channels
                      </h4>
                      <div className="h-44 w-full relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analytics.referrers} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                            <XAxis type="number" stroke="#71717a" fontSize={8} hide />
                            <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={9} tickLine={false} width={70} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[9px] text-zinc-500 text-center italic">Top referrers logging click actions</p>
                    </Card>

                    {/* Browser breakdown list */}
                    <Card className="border-white/10 bg-white/5 p-4">
                      <h4 className="text-xs font-bold text-zinc-300 mb-4 flex items-center gap-1.5">
                        <Laptop className="w-4 h-4 text-violet-400" />
                        Browser Engine logs
                      </h4>
                      <div className="space-y-3 mt-2 h-44 overflow-y-auto pr-1">
                        {analytics.browsers.map((b: any, idx: number) => {
                          const total = analytics.browsers.reduce((acc: number, cur: any) => acc + cur.value, 0);
                          const percentage = total > 0 ? ((b.value / total) * 100).toFixed(0) : 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-semibold text-zinc-300">{b.name}</span>
                                <span className="text-zinc-400 font-bold">{percentage}% ({b.value})</span>
                              </div>
                              <div className="w-full bg-zinc-900 border border-white/5 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-violet-600 h-full rounded-full" style={{ width: `${percentage}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>

                  {/* Top Clicks Links Table */}
                  <Card className="border-white/10 bg-white/5 p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Link Card Clicks Rankings</h3>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-zinc-400 font-semibold pb-2">
                            <th className="pb-3 pr-4">Link Title</th>
                            <th className="pb-3 pr-4 hidden sm:table-cell">URL</th>
                            <th className="pb-3 text-right">Clicks Captured</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-zinc-300">
                          {analytics.links.map((link: any) => (
                            <tr key={link._id}>
                              <td className="py-3 font-semibold text-white flex items-center gap-2 truncate max-w-[180px]">
                                <span>{link.icon || "✨"}</span>
                                <span>{link.title}</span>
                              </td>
                              <td className="py-3 text-zinc-500 font-medium truncate max-w-xs hidden sm:table-cell">{link.url}</td>
                              <td className="py-3 text-right font-black text-violet-400">{link.clicksCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Marketing Attribution Section (NEW!) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Search Keywords Card */}
                    <Card className="border-white/10 bg-white/5 p-5">
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Top Search Keywords (SEO Attribution)
                      </h3>
                      {analytics.keywords && analytics.keywords.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-zinc-400 font-semibold pb-2">
                                <th className="pb-3">Keyword Query</th>
                                <th className="pb-3 text-right">Referral Count</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-zinc-300">
                              {analytics.keywords.map((kw: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="py-2.5 font-semibold text-white">
                                    <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded text-[10px] mr-2">
                                      #{idx + 1}
                                    </span>
                                    {kw.keyword}
                                  </td>
                                  <td className="py-2.5 text-right font-black text-amber-400">{kw.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-10 text-center text-zinc-500 text-xs italic">
                          No search keywords recorded yet. Visitors arriving from organic search will register queries here.
                        </div>
                      )}
                    </Card>

                    {/* Top UTM Campaigns Card */}
                    <Card className="border-white/10 bg-white/5 p-5">
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-violet-400" />
                        UTM Marketing Campaigns
                      </h3>
                      {analytics.utmCampaigns && analytics.utmCampaigns.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-zinc-400 font-semibold pb-2">
                                <th className="pb-3">Campaign / Source / Medium</th>
                                <th className="pb-3 text-right">Attributed Clicks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-zinc-300">
                              {analytics.utmCampaigns.map((utm: any, idx: number) => (
                                <tr key={idx}>
                                  <td className="py-2.5 font-medium text-white">
                                    <div className="font-bold text-zinc-200">{utm.campaign}</div>
                                    <div className="text-[10px] text-zinc-500 mt-0.5">
                                      {utm.source || "organic"} / {utm.medium || "referral"}
                                    </div>
                                  </td>
                                  <td className="py-2.5 text-right font-black text-violet-400">{utm.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="py-10 text-center text-zinc-500 text-xs italic">
                          No active UTM marketing campaigns tracked. Add UTM query strings (?utm_campaign=winter_sale) to your profile links to track conversion performance.
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center border border-white/10 rounded-xl bg-white/5">
                  <BarChart3 className="w-10 h-10 text-zinc-600 mx-auto mb-3 animate-pulse" />
                  <p className="text-sm text-zinc-400 font-medium">Gathering analytics logs...</p>
                  <p className="text-xs text-zinc-500 mt-1">Analytics populate instantly as visitors click your active cards!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Phone View Mockup Sidebar */}
        <div className="lg:col-span-4 sticky top-24 hidden lg:flex flex-col items-center">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Live Preview
          </div>

          {/* Device Mock frame */}
          <div className="w-[280px] h-[560px] rounded-[36px] border-8 border-zinc-900 bg-zinc-950 shadow-2xl relative overflow-hidden flex flex-col">
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full z-20" />

            {/* Inner frame page */}
            <div className={`flex-1 flex flex-col p-4 pt-8 overflow-y-auto select-none ${previewBgClass} ${previewFontClass}`} style={previewBgStyle}>
              {/* Profile Card Header */}
              <div className="text-center flex flex-col items-center mb-6">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20 mb-3 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-violet-600 border border-white/20 mb-3 flex items-center justify-center font-bold text-white text-lg shadow-md">
                    {profile?.name ? profile.name.slice(0, 1).toUpperCase() : profile?.username.slice(0, 1).toUpperCase()}
                  </div>
                )}
                
                <h3 className={`font-extrabold text-sm ${previewTextClass}`} style={previewTextStyle}>
                  {profile?.name || `@${profile?.username}`}
                </h3>
                {profile?.bio && (
                  <p className="text-[10px] mt-1 opacity-80 max-w-[200px] line-clamp-3" style={previewTextStyle}>
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Social Icons list */}
              {profile?.socials && (
                <div className="flex flex-wrap gap-2 items-center justify-center mb-5 opacity-90" style={previewTextStyle}>
                  {profile.socials.twitter && <SocialIcons.twitter className="w-3.5 h-3.5" />}
                  {profile.socials.instagram && <SocialIcons.instagram className="w-3.5 h-3.5" />}
                  {profile.socials.github && <SocialIcons.github className="w-3.5 h-3.5" />}
                  {profile.socials.youtube && <SocialIcons.youtube className="w-3.5 h-3.5" />}
                  {profile.socials.linkedin && <SocialIcons.linkedin className="w-3.5 h-3.5" />}
                  {profile.socials.tiktok && <SocialIcons.tiktok className="w-3.5 h-3.5" />}
                  {profile.socials.email && <Mail className="w-3.5 h-3.5" />}
                </div>
              )}

              {/* Niche Specific Interactive Widget Preview */}
              {profile?.type && profile.type !== "default" && (
                <div className="w-full mb-4">
                  {(() => {
                    const presetColorMap: Record<string, string> = {
                      midnight: "#8b5cf6",
                      sunset: "#f59e0b",
                      cyberpunk: "#06b6d4",
                      emerald: "#10b981"
                    };
                    const calculatedAccentColor = isCustomTheme 
                      ? customSettings.accentColor 
                      : (presetColorMap[profile.theme || "midnight"] || "#8b5cf6");
                    return (
                      <NicheWidgets
                        type={profile.type}
                        accentColor={calculatedAccentColor}
                        textColor={isCustomTheme ? customSettings.textColor : "#ffffff"}
                        cardRoundness={isCustomTheme ? customSettings.cardRoundness : "rounded-xl"}
                        cardStyle={isCustomTheme ? customSettings.cardStyle : "glassmorphic"}
                        isCustomTheme={isCustomTheme}
                        nicheSettings={profile.nicheSettings}
                      />
                    );
                  })()}
                </div>
              )}

              {/* Category Tabs inside Phone Mockup */}
              {profile?.tabs && profile.tabs.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-3.5 pt-1 scrollbar-none justify-start w-full max-w-full no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTabFilter("All")}
                    className="px-2.5 py-1 rounded-full text-[9px] font-bold transition-all border whitespace-nowrap cursor-pointer"
                    style={{
                      backgroundColor: activePreviewTabFilter === "All" ? (profile?.themeSettings?.tabSelectedColor || profile?.themeSettings?.accentColor || "#8b5cf6") : (profile?.themeSettings?.tabUnselectedColor || "#0d0d0d"),
                      borderColor: activePreviewTabFilter === "All" ? (profile?.themeSettings?.tabSelectedColor || profile?.themeSettings?.accentColor || "#8b5cf6") : "rgba(255, 255, 255, 0.1)",
                      color: activePreviewTabFilter === "All" ? "#ffffff" : (profile?.themeSettings?.textColor || "#ffffff")
                    }}
                  >
                    All
                  </button>
                  {profile.tabs.map((tabName) => (
                    <button
                      key={tabName}
                      type="button"
                      onClick={() => setActivePreviewTabFilter(tabName)}
                      className="px-2.5 py-1 rounded-full text-[9px] font-bold transition-all border whitespace-nowrap cursor-pointer"
                      style={{
                        backgroundColor: activePreviewTabFilter === tabName ? (profile?.themeSettings?.tabSelectedColor || profile?.themeSettings?.accentColor || "#8b5cf6") : (profile?.themeSettings?.tabUnselectedColor || "#0d0d0d"),
                        borderColor: activePreviewTabFilter === tabName ? (profile?.themeSettings?.tabSelectedColor || profile?.themeSettings?.accentColor || "#8b5cf6") : "rgba(255, 255, 255, 0.1)",
                        color: activePreviewTabFilter === tabName ? "#ffffff" : (profile?.themeSettings?.textColor || "#ffffff")
                      }}
                    >
                      {tabName}
                    </button>
                  ))}
                </div>
              )}

              {/* Links/Widgets Toggle */}
              <div className="flex gap-2 mb-3 p-1 bg-zinc-900/50 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setActivePreviewContent("links")}
                  className={`flex-1 py-2 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    activePreviewContent === "links"
                      ? "text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: activePreviewContent === "links" ? (profile?.themeSettings?.accentColor || "#8b5cf6") : "transparent",
                  }}
                >
                  Links
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewContent("widgets")}
                  className={`flex-1 py-2 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    activePreviewContent === "widgets"
                      ? "text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: activePreviewContent === "widgets" ? (profile?.themeSettings?.accentColor || "#8b5cf6") : "transparent",
                  }}
                >
                  Widgets
                </button>
              </div>

              {/* Display Links or Widgets */}
              <div className="space-y-2.5 w-full flex-1 overflow-y-auto">
                {activePreviewContent === "links" ? (
                  <>
                    {links
                      .filter(l => l.isActive)
                      .filter(l => activePreviewTabFilter === "All" || l.tab === activePreviewTabFilter)
                      .map((link) => (
                        <div
                          key={link._id}
                          className={`${getPreviewCardStyle(link.isActive)} ${
                            link.animationStyle === "pulse"
                              ? "card-anim-pulse"
                              : link.animationStyle === "bounce"
                              ? "card-anim-bounce"
                              : link.animationStyle === "shine"
                              ? "card-anim-shine"
                              : ""
                          }`}
                          style={getPreviewCardInlineStyle()}
                        >
                          {link.icon && <span className="absolute left-4 text-sm">{link.icon}</span>}
                          <span className="truncate pr-4 pl-4">{link.title}</span>
                        </div>
                      ))}

                    {links
                      .filter(l => l.isActive)
                      .filter(l => activePreviewTabFilter === "All" || l.tab === activePreviewTabFilter)
                      .length === 0 && (
                      <div className="text-[10px] text-zinc-500 italic text-center p-6 bg-black/20 border border-white/5 rounded-xl">
                        No active link cards configured.
                      </div>
                    )}
                  </>
                ) : (
                  (() => {
                    const presetColorMap: Record<string, string> = {
                      midnight: "#8b5cf6",
                      sunset: "#f59e0b",
                      cyberpunk: "#06b6d4",
                      emerald: "#10b981"
                    };
                    
                    return (
                      <ModularWidgets
                        treeId={treeId || ""}
                        accentColor="#8b5cf6"
                        textColor="#ffffff"
                        cardRoundness="rounded-xl"
                        cardStyle="glassmorphic"
                        isCustomTheme={isCustomTheme}
                        widgetAccentColor={isCustomTheme ? customSettings.widgetAccentColor : undefined}
                        widgetTextColor={isCustomTheme ? customSettings.widgetTextColor : undefined}
                        widgetCardRoundness={isCustomTheme ? customSettings.widgetCardRoundness : undefined}
                        widgetCardStyle={isCustomTheme ? customSettings.widgetCardStyle : undefined}
                        widgetButtonColor={isCustomTheme ? customSettings.widgetButtonColor : undefined}
                      />
                    );
                  })()
                )}
              </div>

              {/* Brand Footer */}
              <div className="text-[8px] text-zinc-500 font-bold tracking-widest text-center mt-6 uppercase">
                powered by offcut
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-3 border-violet-600/30 border-t-violet-500 rounded-full animate-spin mb-3" />
        <p className="text-zinc-400 text-xs">Loading Editor Workspace...</p>
      </div>
    }>
      <AdminDashboard />
    </Suspense>
  );
}

// Recharts responsive container warning workaround:
import { Activity } from "lucide-react";
// Adding custom CSS types or properties for Recharts if needed
