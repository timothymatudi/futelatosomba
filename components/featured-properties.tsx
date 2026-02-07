import { PropertyCard } from "@/components/property-card"
import Link from "next/link"

const SAMPLE_PROPERTIES = [
  {
    title: "Modern Villa in Gombe",
    price: "$350,000",
    location: "Gombe, Kinshasa",
    bedrooms: 5,
    bathrooms: 4,
    area: "450 m\u00B2",
    listingType: "sale" as const,
    propertyType: "villa",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=450&fit=crop",
  },
  {
    title: "Spacious Apartment in Limete",
    price: "$1,200/mo",
    location: "Limete, Kinshasa",
    bedrooms: 3,
    bathrooms: 2,
    area: "180 m\u00B2",
    listingType: "rent" as const,
    propertyType: "apartment",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=450&fit=crop",
  },
  {
    title: "Family House in Ngaliema",
    price: "$220,000",
    location: "Ngaliema, Kinshasa",
    bedrooms: 4,
    bathrooms: 3,
    area: "320 m\u00B2",
    listingType: "sale" as const,
    propertyType: "house",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=450&fit=crop",
  },
  {
    title: "Commercial Space in Lubumbashi",
    price: "$2,500/mo",
    location: "Centre, Lubumbashi",
    bedrooms: 0,
    bathrooms: 2,
    area: "500 m\u00B2",
    listingType: "rent" as const,
    propertyType: "commercial",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=450&fit=crop",
  },
  {
    title: "Luxury Studio in Gombe",
    price: "$800/mo",
    location: "Gombe, Kinshasa",
    bedrooms: 1,
    bathrooms: 1,
    area: "75 m\u00B2",
    listingType: "rent" as const,
    propertyType: "studio",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=450&fit=crop",
  },
  {
    title: "Building Plot in Mont-Ngafula",
    price: "$95,000",
    location: "Mont-Ngafula, Kinshasa",
    bedrooms: 0,
    bathrooms: 0,
    area: "1,200 m\u00B2",
    listingType: "sale" as const,
    propertyType: "land",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=450&fit=crop",
  },
]

export function FeaturedProperties() {
  return (
    <section className="bg-muted/30 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Featured Properties
            </h2>
          </div>
          <Link
            href="/properties"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            View All
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_PROPERTIES.map((property) => (
            <PropertyCard key={property.title} {...property} />
          ))}
        </div>
      </div>
    </section>
  )
}
