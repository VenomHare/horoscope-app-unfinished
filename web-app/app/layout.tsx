import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language"

export const metadata: Metadata = {
  metadataBase: new URL("https://hora-detector.vercel.app"),
  title: {
    default: "Horashtak",
    template: "%s | Horashtak",
  },
  description: "Find the current hora and daily planetary hour schedule.",
  applicationName: "Horashtak",
  appleWebApp: {
    title: "Horashtak",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Horashtak",
    description: "Find the current hora and daily planetary hour schedule.",
    siteName: "Horashtak",
    images: [
      {
        url: "/logo.png",
        width: 1254,
        height: 1254,
        alt: "Horashtak logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Horashtak",
    description: "Find the current hora and daily planetary hour schedule.",
    images: ["/logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" >
      <body className={`font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
