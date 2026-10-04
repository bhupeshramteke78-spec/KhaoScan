import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, QrCode, ShieldCheck, Utensils } from "lucide-react";
import { CustomerAuthPanel } from "@/components/auth/customer-auth-panel";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { createClient } from "@/lib/supabase/server";

export default async function CustomerAuthPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const mode = getParam(params.mode) === "register" ? "register" : "login";
  const redirectTo = safeRedirect(getParam(params.returnTo));
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (auth.user) {
    redirect(redirectTo);
  }

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

      {/* Top Navbar */}
      <div className="relative z-20">
        <MarketingNav />
      </div>

      <section className="relative z-10 mx-auto grid min-h-[75vh] max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Link href="/restaurants/search" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition">
            <ArrowLeft className="h-4 w-4 text-orange-400" />
            <span>Explore restaurants</span>
          </Link>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-300">
            <span>KhaoScan for Diners</span>
          </div>
          <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-5xl">
            Your dining orders,{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              seamlessly connected.
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-zinc-400">
            Sign in to view real-time orders, track invoices & receipts, and enjoy frictionless contactless dining across all partner restaurants.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Feature icon={Utensils} title="Live Menu Access" desc="Instant contactless ordering" />
            <Feature icon={ShieldCheck} title="Direct UPI Payouts" desc="Verified safe payments" />
            <Feature icon={QrCode} title="Instant QR Dining" desc="Table-level checkout" />
          </div>
        </div>
        <CustomerAuthPanel initialMode={mode} redirectTo={redirectTo} />
      </section>
      <MarketingFooter />
    </main>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Utensils; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-sm font-bold text-white">{title}</p>
      <p className="mt-0.5 text-xs text-zinc-400">{desc}</p>
    </div>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function safeRedirect(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/restaurants/search";
}
