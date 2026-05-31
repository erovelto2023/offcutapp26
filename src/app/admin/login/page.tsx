"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyRound, LogIn, ShieldCheck, Sparkles, User, AlertCircle } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          isAdminPortal: true, // Key flag enforcing strictly admin validation
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid username or password");
      }

      toast.success("Welcome, Site Administrator!");
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-zinc-950 w-full min-h-screen">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 transition-all duration-300">
        {/* Title bar */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-semibold mb-3 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            Security Gateway
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            System <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Administration</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1.5 font-medium tracking-wide uppercase">
            Authorized Personnel Only
          </p>
        </div>

        {/* Card containing login forms */}
        <Card className="border-violet-500/20 bg-zinc-900/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600" />
          
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-400" />
                Admin Secure Portal
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                Provide administrator credentials to gain access to system logs, users, and platform controls.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300 text-sm font-medium">
                  Admin Handle
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="pl-10 bg-zinc-950 border-white/5 text-white placeholder-zinc-700 focus:border-violet-500/50 focus:ring-violet-500/20"
                    disabled={loading}
                    autoComplete="off"
                    required
                  />
                </div>
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
                    className="pl-10 bg-zinc-950 border-white/5 text-white placeholder-zinc-700 focus:border-violet-500/50 focus:ring-violet-500/20"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 flex items-start gap-2.5 mt-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Notice: All login attempts are recorded and monitored. Unauthorized access is strictly prohibited and subject to system lockout.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-700 hover:bg-violet-600 text-white font-semibold shadow-lg hover:shadow-violet-700/20 transition-all duration-200 gap-2 cursor-pointer border border-violet-500/30"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating Gateway...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Access Dashboard
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 w-full min-h-screen">
        <div className="w-10 h-10 border-4 border-violet-600/30 border-t-violet-500 rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Deploying secure administrative gateway...</p>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
