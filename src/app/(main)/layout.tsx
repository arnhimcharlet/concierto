import { MainHeader } from "@/components/layout/MainHeader"
import { Footer } from "@/components/layout/Footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
