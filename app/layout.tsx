import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Futelatosomba - Find Your Dream Home in DRC",
  description:
    "The leading property platform in the Democratic Republic of Congo. Buy, rent, or sell properties across Kinshasa, Lubumbashi, Goma, and more.",
}

export const viewport: Viewport = {
  themeColor: "#007FFF",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
