"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Link2,
  Users,
  Layers,
  BarChart3,
  Search,
  Edit2,
  Trash2,
  LogOut,
  Sparkles,
  Shield,
  Eye,
  MousePointerClick
} from "lucide-react";

interface UserItem {
  _id: string;
  username: string;
  name: string;
  bio: string;
  role: "admin" | "member";
  createdAt: string;
  treesCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrees: 0,
    totalViews: 0,
    totalClicks: 0
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Edit User modal state
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "member">("member");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch administrative data.");
      const data = await res.json();
      
      setUsers(data.users || []);
      setStats(data.stats || {
        totalUsers: 0,
        totalTrees: 0,
        totalViews: 0,
        totalClicks: 0
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditBio(user.bio || "");
    setEditRole(user.role);
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editUsername.trim()) {
      toast.error("Username handle is required.");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/users?id=${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editUsername.trim().toLowerCase(),
          name: editName.trim(),
          bio: editBio.trim(),
          role: editRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save edits");
      }

      toast.success("User profile updated successfully!");
      setEditingUser(null);
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to edit user");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (username === "admin") {
      toast.error("Security Override: You cannot delete the root 'admin' user account.");
      return;
    }

    if (!confirm(`CRITICAL WARNING: Are you sure you want to permanently delete user account "${username}"?\nThis deletes their profile, all their active linktrees, all their links, and all their analytics history.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete");
      }

      toast.success(`User "${username}" and all their properties successfully deleted.`);
      fetchAdminData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user account");
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

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
              Offcut Links Platform Admin
              <Shield className="w-3.5 h-3.5 text-violet-400" />
            </span>
            <span className="text-[10px] text-zinc-400">Global System Management</span>
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

      {/* Admin Panel Body */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Owner Controls
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">System Administration</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Monitor active users, manage registrations, and check platform performance metrics.
            </p>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-white/5 bg-zinc-900/30 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <div className="text-xs text-zinc-400">Registered Users</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-zinc-900/30 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalTrees}</div>
                <div className="text-xs text-zinc-400">Active Linktrees</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-zinc-900/30 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalViews}</div>
                <div className="text-xs text-zinc-400">Global Views</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-zinc-900/30 backdrop-blur-md">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalClicks}</div>
                <div className="text-xs text-zinc-400">Global Clicks</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Registry List */}
        <Card className="border-white/5 bg-zinc-900/20 backdrop-blur-xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white text-lg font-bold">User Registry</CardTitle>
                <CardDescription className="text-zinc-400">
                  Search, review details, change roles, or remove profiles.
                </CardDescription>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search by username or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-zinc-950 border-white/10 text-white text-sm"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-violet-600/30 border-t-violet-500 rounded-full animate-spin mb-3" />
                <p className="text-zinc-400 text-xs">Loading accounts...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No matching user accounts found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-zinc-400 font-medium">
                      <th className="py-3 px-4">Display Name</th>
                      <th className="py-3 px-4">Username Slug</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Linktrees</th>
                      <th className="py-3 px-4">Date Joined</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-white">{user.name}</td>
                        <td className="py-3 px-4 text-violet-400 font-mono">@{user.username}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              user.role === "admin"
                                ? "bg-violet-500/10 border-violet-500/30 text-violet-400"
                                : "bg-zinc-800 border-zinc-700 text-zinc-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-300 font-medium">{user.treesCount || 0} trees</td>
                        <td className="py-3 px-4 text-zinc-500 text-xs">
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </td>
                        <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(user)}
                            className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={user.username === "admin"}
                            onClick={() => handleDeleteUser(user._id, user.username)}
                            className="text-zinc-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-md border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-500" />
            <form onSubmit={handleSaveEditUser}>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-400" />
                  Edit User Profile Settings
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Update primary account parameters for user @{editingUser.username}.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username" className="text-zinc-300 text-sm font-medium">
                    Username Handle
                  </Label>
                  <Input
                    id="edit-username"
                    value={editUsername}
                    disabled={editingUser.username === "admin"}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="bg-zinc-950 border-white/10 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-zinc-300 text-sm font-medium">
                    Display Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-zinc-950 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-bio" className="text-zinc-300 text-sm font-medium">
                    Profile Bio
                  </Label>
                  <Input
                    id="edit-bio"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="bg-zinc-950 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300 text-sm font-medium">
                    Account Security Role
                  </Label>
                  <Select
                    value={editRole}
                    disabled={editingUser.username === "admin"}
                    onValueChange={(val) => { if (val) setEditRole(val as any); }}
                  >
                    <SelectTrigger className="bg-zinc-950 border-white/10 text-white">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="member">Member (Standard Creator)</SelectItem>
                      <SelectItem value="admin">Admin (Site Administrator)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingUser(null)}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingEdit}
                  className="bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
                >
                  {savingEdit ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
