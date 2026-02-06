import { MapPin, BedDouble, Bath, Maximize } from "lucide-react"
import Link from "next/link"

const SAMPLE_PROPERTIES = [
  {
    id: 1,
    title: "Modern Villa in Gombe",
    city: "Kinshasa",
    commune: "Gombe",
    price: 250000,
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    type: "Villa",
    listingType: "sale",
  },
  {
    id: 2,
    title: "Luxury Apartment in Ngaliema",
    city: "Kinshasa",
    commune: "Ngaliema",
    price: 1500,
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    type: "Apartment",
    listingType: "rent",
  },
  {
    id: 3,
    title: "Family House in Limete",
    city: "Kinshasa",
    commune: "Limete",
    price: 175000,
    bedrooms: 5,
    bathrooms: 3,
    area: 400,
    type: "House",
    listingType: "sale",
  },
  {
    id: 4,
    title: "Commercial Space in Lubumbashi",
    city: "Lubumbashi",
    commune: "Centre",
    price: 3000,
    bedrooms: 0,
    bathrooms: 2,
    area: 250,
    type: "Commercial",
    listingType: "rent",
  },
  {
    id: 5,
    title: "Studio in Kintambo",
    city: "Kinshasa",
    commune: "Kintambo",
    price: 800,
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    type: "Studio",
    listingType: "rent",
  },
  {
    id: 6,
    title: "Land Plot in Mont-Ngafula",
    city: "Kinshasa",
    commune: "Mont-Ngafula",
    price: 95000,
    bedrooms: 0,
    bathrooms: 0,
    area: 1200,
    type: "Land",
    listingType: "sale",
  },
]

function formatPrice(price: number, listingType: string) {
  if (listingType === "rent") {
    return `$${price.toLocaleString()}/mo`
  }
  return `$${price.toLocaleString()}`
}

export function FeaturedProperties() {
  return (
    <section className="bg-muted/30 px-4 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="relative pl-4 text-2xl font-bold text-foreground lg:text-3xl">
            <span className="absolute left-0 top-1/2 h-[60%] w-1 -translate-y-1/2 rounded-full bg-primary" />
            Featured Properties
          </h2>
          <Link
            href="/properties"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            View All
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_PROPERTIES.map((property) => (
            <article
              key={property.id}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] bg-muted">
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <Maximize className="h-8 w-8" />
                </div>
                <span
                  className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                    property.listingType === "sale"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                >
                  {property.listingType === "sale" ? "For Sale" : "For Rent"}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary">
                    {property.title}
                  </h3>
                </div>

                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {property.commune}, {property.city}
                  </span>
                </div>

                <div className="mt-3 text-xl font-bold text-primary">
                  {formatPrice(property.price, property.listingType)}
                </div>

                <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1">
                      <BedDouble className="h-4 w-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{property.area} m&sup2;</span>
                  </div>
                  <span className="ml-auto rounded bg-muted px-2 py-0.5 text-xs font-medium">
                    {property.type}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
