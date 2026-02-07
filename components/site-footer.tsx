import Link from "next/link"
import { MapPin, Mail, Phone } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-12 items-center justify-center rounded overflow-hidden">
                <div className="flex h-full w-full">
                  <div className="w-1/3 bg-[#007FFF]" />
                  <div className="w-1/3 bg-[#CE1126]" />
                  <div className="w-1/3 bg-[#FFD700]" />
                </div>
              </div>
              <span className="text-lg font-bold">Futelatosomba</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              The leading property platform in the Democratic Republic of Congo.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Properties
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/properties?listingType=sale" className="text-sm text-background/70 transition-colors hover:text-background">
                  For Sale
                </Link>
              </li>
              <li>
                <Link href="/properties?listingType=rent" className="text-sm text-background/70 transition-colors hover:text-background">
                  For Rent
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Kinshasa" className="text-sm text-background/70 transition-colors hover:text-background">
                  Kinshasa
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Lubumbashi" className="text-sm text-background/70 transition-colors hover:text-background">
                  Lubumbashi
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              About Us
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-background/70 transition-colors hover:text-background">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-background/70 transition-colors hover:text-background">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-background/70 transition-colors hover:text-background">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-background/50" />
                <span className="text-sm text-background/70">Kinshasa, DRC</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-background/50" />
                <span className="text-sm text-background/70">info@futelatosomba.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-background/50" />
                <span className="text-sm text-background/70">+243 XX XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-sm text-background/50">
            &copy; {currentYear} Futelatosomba. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-background/50 transition-colors hover:text-background">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-background/50 transition-colors hover:text-background">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
