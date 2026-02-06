import Link from "next/link"
import { MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="DRC Flag">
                {"🇨🇩"}
              </span>
              <h3 className="text-lg font-bold text-foreground">
                Futelatosomba
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              The Leading Property Platform in Democratic Republic of Congo
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Properties
            </h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/properties?listingType=sale"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  For Sale
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?listingType=rent"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  For Rent
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?city=Kinshasa"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Kinshasa
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?city=Lubumbashi"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Lubumbashi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              About Us
            </h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Contact Us
            </h4>
            <ul className="mt-3 flex flex-col gap-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Kinshasa, DRC</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@futelatosomba.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+243 XX XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Futelatosomba. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
