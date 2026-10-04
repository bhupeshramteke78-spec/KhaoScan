"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword(values);

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-1.5">
        <label className="text-xs font-semibold text-zinc-300">Email Address</label>
        <Input
          type="email"
          placeholder="owner@restaurant.com"
          autoComplete="email"
          className="h-12 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          {...form.register("email")}
        />
        {form.formState.errors.email?.message ? (
          <span className="text-xs text-rose-400">{form.formState.errors.email.message}</span>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300">Password</label>
        </div>
        <Input
          type="password"
          placeholder="••••••••••••"
          autoComplete="current-password"
          className="h-12 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-white placeholder:text-zinc-500 focus:border-orange-400 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          {...form.register("password")}
        />
        {form.formState.errors.password?.message ? (
          <span className="text-xs text-rose-400">{form.formState.errors.password.message}</span>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-2 h-12 w-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] transition duration-150 cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Sign In to Owner Dashboard
      </Button>
    </form>
  );
}
