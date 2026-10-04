"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="relative z-10 pt-4 pb-16 lg:pt-8 lg:pb-24">

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-semibold text-orange-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>All-In-One Restaurant SaaS Platform</span>
          <span className="text-orange-400">⚡</span>
        </div>

        {/* 2-Column Asymmetric Grid */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          {/* Left Column: Bold Rhythmic Typography */}
          <div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
              Scan. Savor. <br />
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                Scale Your Restaurant.
              </span> <br />
              All in One Platform.
            </h1>
          </div>

          {/* Right Column: Description & Action Buttons */}
          <div className="lg:pl-6">
            <p className="text-base sm:text-lg leading-relaxed text-zinc-300 max-w-xl">
              KhaoScan helps restaurants digitize menus, automate table orders, and accept direct payments seamlessly — faster, smarter, and easier.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/auth/owner?mode=register">
                <Button 
                  size="lg" 
                  className="h-12 px-6 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-[1.02] transition-transform active:scale-[0.98]"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>

              <Link href="/restaurants/search">
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="h-12 px-6 rounded-full border-white/20 bg-white/[0.06] text-white font-semibold text-sm hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition"
                >
                  <Play className="h-4 w-4 fill-white text-white mr-1.5" />
                  Explore Demo Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

