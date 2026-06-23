"use client"

import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminHeader() {
  const { user, profile, signOut } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/40 bg-background px-6">
      <div>
        <h1 className="text-sm font-semibold text-foreground">Admin Panel</h1>
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-full p-0 border-0 bg-transparent">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {(profile?.full_name || user?.email || "A").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled className="text-muted-foreground">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
