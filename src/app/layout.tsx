import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Sidebar } from "@/components/layout/sidebar"
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
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto bg-background p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
