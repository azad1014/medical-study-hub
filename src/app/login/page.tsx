"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [邮箱, set邮箱] = useState("")
  const [密码, set密码] = useState("")
  const [show密码, setShow密码] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-medical-50 via-white to-blue-50 dark:from-medical-950 dark:via-background dark:to-blue-950 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-12 w-12 rounded-xl bg-medical-500 flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">医学学习中心</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <Card>
          <CardHeader className="text-center pb-2">
            <CardTitle>欢迎回来</CardTitle>
            <CardDescription>
              输入你的凭证以进入学习工作台
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="邮箱">邮箱</Label>
                <Input
                  id="邮箱"
                  type="邮箱"
                  placeholder="your@email.com"
                  value={邮箱}
                  onChange={(e) => set邮箱(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="密码">密码</Label>
                <div className="relative">
                  <Input
                    id="密码"
                    type={show密码 ? "text" : "密码"}
                    placeholder="Enter your 密码"
                    value={密码}
                    onChange={(e) => set密码(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShow密码(!show密码)}
                  >
                    {show密码 ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    登录中...
                  </>
                ) : (
                  "登录"
                )}
              </Button>
            </form>

            <Separator className="my-4" />

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                演示模式下，任意邮箱密码均可登录
              </p>
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account? Contact your administrator
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
