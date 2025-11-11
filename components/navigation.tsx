"use client"

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import { ShoppingCart, Bell, Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function Navigation() {
  const [hasNotification, setHasNotification] = useState(false)
  const [notificationData, setNotificationData] = useState<{ morningTime: string; nightTime: string } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    // localStorage에서 알림 설정 확인
    const checkNotification = () => {
      const storedData = localStorage.getItem("routineNotification")
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          if (data.enabled && data.morningTime && data.nightTime) {
            setHasNotification(true)
            setNotificationData({
              morningTime: data.morningTime,
              nightTime: data.nightTime
            })
            return
          }
        } catch (e) {
          // 파싱 오류 무시
        }
      }
      setHasNotification(false)
      setNotificationData(null)
    }

    checkNotification()
    
    // storage 이벤트 리스너 (다른 탭에서 변경 시)
    const handleStorageChange = () => {
      checkNotification()
    }
    
    // 커스텀 이벤트 리스너 (같은 탭에서 변경 시)
    const handleCustomStorage = () => {
      checkNotification()
    }
    
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("routineNotificationChange", handleCustomStorage)
    
    // 주기적으로 확인 (백업)
    const interval = setInterval(checkNotification, 2000)
    
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("routineNotificationChange", handleCustomStorage)
      clearInterval(interval)
    }
  }, [])
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">F</span>
            </div>
            <span className="font-serif text-xl lg:text-2xl font-semibold text-foreground">페이스 캘린더</span>
          </Link>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4 lg:gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                기능
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                사용방법
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                요금제
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    로그인
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                {hasNotification && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <button
                      onClick={() => {
                        // Dialog 열 때 최신 데이터 확인
                        const storedData = localStorage.getItem("routineNotification")
                        if (storedData) {
                          try {
                            const data = JSON.parse(storedData)
                            if (data.enabled && data.morningTime && data.nightTime) {
                              setNotificationData({
                                morningTime: data.morningTime,
                                nightTime: data.nightTime
                              })
                            }
                          } catch (e) {
                            // 파싱 오류 무시
                          }
                        }
                        setDialogOpen(true)
                      }}
                      className="relative p-2 hover:bg-muted rounded-md transition-colors"
                      aria-label="알림 설정 보기"
                    >
                      <Bell className="w-5 h-5 text-primary" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                    </button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>루틴 알림 설정</DialogTitle>
                        <DialogDescription>
                          설정된 알림 시간을 확인하세요.
                        </DialogDescription>
                      </DialogHeader>
                      {notificationData && (
                        <div className="space-y-4 py-4">
                          <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Sun className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">아침 알림</p>
                              <p className="text-lg font-semibold text-foreground">{notificationData.morningTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Moon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">저녁 알림</p>
                              <p className="text-lg font-semibold text-foreground">{notificationData.nightTime}</p>
                            </div>
                          </div>
                          <div className="pt-2">
                            <Link href="/routine">
                              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                알림 설정 변경하기
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                )}
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
