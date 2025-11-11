"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Brain, Sparkles, Upload, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function HowItWorks() {
  const [chooserOpen, setChooserOpen] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [analyzeOpen, setAnalyzeOpen] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (cameraOpen) startCamera()
    else {
      stopCamera()
      clearPreview()
    }
    return () => stopCamera()
  }, [cameraOpen])

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
      for (const t of streamRef.current.getTracks()) t.stop()
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
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
    const w = video.videoWidth
    const h = video.videoHeight
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], "face.jpg", { type: blob.type })
      setSelectedFile(file)
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      stopCamera()
    }, "image/jpeg", 0.9)
  }

  function onUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const steps = [
    {
      number: "01",
      icon: Camera,
      title: "사진 촬영",
      description: "스마트폰으로 얼굴 사진을 촬영하거나 기존 사진을 업로드하세요.",
      image: "/step-1-photo.png",
    },
    {
      number: "02",
      icon: Brain,
      title: "AI 분석",
      description: "5초 만에 AI가 피부 타입, 트러블, 유수분 밸런스를 정밀 분석합니다.",
      image: "/step-2-ai-analysis.png",
    },
    {
      number: "03",
      icon: Sparkles,
      title: "맞춤 추천",
      description: "분석 결과를 바탕으로 딱 맞는 화장품과 루틴을 추천받으세요.",
      image: "/step-3-recommendation.png",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            3단계로 시작하는 스킨케어
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            복잡한 과정 없이 간단하게 나만의 맞춤 루틴을 만들어보세요.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-primary to-primary opacity-20" />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {step.title === "사진 촬영" ? (
                <button
                  className="w-full bg-card rounded-2xl p-8 border border-border text-center space-y-6 hover:shadow-lg transition-shadow focus:outline-none"
                  onClick={() => setChooserOpen(true)}
                  aria-label="사진 촬영 시작"
                >
                  <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                    <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center relative">
                    <step.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </button>
              ) : (
                <div className="bg-card rounded-2xl p-8 border border-border text-center space-y-6 hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                    <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center relative">
                    <step.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 선택 모달: 카메라/이미지 업로드 */}
          <Dialog open={chooserOpen} onOpenChange={setChooserOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>사진 입력 방법 선택</DialogTitle>
                <DialogDescription>카메라로 촬영하거나, 기기에서 이미지를 선택하세요.</DialogDescription>
              </DialogHeader>
              <div className="flex gap-3">
                <Button type="button" className="bg-primary text-primary-foreground" onClick={() => { setChooserOpen(false); setCameraOpen(true) }}>
                  <Camera className="w-4 h-4 mr-2" /> 카메라 촬영
                </Button>
                <Button type="button" variant="outline" onClick={() => { setChooserOpen(false); setUploadOpen(true) }}>
                  <Upload className="w-4 h-4 mr-2" /> 이미지 업로드
                </Button>
              </div>
              <DialogClose asChild>
                <Button type="button" variant="ghost">취소</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          {/* 카메라 모달 */}
          <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>카메라로 촬영</DialogTitle>
                <DialogDescription>얼굴을 화면 가운데에 맞춘 뒤 촬영하세요.</DialogDescription>
              </DialogHeader>
              {!previewUrl && (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                  </div>
                  <Button type="button" onClick={capturePhoto} className="bg-primary text-primary-foreground">
                    <Camera className="w-4 h-4 mr-2" /> 촬영하기
                  </Button>
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
                    <Button type="button" className="bg-primary text-primary-foreground" onClick={() => { setCameraOpen(false); setAnalyzeOpen(true) }}>분석 시작</Button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </DialogContent>
          </Dialog>

          {/* 이미지 업로드 모달 */}
          <Dialog open={uploadOpen} onOpenChange={(o) => { setUploadOpen(o); if (!o) clearPreview() }}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>이미지 업로드</DialogTitle>
                <DialogDescription>기기에 저장된 얼굴 사진을 선택하세요.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <label className="inline-flex items-center">
                  <Input type="file" accept="image/*" onChange={onUploadChange} className="hidden" />
                  <span className="inline-flex items-center h-9 px-4 rounded-md border bg-background cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" /> 이미지 선택
                  </span>
                </label>
                {previewUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                    <img src={previewUrl} alt="업로드 미리보기" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">닫기</Button>
                  </DialogClose>
                  {previewUrl && (
                    <Button type="button" className="bg-primary text-primary-foreground" onClick={() => { setUploadOpen(false); setAnalyzeOpen(true) }}>분석 시작</Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* AI 분석 모달 */}
          <Dialog open={analyzeOpen} onOpenChange={setAnalyzeOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>AI 분석</DialogTitle>
                <DialogDescription>피부 타입, 트러블, 유수분 밸런스를 5초 내로 분석합니다.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="skin" className="mt-2">
                <TabsList className="mb-4">
                  <TabsTrigger value="skin">피부 타입</TabsTrigger>
                  <TabsTrigger value="trouble">트러블</TabsTrigger>
                  <TabsTrigger value="balance">유수분 밸런스</TabsTrigger>
                </TabsList>

                <TabsContent value="skin" className="mt-0 space-y-3">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">예측 피부 타입: 복합성</span>
                      <span className="text-xs text-muted-foreground">신뢰도 87%</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={87} />
                    </div>
                  </div>
                  <ul className="text-xs text-muted-foreground list-disc pl-5">
                    <li>T존 유분 분포 높음, U존 상대적으로 건조</li>
                    <li>모공 밀도/광택 지표가 복합성 패턴과 일치</li>
                  </ul>
                </TabsContent>

                <TabsContent value="trouble" className="mt-0 space-y-3">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">여드름/홍반 지수</span>
                      <span className="text-xs text-muted-foreground">중간 (지수 62)</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={62} />
                    </div>
                  </div>
                  <ul className="text-xs text-muted-foreground list-disc pl-5">
                    <li>볼/턱 라인 트러블 가능성 높음</li>
                    <li>복합성 유형의 국소 피지 과다와 연관 추정</li>
                  </ul>
                </TabsContent>

                <TabsContent value="balance" className="mt-0 space-y-3">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">유분 지수</span>
                      <span className="text-xs text-muted-foreground">높음 (78)</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={78} />
                    </div>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">수분 지수</span>
                      <span className="text-xs text-muted-foreground">보통 (55)</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={55} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">T존 유분 관리와 U존 보습 보강을 권장합니다.</p>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">닫기</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  )
}
