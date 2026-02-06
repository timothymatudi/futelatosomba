"use client"

import { Search } from "lucide-react"
import { useState } from "react"

const STATS = [
  { value: "500+", label: "Properties" },
  { value: "200+", label: "Listings" },
  { value: "12", label: "Cities" },
]

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-primary px-4 py-20 text-primary-foreground">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 127, 255, 0.75) 0%, rgba(0, 80, 180, 0.80) 100%), url('/frontend/futelatosomba-react-app/public/kinshasa-hero.jpg')`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
          Find Your Dream Home in DRC
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg font-medium text-white/90 drop-shadow-sm leading-relaxed">
          The Leading Property Platform in Democratic Republic of Congo
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl overflow-hidden rounded-lg bg-background shadow-xl ring-1 ring-white/20">
          <input
            type="text"
            placeholder="Search properties by location, type..."
            className="flex-1 bg-transparent px-5 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="flex items-center gap-2 bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90">
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-10 sm:gap-16">
          {STATS.map((stat) => (
            <div key={stat.label} className="relative text-center">
              <div className="text-3xl font-extrabold text-secondary drop-shadow-sm sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-white/80">
                {stat.label}
              </div>
              <div className="absolute -bottom-2 left-1/2 h-0.5 w-10 -translate-x-1/2 rounded-full bg-secondary/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
