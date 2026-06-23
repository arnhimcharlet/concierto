"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, ChevronDown, Ticket, Menu, X } from "lucide-react"

export function MainHeader() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">Concierto</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/10">
                Events
              </Link>
              <Link href="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/10">
                Categories
              </Link>
              <Link href="/" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/10">
                Venues
              </Link>
            </nav>
          </div>

          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events, artists, venues..."
                className="w-full pl-9 bg-muted/50 border-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:flex gap-1 text-muted-foreground cursor-pointer items-center border-0 bg-transparent text-sm">
                PH/EN <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Filipino</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/help" className="hidden md:text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full p-0 border-0 bg-transparent cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push("/my-tickets")}>My Tickets</DropdownMenuItem>
                  {profile?.role === "admin" && (
                    <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>Admin Panel</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign In / Register
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 py-3 space-y-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="w-full pl-9" />
            </div>
            <Link href="/" className="block px-3 py-2 text-sm rounded-md hover:bg-accent/10" onClick={() => setMobileOpen(false)}>Events</Link>
            <Link href="/" className="block px-3 py-2 text-sm rounded-md hover:bg-accent/10" onClick={() => setMobileOpen(false)}>Categories</Link>
            <Link href="/" className="block px-3 py-2 text-sm rounded-md hover:bg-accent/10" onClick={() => setMobileOpen(false)}>Venues</Link>
            <Link href="/help" className="block px-3 py-2 text-sm rounded-md hover:bg-accent/10" onClick={() => setMobileOpen(false)}>Help</Link>
          </div>
        )}
      </div>
    </header>
  )
}
