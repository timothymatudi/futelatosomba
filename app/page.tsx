import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { CtaSection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProperties />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
