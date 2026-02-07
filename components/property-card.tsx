import { MapPin, Bed, Bath, Maximize } from "lucide-react"
import Image from "next/image"

interface PropertyCardProps {
  title: string
  price: string
  location: string
  bedrooms: number
  bathrooms: number
  area: string
  listingType: "sale" | "rent"
  propertyType: string
  imageUrl: string
}

export function PropertyCard({
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  listingType,
  propertyType,
  imageUrl,
}: PropertyCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            {listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
          <span className="rounded bg-foreground/80 px-2.5 py-1 text-xs font-medium text-background capitalize">
            {propertyType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-xl font-bold text-primary">{price}</div>
        <h3 className="mt-1.5 text-sm font-semibold text-card-foreground line-clamp-1">
          {title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs line-clamp-1">{location}</span>
        </div>

        {/* Features */}
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bed className="h-3.5 w-3.5" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bath className="h-3.5 w-3.5" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Maximize className="h-3.5 w-3.5" />
            <span>{area}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
