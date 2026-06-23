import { Ticket } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Concierto</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your premier destination for live event tickets.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Events</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Concerts</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Sports</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Theatre</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Concierto. Demo application.
        </div>
      </div>
    </footer>
  )
}
