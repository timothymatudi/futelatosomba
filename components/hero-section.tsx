"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const stats = [
  { value: "500+", label: "Properties" },
  { value: "150+", label: "Listings" },
  { value: "12", label: "Cities" },
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section
      className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-cover bg-fixed bg-center px-4 py-24 text-white md:min-h-[580px]"
      style={{
        backgroundImage: `
          linear-gradient(
            135deg,
            rgba(0, 127, 255, 0.55) 0%,
            rgba(0, 102, 204, 0.50) 100%
          ),
          url(/kinshasa-hero.jpg)
        `,
      }}
    >
      {/* Animated overlay */}
      <div
        className="pointer-events-none absolute inset-0 animate-pulse"
        style={{
          background:
            "linear-gradient(45deg, rgba(0,107,84,0.1), transparent, rgba(0,127,255,0.1))",
          animationDuration: "8s",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1000px] text-center">
        <h1 className="mb-6 text-balance text-4xl font-extrabold tracking-tight drop-shadow-lg md:text-5xl lg:text-6xl">
          Find Your Dream Home in DRC
        </h1>
        <p className="mx-auto mb-10 max-w-[700px] text-pretty text-lg font-medium leading-relaxed text-white/95 drop-shadow-md md:text-xl">
          The Leading Property Platform in Democratic Republic of Congo
        </p>

        {/* Search Bar */}
        <div className="mx-auto mb-10 flex max-w-[800px] overflow-hidden rounded-sm border-2 border-white/30 bg-background shadow-2xl">
          <input
            type="text"
            className="flex-1 px-6 py-[18px] text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none md:text-lg"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search properties"
          />
          <button
            className="flex items-center gap-2 bg-primary px-8 py-[18px] text-base font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 md:px-10 md:text-lg"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="relative min-w-[120px] pb-3 text-center">
              <div className="text-3xl font-extrabold text-accent drop-shadow-md md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-white/95 md:text-base">
                {stat.label}
              </div>
              <div className="absolute bottom-0 left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full bg-accent/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
