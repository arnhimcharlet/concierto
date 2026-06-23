"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Ticket, LayoutDashboard, Calendar, ShoppingBag, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-border/40 bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border/40 px-4">
        <Ticket className="h-5 w-5 text-sidebar-primary" />
        <span className="text-sm font-bold text-sidebar-foreground">Concierto Admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border/40 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  )
}
