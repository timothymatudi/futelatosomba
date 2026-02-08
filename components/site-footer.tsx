import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

const propertyLinks = [
  { href: "/properties?listingType=sale", label: "For Sale" },
  { href: "/properties?listingType=rent", label: "For Rent" },
  { href: "/properties?city=Kinshasa", label: "Kinshasa" },
  { href: "/properties?city=Lubumbashi", label: "Lubumbashi" },
]

const aboutLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/register", label: "Register" },
]

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-[#2D3748] text-white" role="contentinfo">
      <div className="mx-auto max-w-[1400px] px-4 pb-4 pt-16 lg:px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/drc-flag.png"
                alt="DRC Flag"
                width={60}
                height={40}
                className="rounded-sm"
              />
              <h3 className="text-xl font-bold text-white">Futelatosomba</h3>
            </div>
            <p className="max-w-[320px] text-sm leading-relaxed text-white/75">
              The Leading Property Platform in Democratic Republic of Congo
            </p>
          </div>

          {/* Properties */}
          <div className="flex flex-col gap-4">
            <h4 className="relative pb-2 text-lg font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-10 after:rounded-full after:bg-accent">
              Properties
            </h4>
            <ul className="flex flex-col gap-2">
              {propertyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/75 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="flex flex-col gap-4">
            <h4 className="relative pb-2 text-lg font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-10 after:rounded-full after:bg-accent">
              About Us
            </h4>
            <ul className="flex flex-col gap-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/75 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="relative pb-2 text-lg font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-10 after:rounded-full after:bg-accent">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-white/75">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>Kinshasa, DRC</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/75">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>info@futelatosomba.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/75">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span>+243 XX XXX XXXX</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm font-medium text-white/65">
            &copy; {currentYear} Futelatosomba. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm font-medium text-white/65 transition-colors hover:text-accent"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-medium text-white/65 transition-colors hover:text-accent"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
