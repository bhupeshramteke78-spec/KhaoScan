"use client";

import { Loader2, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

export function CustomerAuthPanel({
  initialMode,
  redirectTo,
}: {
  initialMode: AuthMode;
  redirectTo: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        const registration = await fetch("/api/auth/register-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, phone, email, password, redirectTo }),
        });
        const registrationBody = (await registration.json().catch(() => null)) as {
          error?: string;
          requiresEmailConfirmation?: boolean;
        } | null;

        if (!registration.ok) {
          toast.error(registrationBody?.error ?? "Unable to create your account.");
          return;
        }

        if (registrationBody?.requiresEmailConfirmation) {
          toast.success("Account created. Confirm the link sent to your email, then continue.");
          setMode("login");
          return;
        }
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success(mode === "register" ? "Account created" : "Welcome back");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to continue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a1822]/90 p-6 sm:p-8 text-white backdrop-blur-2xl shadow-2xl shadow-black/70">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-32 w-80 rounded-full bg-orange-500/20 blur-2xl" />

      <div className="relative flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
          {mode === "login" ? <LockKeyhole className="h-5 w-5" /> : <UserRound className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Customer Access</p>
          <h2 className="text-xl font-bold text-white">{mode === "login" ? "Sign In to KhaoScan" : "Create Diner Account"}</h2>
        </div>
      </div>
      <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
        Live food tracking, previous table receipts, and saved preferences are preserved across all visits.
      </p>

      {/* Mode Switch Tabs */}
      <div className="mt-6 flex rounded-2xl border border-white/10 bg-white/[0.05] p-1.5 backdrop-blur-md">
        {(["login", "register"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`flex-1 rounded-xl py-2 text-center text-xs sm:text-sm font-bold transition duration-200 cursor-pointer ${
              mode === item
                ? "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {item === "login" ? "Customer Login" : "Register New"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4">
        {mode === "register" ? (
          <>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Full Name</label>
              <Input
                required
                minLength={2}
                value={fullName}
                placeholder="Rohan Sharma"
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                className="h-11 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-semibold text-zinc-300">Mobile Number</label>
              <Input
                required
                type="tel"
                minLength={7}
                value={phone}
                placeholder="+91 98765 43210"
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                className="h-11 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </>
        ) : null}
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-zinc-300">Email Address</label>
          <Input
            required
            type="email"
            value={email}
            placeholder="rohan@example.com"
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="h-11 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-zinc-300">Password</label>
          <Input
            required
            type="password"
            minLength={8}
            value={password}
            placeholder="••••••••••••"
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="h-11 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition duration-150 cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {mode === "login" ? "Sign In and Continue" : "Create Account and Continue"}
        </Button>
      </form>
    </div>
  );
}
