import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Futelatosomba - Find Your Dream Home in DRC",
  description:
    "The leading property platform in the Democratic Republic of Congo. Browse houses, apartments, land, and commercial properties for sale and rent across Kinshasa, Lubumbashi, and more.",
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
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
