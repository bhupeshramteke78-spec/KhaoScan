import Link from "next/link";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { OwnerRegistrationForm } from "@/components/auth/owner-registration-form";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

type OwnerAuthMode = "login" | "register";

export default async function OwnerAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string | string[] }>;
}) {
  const mode = getOwnerAuthMode((await searchParams).mode);
  const isRegisterMode = mode === "register";

  return (
    <main className="relative min-h-screen bg-[#071117] text-white selection:bg-orange-500/30 flex flex-col justify-between overflow-x-hidden">
      {/* Top Radiant Sunset Horizon Glow */}
      <div 
        className="pointer-events-none absolute inset-x-0 -top-32 h-[750px] opacity-90"
        style={{
          background: "radial-gradient(ellipse 90% 65% at 50% -5%, rgba(249, 115, 22, 0.45), rgba(239, 68, 68, 0.25) 50%, rgba(7, 17, 23, 0) 90%)",
        }}
        aria-hidden="true"
      />
      <div 
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[850px] h-[350px] rounded-full blur-[110px] opacity-35 bg-gradient-to-b from-amber-400 via-orange-500 to-rose-600"
        aria-hidden="true"
      />
      <div 
        className="pointer-events-none absolute bottom-1/3 right-10 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 bg-orange-500"
        aria-hidden="true"
      />

      {/* Top Navbar */}
      <div className="relative z-20">
        <MarketingNav />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-300">
            <Building2 className="h-3.5 w-3.5 text-orange-400" />
            <span>Restaurant Owner Portal</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {isRegisterMode ? (
              <>
                Create your restaurant &{" "}
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  start 3-day trial
                </span>
              </>
            ) : (
              <>
                Welcome back to{" "}
                <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  KhaoScan
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            {isRegisterMode
              ? "Registration automatically configures your owner profile, restaurant, tables, live menu, and instant UPI checkout in one validated flow."
              : "Login to manage your live dining tables, incoming kitchen orders, waiter alerts, and daily revenue reports."}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mx-auto mt-8 flex w-full max-w-xs items-center rounded-2xl border border-white/10 bg-white/[0.05] p-1.5 backdrop-blur-md">
            <Link
              href="/auth/owner?mode=login"
              className={`flex-1 rounded-xl py-2.5 text-center text-xs sm:text-sm font-bold transition duration-200 ${
                mode === "login"
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Owner Login
            </Link>
            <Link
              href="/auth/owner?mode=register"
              className={`flex-1 rounded-xl py-2.5 text-center text-xs sm:text-sm font-bold transition duration-200 ${
                mode === "register"
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Register New
            </Link>
          </div>
        </div>

        {/* Card Form Container */}
        <div className="relative mx-auto mt-8 w-full max-w-2xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0a1822]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/70">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-32 w-80 rounded-full bg-orange-500/20 blur-2xl" />

          {isRegisterMode ? (
            <div className="relative">
              <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Register Restaurant</h2>
                  <p className="text-xs text-zinc-400">
                    Start your 3-day free trial with real QR ordering, table manager, and UPI settings.
                  </p>
                </div>
              </div>
              <OwnerRegistrationForm />
              <p className="mt-6 text-center text-xs sm:text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/auth/owner?mode=login" className="font-semibold text-orange-400 hover:text-orange-300 underline underline-offset-4 transition">
                  Login here
                </Link>
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Owner Portal Login</h2>
                  <p className="text-xs text-zinc-400">
                    Access your live kitchen screen, QR tables, floor waiters, and daily payouts.
                  </p>
                </div>
              </div>
              <LoginForm />
              <p className="mt-6 text-center text-xs sm:text-sm text-zinc-400">
                Don&apos;t have an account yet?{" "}
                <Link href="/auth/owner?mode=register" className="font-semibold text-orange-400 hover:text-orange-300 underline underline-offset-4 transition">
                  Create restaurant account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <MarketingFooter />
    </main>
  );
}

function getOwnerAuthMode(value: string | string[] | undefined): OwnerAuthMode {
  const mode = Array.isArray(value) ? value[0] : value;

  return mode === "register" ? "register" : "login";
}
