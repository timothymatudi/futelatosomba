"use client"

import { useState } from "react"
import { Search, Home, Building2, MapPin } from "lucide-react"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/kinshasa-hero.jpg)" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#007FFF]/70 via-[#0066CC]/65 to-[#004499]/70" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg">
          Find Your Dream Home in DRC
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg font-medium text-white/95 leading-relaxed drop-shadow-md sm:text-xl">
          The Leading Property Platform in Democratic Republic of Congo
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-lg bg-background shadow-2xl border-2 border-white/30">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none bg-transparent px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button className="bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90">
            <Search className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#FFD700] drop-shadow-md sm:text-4xl">
              500+
            </div>
            <div className="mt-1 text-sm font-medium text-white/90">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#FFD700] drop-shadow-md sm:text-4xl">
              200+
            </div>
            <div className="mt-1 text-sm font-medium text-white/90">Listings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[#FFD700] drop-shadow-md sm:text-4xl">
              12
            </div>
            <div className="mt-1 text-sm font-medium text-white/90">Cities</div>
          </div>
        </div>
      </div>
    </section>
  )
}
