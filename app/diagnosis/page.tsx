"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowLeft, Camera, Upload, RotateCcw, Sparkles, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DiagnosisPage() {
  const { toast } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    skinType: string
    confidence: number
    trouble: string[]
    balance: string
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

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
      toast({
        title: "카메라 접근 실패",
        description: "카메라 권한을 확인해주세요.",
        variant: "destructive",
      })
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
    setAnalysisResult(null)
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
      toast({
        title: "사진 촬영 완료",
        description: "사진이 저장되었습니다.",
      })
    }, "image/jpeg", 0.9)
  }

  function onFileChange(file: File) {
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    stopCamera()
    toast({
      title: "이미지 업로드 완료",
      description: "사진이 업로드되었습니다.",
    })
  }

  async function analyzeSkin() {
    if (!selectedFile) {
      toast({
        title: "사진을 업로드해주세요",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    console.log("selected file:", selectedFile)

    setTimeout(() => {
      setAnalysisResult({
        skinType: "복합성",
        confidence: 87,
        trouble: ["모공", "피지"],
        balance: "유수분 밸런스 양호",
      })
      setIsAnalyzing(false)
      toast({
        title: "분석 완료",
        description: "피부 진단이 완료되었습니다.",
      })
    }, 3000)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      onFileChange(file)
    } else {
      toast({
        title: "이미지 파일만 업로드 가능합니다",
        variant: "destructive",
      })
    }
  }, [])

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
                  AI 피부 진단
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  얼굴 사진을 업로드하면 즉시 피부 타입을 분석합니다.
                  <br />
                  유수분 밸런스, 트러블, 민감도 등을 자동으로 진단하여 맞춤형 케어를 제안합니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">AI 분석</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Camera className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">5초 진단</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">정확도 87%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Upload Section */}
          <section className="py-12">
            {!previewUrl ? (
              <div className="space-y-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`min-h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-6 cursor-pointer transition-all ${
                    isDragging
                      ? "bg-primary/5 border-primary"
                      : "bg-muted/50 border-border hover:bg-muted hover:border-primary/50"
                  }`}
                >
                  <Upload className={`w-16 h-16 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-semibold text-foreground">
                      {isDragging ? "여기에 파일을 놓으세요" : "클릭하거나 드래그하여 업로드"}
                    </p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, GIF 최대 10MB</p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        startCamera()
                      }}
                      variant="outline"
                      className="bg-background"
                    >
                      <Camera className="w-4 h-4 mr-2" /> 카메라로 촬영
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onFileChange(file)
                    }}
                    className="hidden"
                  />
                </div>

                {streamRef.current && (
                  <div className="space-y-4">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                      <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" onClick={capturePhoto} className="bg-primary text-primary-foreground">
                        <Camera className="w-4 h-4 mr-2" /> 촬영하기
                      </Button>
                      <Button type="button" variant="outline" onClick={stopCamera}>
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-xl overflow-hidden shadow-lg max-h-96">
                  <img src={previewUrl} alt="미리보기" className="w-full h-full object-cover" />
                  <button
                    onClick={clearPreview}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      clearPreview()
                      startCamera()
                    }}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> 다시 찍기
                  </Button>
                  <Button type="button" onClick={analyzeSkin} className="bg-primary text-primary-foreground flex-1">
                    <Sparkles className="w-4 h-4 mr-2" /> AI 진단 시작
                  </Button>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </section>

          {/* Results Section */}
          <section className="py-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">진단 결과</h2>
            {isAnalyzing ? (
              <div className="space-y-4">
                <Progress value={66} className="h-2" />
                <p className="text-center text-muted-foreground">AI가 피부를 분석하고 있습니다...</p>
              </div>
            ) : analysisResult ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">피부 타입</h3>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-2">{analysisResult.skinType}</p>
                  <Progress value={analysisResult.confidence} className="h-2 mb-2" />
                  <p className="text-sm text-muted-foreground">신뢰도 {analysisResult.confidence}%</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">트러블</h3>
                  </div>
                  <div className="space-y-2">
                    {analysisResult.trouble.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">유수분 밸런스</h3>
                  </div>
                  <p className="text-lg text-foreground">{analysisResult.balance}</p>
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-xl p-12 text-center bg-muted/30">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">진단 결과가 없습니다</p>
                <p className="text-sm text-muted-foreground">사진을 업로드하고 AI 진단을 시작해주세요.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

