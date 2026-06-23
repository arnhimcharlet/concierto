import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/providers/AuthProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Concierto — Live Event Tickets",
  description: "Your premier destination for live event tickets",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
