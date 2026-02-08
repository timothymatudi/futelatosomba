import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Maximize, Heart } from "lucide-react"

export interface Property {
  id: string
  title: string
  price: number
  currency: string
  listingType: "sale" | "rent"
  propertyType: string
  city: string
  commune?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  image: string
  isPremium?: boolean
  isNew?: boolean
  addedTime?: string
}

function formatPrice(price: number, listingType: string, currency: string) {
  const symbol = currency === "CDF" ? "FC" : "$"
  const formatted = price.toLocaleString()
  const suffix = listingType === "rent" ? "/mo" : ""
  return `${symbol}${formatted}${suffix}`
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {property.isNew && (
            <span className="bg-[#48BB78] px-2.5 py-1 text-xs font-bold uppercase text-white">
              NEW
            </span>
          )}
          {property.isPremium && (
            <span className="bg-accent px-2.5 py-1 text-xs font-bold uppercase text-accent-foreground">
              Premium
            </span>
          )}
          <span
            className={`px-2.5 py-1 text-xs font-bold uppercase text-white ${
              property.listingType === "sale" ? "bg-primary" : "bg-[#48BB78]"
            }`}
          >
            {property.listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-foreground/60 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-destructive"
          aria-label="Add to favorites"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xl font-bold text-foreground">
          {formatPrice(property.price, property.listingType, property.currency)}
        </p>
        <h3 className="line-clamp-1 text-base font-semibold text-foreground">
          {property.title}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          {property.commune && `${property.commune}, `}
          {property.city}
        </p>

        {/* Features */}
        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1.5">
              <Bed className="h-4.5 w-4.5" />
              <span>{property.bedrooms} bed</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4.5 w-4.5" />
              <span>{property.bathrooms} bath</span>
            </div>
          )}
          {property.area != null && (
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4.5 w-4.5" />
              <span>{property.area} m&sup2;</span>
            </div>
          )}
        </div>

        {/* Type badge */}
        <div className="mt-auto pt-2">
          <span className="inline-block border border-border px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
            {property.propertyType}
          </span>
        </div>

        {property.addedTime && (
          <p className="text-xs text-muted-foreground">{property.addedTime}</p>
        )}
      </div>
    </Link>
  )
}
