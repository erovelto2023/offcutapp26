"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, UserPlus, Sparkles, UserCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Welcome! Profile created successfully.");
      router.push("/admin");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-zinc-950 via-slate-900 to-indigo-950">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md z-10 transition-all duration-300">
        {/* Title bar */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-medium mb-3 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            Claim Your Unique Handle
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Create your <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Offcut Links</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5">
            Set up your custom profile page in under 60 seconds.
          </p>
        </div>

        {/* Card containing credentials registration */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-emerald-500" />
          
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-400" />
                Sign Up
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Choose a username handle and a password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300 text-sm font-medium">
                  Username Slug
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-medium select-none text-sm">
                    offcut.li/
                  </span>
                  <Input
                    id="username"
                    placeholder="yourname"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="pl-[78px] bg-zinc-950/60 border-white/10 text-white placeholder-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20"
                    disabled={loading}
                    autoComplete="off"
                    required
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Only lowercase letters, numbers, and underscores are allowed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300 text-sm font-medium">
                  Secure Password
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-zinc-950/60 border-white/10 text-white placeholder-zinc-600 focus:border-violet-500/50 focus:ring-violet-500/20"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-lg hover:shadow-violet-600/20 transition-all duration-200 gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Create Page
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-zinc-400">
                Already registered?{" "}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 underline font-medium">
                  Login here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
