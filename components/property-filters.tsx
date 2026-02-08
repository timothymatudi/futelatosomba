"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, RotateCcw, Search } from "lucide-react"

const PROPERTY_TYPES = ["house", "apartment", "land", "commercial", "villa", "studio"]
const CITIES = [
  "Kinshasa",
  "Lubumbashi",
  "Mbuji-Mayi",
  "Kisangani",
  "Kananga",
  "Likasi",
  "Kolwezi",
  "Tshikapa",
  "Beni",
  "Bukavu",
  "Goma",
  "Matadi",
]

export function PropertyFilters() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-8 border border-border bg-card p-4 shadow-sm md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Filter Properties</h3>
        <button
          className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <div className={`mt-4 ${isExpanded ? "block" : "hidden md:block"}`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Search */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-search" className="text-sm font-medium text-foreground">
              Search
            </label>
            <input
              id="filter-search"
              type="text"
              className="rounded-sm border border-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search properties..."
            />
          </div>

          {/* Property Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-type" className="text-sm font-medium text-foreground">
              Property Type
            </label>
            <select
              id="filter-type"
              className="rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type} className="capitalize">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Listing Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-listing" className="text-sm font-medium text-foreground">
              Listing Type
            </label>
            <select
              id="filter-listing"
              className="rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          {/* City */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-city" className="text-sm font-medium text-foreground">
              City
            </label>
            <select
              id="filter-city"
              className="rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-min" className="text-sm font-medium text-foreground">
              Min Price
            </label>
            <input
              id="filter-min"
              type="number"
              className="rounded-sm border border-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Min"
            />
          </div>

          {/* Max Price */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-max" className="text-sm font-medium text-foreground">
              Max Price
            </label>
            <input
              id="filter-max"
              type="number"
              className="rounded-sm border border-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Max"
            />
          </div>

          {/* Bedrooms */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-bed" className="text-sm font-medium text-foreground">
              Bedrooms
            </label>
            <select
              id="filter-bed"
              className="rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-bath" className="text-sm font-medium text-foreground">
              Bathrooms
            </label>
            <select
              id="filter-bath"
              className="rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button className="flex items-center gap-1.5 border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </button>
          <button className="flex items-center gap-1.5 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <Search className="h-4 w-4" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
