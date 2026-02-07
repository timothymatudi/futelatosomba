"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Globe, User } from "lucide-react"
import { cn } from "@/lib/utils"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "Francais" },
  { code: "ln", name: "Lingala" },
]

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/find-agents", label: "Find Agents" },
  { href: "/house-prices", label: "Sold Prices" },
  { href: "/valuation", label: "Valuation" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState("en")

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-12 items-center justify-center rounded overflow-hidden">
              <div className="flex h-full w-full">
                <div className="w-1/3 bg-[#007FFF]" />
                <div className="w-1/3 bg-[#CE1126]" />
                <div className="w-1/3 bg-[#FFD700]" />
              </div>
            </div>
            <span className="text-lg font-bold text-foreground">Futelatosomba</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                {LANGUAGES.find((l) => l.code === currentLang)?.name}
                <ChevronDown className="h-3 w-3" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-md border border-border bg-popover p-1 shadow-lg">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        setLangMenuOpen(false)
                      }}
                      className={cn(
                        "w-full rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        currentLang === lang.code && "bg-accent text-accent-foreground"
                      )}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="flex flex-col px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground border-b border-border last:border-b-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
              <Link
                href="/login"
                className="flex-1 rounded-md border border-border py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-md bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
