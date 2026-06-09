import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { NavDock } from "@/components/layout/nav-dock"
import { TopBar } from "@/components/layout/topbar"

export const metadata: Metadata = {
  title: "医学学习中心",
  description: "面向医学生的智能复习平台",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          <div className="flex h-screen overflow-hidden bg-background">
            <NavDock />
            <div className="flex flex-1 flex-col overflow-hidden max-w-5xl mx-auto w-full">
              <TopBar />
              <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 lg:px-12">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
