"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Link2,
  Plus,
  Trash2,
  Globe,
  LogOut,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  BarChart3,
  Video,
  FileText
} from "lucide-react";

interface TreeItem {
  _id: string;
  slug: string;
  type: string;
  name: string;
  theme: string;
  createdAt: string;
  viewsCount?: number;
  clicksCount?: number;
}

export default function MembersDashboard() {
  const router = useRouter();
  const [trees, setTrees] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);

  // Form States (New Tree)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("default"); // 'default' | 'video' | 'portfolio'
  const [creatingTree, setCreatingTree] = useState(false);

  useEffect(() => {
    fetchTrees();
  }, []);

  const fetchTrees = async () => {
    try {
      const res = await fetch("/api/admin/trees");
      if (!res.ok) throw new Error("Failed to load profiles");
      const data = await res.json();

      if (data.migrated) {
        toast.success("Legacy profile migrated successfully to default tree!");
      }

      setTrees(data.trees || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug.trim()) {
      toast.error("Please enter a custom URL slug.");
      return;
    }

    const cleanSlug = newSlug.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (cleanSlug.length < 3) {
      toast.error("URL Slug must be at least 3 characters.");
      return;
    }

    setCreatingTree(true);
    try {
      const res = await fetch("/api/admin/trees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: cleanSlug,
          name: newName.trim() || cleanSlug,
          type: newType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create tree profile");
      }

      toast.success("Your new linktree profile is live!");
      setTrees((prev) => [...prev, data.tree]);
      setShowCreateModal(false);
      setNewSlug("");
      setNewName("");
      setNewType("default");
      
      // Redirect straight to customization editor
      router.push(`/members/editor?slug=${data.tree.slug}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create tree");
    } finally {
      setCreatingTree(false);
    }
  };

  const handleDeleteTree = async (id: string, slugName: string) => {
    if (!confirm(`WARNING: Are you sure you want to permanently delete offcutapp.com/${slugName}? All links and analytics will be destroyed.`)) return;

    try {
      const res = await fetch(`/api/admin/trees?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete");
      }

      setTrees((prev) => prev.filter((t) => t._id !== id));
      toast.success(`offcutapp.com/${slugName} successfully deleted.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete profile");
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 min-h-screen relative overflow-hidden">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-white tracking-tight">Offcut Links Workspace</span>
            <span className="text-[10px] text-zinc-400">Creator Account Management</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Main Workspace Contents */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Multiple Profiles Enabled
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Linktree Profiles</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Select a linktree to edit styling, custom buttons, or add new profiles.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg hover:shadow-violet-600/20 transition-all duration-200 gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Tree
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-violet-600/30 border-t-violet-500 rounded-full animate-spin mb-4" />
            <p className="text-zinc-400 text-sm">Loading your workspaces...</p>
          </div>
        ) : trees.length === 0 ? (
          <Card className="border-dashed border-white/10 bg-white/5 backdrop-blur-md text-center p-12">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-violet-400" />
              </div>
              <CardTitle className="text-white">No Linktrees yet</CardTitle>
              <CardDescription className="text-zinc-400 max-w-sm mx-auto">
                Launch your custom presence now! Create multiple separate profiles for your business or personal brands.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Launch First Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trees.map((tree) => (
              <Card
                key={tree._id}
                className="border-white/10 bg-zinc-900/40 hover:bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 relative overflow-hidden flex flex-col group hover:border-violet-500/35"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
                        {tree.name}
                        {(() => {
                          const typeLabelMap: Record<string, { label: string; bg: string; border: string; text: string; icon: string }> = {
                            default: { label: "Classic Linktree", bg: "bg-violet-500/15", border: "border-violet-500/25", text: "text-violet-400", icon: "🔗" },
                            author: { label: "Author Hub", bg: "bg-amber-500/15", border: "border-amber-500/25", text: "text-amber-400", icon: "📖" },
                            influencer: { label: "Influencer Media", bg: "bg-pink-500/15", border: "border-pink-500/25", text: "text-pink-400", icon: "✨" },
                            coach: { label: "Coach Call Kit", bg: "bg-cyan-500/15", border: "border-cyan-500/25", text: "text-cyan-400", icon: "📞" },
                            musician: { label: "Musician Press", bg: "bg-rose-500/15", border: "border-rose-500/25", text: "text-rose-400", icon: "🎵" },
                            realtor: { label: "Realtor Agency", bg: "bg-emerald-500/15", border: "border-emerald-500/25", text: "text-emerald-400", icon: "🏡" },
                            podcaster: { label: "Podcaster Engine", bg: "bg-amber-600/15", border: "border-amber-600/25", text: "text-amber-500", icon: "🎙️" },
                            youtuber: { label: "YouTube Stream", bg: "bg-red-500/15", border: "border-red-500/25", text: "text-red-400", icon: "📺" },
                            gamer: { label: "Gamer Live Hub", bg: "bg-purple-500/15", border: "border-purple-500/25", text: "text-purple-400", icon: "🎮" },
                            artist: { label: "Artist Gallery", bg: "bg-teal-500/15", border: "border-teal-500/25", text: "text-teal-400", icon: "🎨" },
                            photographer: { label: "Photographer Booking", bg: "bg-emerald-600/15", border: "border-emerald-600/25", text: "text-emerald-400", icon: "📷" },
                            speaker: { label: "Speaker Topic Book", bg: "bg-indigo-500/15", border: "border-indigo-500/25", text: "text-indigo-400", icon: "🎙️" },
                            teacher: { label: "Educator Syllabus", bg: "bg-red-600/15", border: "border-red-600/25", text: "text-red-400", icon: "🍎" },
                            smallbusiness: { label: "Small Business Store", bg: "bg-blue-500/15", border: "border-blue-500/25", text: "text-blue-400", icon: "💼" }
                          };
                          const conf = typeLabelMap[tree.type] || typeLabelMap.default;
                          return (
                            <span className={`px-2 py-0.5 rounded text-[10px] ${conf.bg} border ${conf.border} ${conf.text} font-normal flex items-center gap-1`}>
                              <span className="text-[9px]">{conf.icon}</span> {conf.label}
                            </span>
                          );
                        })()}
                      </CardTitle>
                      <CardDescription className="text-zinc-400 mt-1 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-zinc-500" />
                        offcutapp.com/<span className="text-violet-400 font-medium">{tree.slug}</span>
                      </CardDescription>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTree(tree._id, tree.slug)}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 pb-4">
                  <div className="grid grid-cols-2 gap-4 bg-zinc-950/40 border border-white/5 rounded-lg p-3 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-white font-bold text-sm">{tree.viewsCount || 0}</div>
                        <div>Page Views</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-violet-400" />
                      <div>
                        <div className="text-white font-bold text-sm">{tree.clicksCount || 0}</div>
                        <div>Clicks</div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 border-t border-white/5 flex gap-3">
                  <a
                    href={`/${tree.slug}`}
                    target="_blank"
                    className="flex-1 py-2 px-3 text-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                    Visit Live
                  </a>

                  <Link
                    href={`/members/editor?slug=${tree.slug}`}
                    className="flex-1 py-2 px-3 text-center rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    Customize
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sleek Create Tree Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-white/10 bg-zinc-900/90 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-500" />
            <form onSubmit={handleCreateTree}>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-violet-400" />
                  Launch New Linktree
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Choose a beautiful display name and a unique slug.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-zinc-300 text-sm font-medium">
                    Profile URL Slug
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-semibold select-none">
                      offcutapp.com/
                    </span>
                    <Input
                      id="slug"
                      placeholder="e.g. kbusiness"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      className="pl-16 bg-zinc-950/60 border-white/10 text-white placeholder-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300 text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Kathleen's Business"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-zinc-950/60 border-white/10 text-white placeholder-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300 text-sm font-medium">
                    Select Your Professional Niche Template
                  </Label>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    We will automatically pre-configure specialized tabs, active widgets, and customized seed links.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto pr-1 select-none scrollbar-thin">
                    {[
                      { id: "default", name: "Standard Grid", desc: "Classic links bio list", icon: "🔗" },
                      { id: "author", name: "Author", desc: "Book promo & reviews", icon: "📖" },
                      { id: "influencer", name: "Influencer", desc: "Brand kit & media stats", icon: "✨" },
                      { id: "coach", name: "Coach / Consultant", desc: "Client calls scheduler", icon: "📞" },
                      { id: "musician", name: "Musician", desc: "Spotify stream & tour dates", icon: "🎵" },
                      { id: "realtor", name: "Real Estate Agent", desc: "Zillow listings & calculator", icon: "🏡" },
                      { id: "podcaster", name: "Podcaster", desc: "Episode player & community", icon: "🎙️" },
                      { id: "youtuber", name: "YouTuber", desc: "Video spotlight & gear", icon: "📺" },
                      { id: "gamer", name: "Gamer / Streamer", desc: "Twitch live & system specs", icon: "🎮" },
                      { id: "artist", name: "Creative Artist", desc: "Art portfolio & shop", icon: "🎨" },
                      { id: "photographer", name: "Photographer", desc: "Session fee estimator", icon: "📷" },
                      { id: "speaker", name: "Professional Speaker", desc: "Topic sheet & bookings", icon: "🎙️" },
                      { id: "teacher", name: "Teacher / Educator", desc: "Class downloads portal", icon: "🍎" },
                      { id: "smallbusiness", name: "Small Business", desc: "Service schedules & FAQs", icon: "💼" }
                    ].map((style) => (
                      <div
                        key={style.id}
                        onClick={() => setNewType(style.id)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between select-none ${
                          newType === style.id
                            ? "bg-violet-500/10 border-violet-500 text-white"
                            : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm shrink-0">{style.icon}</span>
                          <span className="font-bold text-[11px] truncate">{style.name}</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 leading-tight mt-1 truncate">{style.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creatingTree}
                  className="bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
                >
                  {creatingTree ? "Launching..." : "Launch Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
