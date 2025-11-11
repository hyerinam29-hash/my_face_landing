"use client"

import { useState } from "react"
import { ArrowLeft, Bell, Sun, Moon, Clock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function RoutinePage() {
  const { toast } = useToast()
  const [selectedSkinType, setSelectedSkinType] = useState("dry")
  const [morningTime, setMorningTime] = useState("08:00")
  const [nightTime, setNightTime] = useState("22:00")
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const skinTypes: { key: string; label: string }[] = [
    { key: "dry", label: "건성" },
    { key: "oily", label: "지성" },
    { key: "combination", label: "복합성" },
    { key: "sensitive", label: "민감성" },
  ]

  const routine: Record<string, { morning: string[]; night: string[] }> = {
    dry: {
      morning: ["미온수 세안/저자극 클렌저", "수분 토너", "히알루론산/글리세린 세럼", "세라마이드 크림", "보습 선크림"],
      night: ["저자극 클렌저", "수분 토너", "영양 세럼(세라마이드·스쿠알란)", "리치 보습 크림", "슬리핑 마스크(선택)"]
    },
    oily: {
      morning: ["약산성 클렌저", "가벼운 토너", "니아신아마이드 세럼", "라이트 젤 크림", "무기자차/산뜻 선크림"],
      night: ["약산성 클렌저", "각질 토너(AHA/BHA, 주 2-3회)", "레티놀/부스팅 세럼(저농도)", "오일프리 젤 크림"]
    },
    combination: {
      morning: ["약산성 클렌저", "밸런싱 토너", "T존: 니아신아마이드 / U존: 수분 세럼", "라이트 크림", "선크림"],
      night: ["순한 클렌저", "밸런싱 토너", "T존: 각질 토너(주 2회) / U존: 영양 세럼", "크림(구간별 레이어링)"]
    },
    sensitive: {
      morning: ["아침 물세안 또는 저자극 클렌저", "무향 진정 토너", "판테놀/센텔라 세럼", "시카 크림", "무기자차 선크림"],
      night: ["저자극 클렌저", "진정 토너", "센텔라/알란토인 세럼", "시카 크림", "재생 밤(선택)"]
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="py-12">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>홈으로 돌아가기</span>
            </Link>

            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  시간별 루틴 알림
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  피부 타입별 최적 케어 타이밍을 분석하여 알림을 제공합니다.
                  <br />
                  아침/저녁 루틴 알림 및 제품별 사용 순서를 안내합니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Bell className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">자동 알림</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">맞춤형 타이밍</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">AI 추천</span>
                </div>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="py-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">피부 타입별 루틴</h2>
            <Tabs defaultValue={skinTypes[0].key} className="mt-2">
              <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4">
                {skinTypes.map((t) => (
                  <TabsTrigger key={t.key} value={t.key}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {skinTypes.map((t) => (
                <TabsContent key={t.key} value={t.key} className="mt-0">
                  <Tabs defaultValue="morning" className="mt-0">
                    <TabsList className="mb-6">
                      <TabsTrigger value="morning" className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        아침 루틴
                      </TabsTrigger>
                      <TabsTrigger value="night" className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        저녁 루틴
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="morning" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routine[t.key].morning.map((step, i) => (
                          <div
                            key={i}
                            className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-bold">{i + 1}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Step {i + 1}</span>
                                </div>
                                <p className="text-foreground font-medium">{step}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="night" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {routine[t.key].night.map((step, i) => (
                          <div
                            key={i}
                            className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-bold">{i + 1}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Step {i + 1}</span>
                                </div>
                                <p className="text-foreground font-medium">{step}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* Alert Settings Section */}
          <section className="py-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">알림 설정</h2>
            <div className="bg-card border border-border rounded-xl p-8 shadow-md">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Bell className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-2">루틴 알림 활성화</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      루틴 알림을 설정하여 매일 아침과 저녁에 케어 시간을 알려드립니다.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notificationsEnabled ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notificationsEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-foreground">
                        {notificationsEnabled ? "알림 활성화됨" : "알림 비활성화됨"}
                      </span>
                    </div>
                  </div>
                </div>

                {notificationsEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">아침 알림 시간</label>
                      <input
                        type="time"
                        value={morningTime}
                        onChange={(e) => setMorningTime(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">저녁 알림 시간</label>
                      <input
                        type="time"
                        value={nightTime}
                        onChange={(e) => setNightTime(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      if (notificationsEnabled) {
                        toast({
                          title: "알림 설정 완료",
                          description: `아침 ${morningTime}, 저녁 ${nightTime}에 알림이 설정되었습니다.`,
                        })
                      } else {
                        toast({
                          title: "알림이 비활성화되었습니다",
                          description: "알림을 받으려면 알림을 활성화해주세요.",
                        })
                      }
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    설정 저장
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

