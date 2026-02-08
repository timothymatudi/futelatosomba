"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/find-agents", label: "Find Agents" },
  { href: "/house-prices", label: "Sold Prices" },
  { href: "/valuation", label: "Valuation" },
]

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "Francais" },
  { code: "ln", name: "Lingala" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("en")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background shadow-sm">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-foreground no-underline">
          <Image
            src="/drc-flag.png"
            alt="DRC Flag"
            width={45}
            height={30}
            className="rounded-sm border border-border/50 shadow-sm"
          />
          <span className="text-lg font-bold tracking-tight">Futelatosomba</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center lg:flex" role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b-[3px] border-transparent px-4 py-5 text-[15px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Dropdown */}
          <div className="relative hidden sm:block">
            <button
              className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              aria-expanded={languageMenuOpen}
              aria-haspopup="true"
            >
              {LANGUAGES.find((l) => l.code === currentLanguage)?.name}
              <ChevronDown className="h-4 w-4" />
            </button>

            {languageMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] border border-border bg-background shadow-lg">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`block w-full px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary ${
                      currentLanguage === lang.code
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground"
                    }`}
                    onClick={() => {
                      setCurrentLanguage(lang.code)
                      setLanguageMenuOpen(false)
                    }}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 text-foreground lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          className="border-t border-border bg-background px-4 py-4 lg:hidden"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-muted py-3 text-base font-semibold text-foreground transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              {/* Language selector in mobile */}
              <div className="flex gap-2 pb-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`rounded-sm px-3 py-1.5 text-sm font-medium ${
                      currentLanguage === lang.code
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground"
                    }`}
                    onClick={() => setCurrentLanguage(lang.code)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              <Link
                href="/login"
                className="border border-primary px-4 py-3 text-center text-base font-semibold text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
