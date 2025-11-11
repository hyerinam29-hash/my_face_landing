"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Package, AlertTriangle, Bell, Camera, Upload, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"

export function Solution() {
  const [open, setOpen] = useState(false)
  const [recoOpen, setRecoOpen] = useState(false)
  const [dupOpen, setDupOpen] = useState(false)
  const [routineOpen, setRoutineOpen] = useState(false)
  const [dupPreviewUrl, setDupPreviewUrl] = useState<string | null>(null)
  const [dupSelectedFile, setDupSelectedFile] = useState<File | null>(null)
  const [productName, setProductName] = useState("")
  const [duplicates, setDuplicates] = useState<{ name: string; score: number }[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (open) {
      startCamera()
    } else {
      stopCamera()
      clearPreview()
    }
    return () => {
      stopCamera()
    }
  }, [open])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (e) {
      console.error("camera start error", e)
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop()
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSelectedFile(null)
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, width, height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], "face.jpg", { type: blob.type })
      setSelectedFile(file)
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      stopCamera()
    }, "image/jpeg", 0.9)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    stopCamera()
  }

  async function onConfirm() {
    console.log("selected file:", selectedFile)
    setOpen(false)
  }

  function onDupFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (dupPreviewUrl) URL.revokeObjectURL(dupPreviewUrl)
    setDupSelectedFile(file)
    setDupPreviewUrl(URL.createObjectURL(file))
    const guessed = file.name.replace(/\.[^/.]+$/, "")
    if (!productName) setProductName(guessed)
  }

  function normalize(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9가-힣]/g, "")
  }

  function bigrams(text: string) {
    const n = text.length
    const grams = new Set<string>()
    for (let i = 0; i < n - 1; i++) grams.add(text.slice(i, i + 2))
    return grams
  }

  function jaccardSimilarity(a: string, b: string) {
    const A = bigrams(normalize(a))
    const B = bigrams(normalize(b))
    if (A.size === 0 || B.size === 0) return 0
    let inter = 0
    for (const g of A) if (B.has(g)) inter++
    const union = A.size + B.size - inter
    return inter / union
  }

  function analyzeDuplicates() {
    const registry = [
      "라로슈포제 시카플라스트 밤 B5",
      "닥터지 레드 블레미쉬 클리어 수딩 크림",
      "키엘 울트라 훼이셜 크림",
      "이니스프리 그린티 씨드 세럼",
      "탬버린즈 퍼퓸 핸드크림",
      "바이오더마 하이드라비오 토너",
      "더랩바이블랑두 올리고 히알루론산 토너",
      "라네즈 워터뱅크 블루 히알루로닉 세럼",
      "AHC 아이크림 포 페이스",
      "닥터자르트 시카페어 크림",
      "비오템 라이프 플랑크톤 세럼",
      "마녀공장 갈락토미 나이아신 에센스",
    ]

    const target = productName.trim()
    if (!target) {
      setDuplicates([])
      return
    }

    const results = registry
      .map((name) => ({ name, score: jaccardSimilarity(name, target) }))
      .filter((r) => r.score >= 0.45 || normalize(nameIncludes(target, r.name) ? target : "") !== "")
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)

    setDuplicates(results)
  }

  function nameIncludes(a: string, b: string) {
    const A = normalize(a)
    const B = normalize(b)
    return A.length > 0 && (A.includes(B) || B.includes(A))
  }

  const features = [
    {
      icon: Sparkles,
      title: "AI 피부 진단",
      description: "얼굴 사진 업로드 시 즉시 피부 타입 분석. 유수분 밸런스, 트러블, 민감도 등을 자동으로 진단합니다.",
    },
    {
      icon: Package,
      title: "맞춤형 화장품 추천",
      description: "진단 결과에 따른 개인화 화장품 큐레이션. 성분·브랜드·가격대별 다차원 필터를 제공합니다.",
    },
    {
      icon: AlertTriangle,
      title: "중복 화장품 감지",
      description:
        "등록된 제품 목록 분석으로 유사·중복 제품 자동 탐지. 중복 구매를 방지하고 성분 유사도를 알려드립니다.",
    },
    {
      icon: Bell,
      title: "시간별 루틴 알림",
      description: "피부 타입별 최적 케어 타이밍 분석. 아침/저녁 루틴 알림 및 제품별 사용 순서를 안내합니다.",
    },
  ]

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            페이스 캘린더가 해결해드립니다
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            AI 기반 분석으로 시간 절약, 경제적 효율, 맞춤형 케어를 한 번에 경험하세요.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const card = (
              <div
                className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all hover:shadow-xl"
              >
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            )

            if (feature.title === "AI 피부 진단") {
              return (
                <Link key={index} href="/diagnosis" className="text-left focus:outline-none w-full block">
                  {card}
                </Link>
              )
            }

            if (feature.title === "AI 피부 진단 (Modal)") {
              return (
                <Dialog key={index} open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button className="text-left focus:outline-none w-full" aria-label="AI 피부 진단 시작">
                      {card}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>얼굴 사진 업로드</DialogTitle>
                      <DialogDescription>카메라로 촬영하거나 앨범에서 선택하세요.</DialogDescription>
                    </DialogHeader>

                    {!previewUrl && (
                      <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                        </div>
                        <div className="flex gap-3">
                          <Button type="button" onClick={capturePhoto} className="bg-primary text-primary-foreground">
                            <Camera className="w-4 h-4 mr-2" /> 촬영하기
                          </Button>
                          <label className="inline-flex items-center">
                            <Input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                            <span className="inline-flex items-center h-9 px-4 rounded-md border bg-background cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" /> 앨범에서 선택
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {previewUrl && (
                      <div className="space-y-4">
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                          <img src={previewUrl} alt="미리보기" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-3">
                          <Button type="button" variant="outline" onClick={() => { clearPreview(); startCamera() }}>
                            <RotateCcw className="w-4 h-4 mr-2" /> 다시 찍기
                          </Button>
                          <Button type="button" onClick={onConfirm} className="bg-primary text-primary-foreground">확인</Button>
                          <DialogClose asChild>
                            <Button type="button" variant="ghost">취소</Button>
                          </DialogClose>
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </DialogContent>
                </Dialog>
              )
            }

            if (feature.title === "맞춤형 화장품 추천") {
              return (
                <Link key={index} href="/recommendation" className="text-left focus:outline-none w-full block">
                  {card}
                </Link>
              )
            }

            if (feature.title === "맞춤형 화장품 추천 (Modal)") {
              const categories: { key: string; label: string; items: string[] }[] = [
                { key: "cleanser", label: "클렌저", items: ["약산성 폼 클렌저", "저자극 젤 클렌저", "클렌징 밤"] },
                { key: "toner", label: "토너", items: ["수분 밸런싱 토너", "AHA 각질 토너", "저자극 진정 토너"] },
                { key: "serum", label: "세럼", items: ["히알루론산 수분 세럼", "니아신아마이드 균일 세럼", "비타민C 브라이트닝 세럼"] },
                { key: "cream", label: "크림", items: ["세라마이드 장벽 크림", "라이트 젤 크림", "리치 밤 크림"] },
                { key: "sunscreen", label: "선크림", items: ["논나노 무기자차", "워터프루프 유기자차", "톤업 선크림"] },
              ]

              return (
                <Dialog key={index} open={recoOpen} onOpenChange={setRecoOpen}>
                  <DialogTrigger asChild>
                    <button className="text-left focus:outline-none w-full" aria-label="맞춤형 화장품 추천 보기">
                      {card}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>맞춤형 화장품 카테고리</DialogTitle>
                      <DialogDescription>카테고리를 선택해 추천 리스트를 확인하세요.</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue={categories[0].key} className="mt-2">
                      <TabsList className="mb-4">
                        {categories.map((c) => (
                          <TabsTrigger key={c.key} value={c.key}>{c.label}</TabsTrigger>
                        ))}
                      </TabsList>

                      {categories.map((c) => (
                        <TabsContent key={c.key} value={c.key} className="mt-0">
                          <ul className="space-y-2">
                            {c.items.map((name, i) => (
                              <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                                <span className="text-sm text-foreground">{name}</span>
                                <button className="text-xs px-3 py-1 rounded-md border hover:bg-muted transition-colors">자세히</button>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      ))}
                    </Tabs>

                    <div className="flex justify-end gap-2 pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">닫기</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            }

            if (feature.title === "중복 화장품 감지") {
              return (
                <Link key={index} href="/duplicate" className="text-left focus:outline-none w-full block">
                  {card}
                </Link>
              )
            }

            if (feature.title === "중복 화장품 감지 (Modal)") {
              return (
                <Dialog key={index} open={dupOpen} onOpenChange={setDupOpen}>
                  <DialogTrigger asChild>
                    <button className="text-left focus:outline-none w-full" aria-label="중복 화장품 감지 열기">
                      {card}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>중복 화장품 감지</DialogTitle>
                      <DialogDescription>제품 사진 업로드 후 제품명을 확인하고, 등록 목록과 유사 항목을 찾아 표시합니다.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                      <div className="flex items-center gap-3">
                        <label className="inline-flex items-center">
                          <Input type="file" accept="image/*" onChange={onDupFileChange} className="hidden" />
                          <span className="inline-flex items-center h-9 px-4 rounded-md border bg-background cursor-pointer">사진 업로드</span>
                        </label>
                        <Input
                          placeholder="제품명 입력 (파일명에서 자동 추출 가능)"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                        <Button type="button" onClick={analyzeDuplicates} className="bg-primary text-primary-foreground">분석하기</Button>
                      </div>

                      {dupPreviewUrl && (
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                          <img src={dupPreviewUrl} alt="제품 사진" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium mb-2">중복 의심 제품</h4>
                        {duplicates.length === 0 ? (
                          <p className="text-sm text-muted-foreground">분석 결과가 없습니다. 제품명을 조금 더 구체적으로 입력해 보세요.</p>
                        ) : (
                          <ul className="space-y-2">
                            {duplicates.map((d, i) => (
                              <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                                <span className="text-sm">{d.name}</span>
                                <span className="text-xs text-muted-foreground">유사도 {(d.score * 100).toFixed(0)}%</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">닫기</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            }

            if (feature.title === "시간별 루틴 알림") {
              return (
                <Link key={index} href="/routine" className="text-left focus:outline-none w-full block">
                  {card}
                </Link>
              )
            }

            if (feature.title === "시간별 루틴 알림 (Modal)") {
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
                <Dialog key={index} open={routineOpen} onOpenChange={setRoutineOpen}>
                  <DialogTrigger asChild>
                    <button className="text-left focus:outline-none w-full" aria-label="시간별 루틴 알림 보기">
                      {card}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>피부 타입별 아침/저녁 루틴</DialogTitle>
                      <DialogDescription>피부 타입을 선택하고, 제품별 권장 사용 순서를 확인하세요.</DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue={skinTypes[0].key} className="mt-2">
                      <TabsList className="mb-4">
                        {skinTypes.map((t) => (
                          <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
                        ))}
                      </TabsList>

                      {skinTypes.map((t) => (
                        <TabsContent key={t.key} value={t.key} className="mt-0">
                          <Tabs defaultValue="morning">
                            <TabsList className="mb-3">
                              <TabsTrigger value="morning">아침 루틴</TabsTrigger>
                              <TabsTrigger value="night">저녁 루틴</TabsTrigger>
                            </TabsList>
                            <TabsContent value="morning" className="mt-0">
                              <ol className="space-y-2 list-decimal pl-5">
                                {routine[t.key].morning.map((step, i) => (
                                  <li key={i} className="rounded-lg border border-border bg-card px-4 py-2 text-sm">{step}</li>
                                ))}
                              </ol>
                            </TabsContent>
                            <TabsContent value="night" className="mt-0">
                              <ol className="space-y-2 list-decimal pl-5">
                                {routine[t.key].night.map((step, i) => (
                                  <li key={i} className="rounded-lg border border-border bg-card px-4 py-2 text-sm">{step}</li>
                                ))}
                              </ol>
                            </TabsContent>
                          </Tabs>
                        </TabsContent>
                      ))}
                    </Tabs>

                    <div className="flex justify-end pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">닫기</Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            }

            return (
              <div key={index}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
