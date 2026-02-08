import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import { PropertyFilters } from "@/components/property-filters"
import { PropertyCard, type Property } from "@/components/property-card"

const FEATURED_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Modern Villa in Gombe",
    price: 350000,
    currency: "USD",
    listingType: "sale",
    propertyType: "villa",
    city: "Kinshasa",
    commune: "Gombe",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    image: "/properties/property-1.jpg",
    isPremium: true,
    isNew: true,
    addedTime: "Added today",
  },
  {
    id: "2",
    title: "Spacious Apartment in Limete",
    price: 1200,
    currency: "USD",
    listingType: "rent",
    propertyType: "apartment",
    city: "Kinshasa",
    commune: "Limete",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    image: "/properties/property-2.jpg",
    isNew: true,
    addedTime: "Added today",
  },
  {
    id: "3",
    title: "Family House in Ngaliema",
    price: 180000,
    currency: "USD",
    listingType: "sale",
    propertyType: "house",
    city: "Kinshasa",
    commune: "Ngaliema",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    image: "/properties/property-3.jpg",
    addedTime: "Added yesterday",
  },
  {
    id: "4",
    title: "Commercial Space Downtown",
    price: 5000,
    currency: "USD",
    listingType: "rent",
    propertyType: "commercial",
    city: "Lubumbashi",
    bedrooms: undefined,
    bathrooms: 2,
    area: 600,
    image: "/properties/property-4.jpg",
    isPremium: true,
    addedTime: "Added 2 days ago",
  },
  {
    id: "5",
    title: "Building Plot in Mont-Ngafula",
    price: 75000,
    currency: "USD",
    listingType: "sale",
    propertyType: "land",
    city: "Kinshasa",
    commune: "Mont-Ngafula",
    area: 1200,
    image: "/properties/property-5.jpg",
    addedTime: "Added 3 days ago",
  },
  {
    id: "6",
    title: "Modern Studio in Kintambo",
    price: 650,
    currency: "USD",
    listingType: "rent",
    propertyType: "studio",
    city: "Kinshasa",
    commune: "Kintambo",
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    image: "/properties/property-6.jpg",
    isNew: true,
    addedTime: "Added today",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main>
        <HeroSection />

        {/* Featured Properties */}
        <section className="bg-gradient-to-b from-secondary to-background px-4 py-12 md:py-16 lg:px-6">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-8 flex items-center justify-between border-b-2 border-border pb-4">
              <h2 className="relative pl-4 text-2xl font-bold text-foreground before:absolute before:left-0 before:top-1/2 before:h-4/5 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary md:text-3xl">
                Featured Properties
              </h2>
              <Link
                href="/properties"
                className="flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <PropertyFilters />

            {/* Property Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_PROPERTIES.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-primary px-4 py-16 text-center text-primary-foreground md:py-20">
          <div className="relative z-10 mx-auto max-w-[600px]">
            <h2 className="mb-4 text-balance text-2xl font-bold drop-shadow-sm md:text-3xl lg:text-4xl">
              Are you a property owner or agent?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/95">
              List your properties on Futelatosomba and reach thousands of potential buyers and
              renters.
            </p>
            <Link
              href="/register"
              className="inline-block bg-accent px-8 py-4 text-lg font-bold uppercase tracking-wide text-accent-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
