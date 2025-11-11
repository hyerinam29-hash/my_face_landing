"use client"

import { useState, useCallback, useRef } from "react"
import { ArrowLeft, Upload, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function DuplicatePage() {
  const { toast } = useToast()
  const [dupPreviewUrl, setDupPreviewUrl] = useState<string | null>(null)
  const [dupSelectedFile, setDupSelectedFile] = useState<File | null>(null)
  const [productName, setProductName] = useState("")
  const [duplicates, setDuplicates] = useState<{ name: string; score: number }[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onDupFileChange(file: File) {
    if (!file) return
    if (dupPreviewUrl) URL.revokeObjectURL(dupPreviewUrl)
    setDupSelectedFile(file)
    setDupPreviewUrl(URL.createObjectURL(file))
    const guessed = file.name.replace(/\.[^/.]+$/, "")
    if (!productName) setProductName(guessed)
    toast({
      title: "이미지 업로드 완료",
      description: "제품 사진이 업로드되었습니다.",
    })
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
      toast({
        title: "제품명을 입력해주세요",
        description: "분석을 위해 제품명이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setTimeout(() => {
      const results = registry
        .map((name) => ({ name, score: jaccardSimilarity(name, target) }))
        .filter((r) => r.score >= 0.45 || normalize(nameIncludes(target, r.name) ? target : "") !== "")
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)

      setDuplicates(results)
      setIsAnalyzing(false)

      if (results.length === 0) {
        toast({
          title: "중복 제품 없음",
          description: "유사한 제품을 찾을 수 없습니다.",
        })
      } else {
        toast({
          title: "분석 완료",
          description: `${results.length}개의 유사 제품을 찾았습니다.`,
        })
      }
    }, 1000)
  }

  function nameIncludes(a: string, b: string) {
    const A = normalize(a)
    const B = normalize(b)
    return A.length > 0 && (A.includes(B) || B.includes(A))
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
      onDupFileChange(file)
    } else {
      toast({
        title: "이미지 파일만 업로드 가능합니다",
        variant: "destructive",
      })
    }
  }, [])

  function getSimilarityColor(score: number) {
    if (score >= 0.8) return "bg-red-500"
    if (score >= 0.6) return "bg-orange-500"
    return "bg-yellow-500"
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
                  중복 화장품 감지
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  제품 사진을 업로드하고 제품명을 입력하면, 등록된 제품 목록과 유사한 항목을 자동으로 찾아드립니다.
                  <br />
                  중복 구매를 방지하고 성분 유사도를 확인하세요.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">자동 감지</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Upload className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">사진 인식</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">유사도 분석</span>
                </div>
              </div>
            </div>
          </section>

          {/* Upload Section */}
          <section className="py-12">
            <div className="space-y-6">
              <div>
                <Label htmlFor="product-name" className="text-base font-semibold mb-2 block">
                  제품명
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="product-name"
                    placeholder="예: 라로슈포제 시카플라스트 밤 B5"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={analyzeDuplicates}
                    disabled={isAnalyzing || !productName.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                  >
                    {isAnalyzing ? "분석 중..." : "분석하기"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">제품명을 입력하면 자동으로 유사 제품을 찾습니다.</p>
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">제품 사진 업로드</Label>
                {!dupPreviewUrl ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`min-h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                      isDragging
                        ? "bg-primary/5 border-primary"
                        : "bg-muted/50 border-border hover:bg-muted hover:border-primary/50"
                    }`}
                  >
                    <Upload className={`w-12 h-12 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold text-foreground">
                        {isDragging ? "여기에 파일을 놓으세요" : "클릭하거나 드래그하여 업로드"}
                      </p>
                      <p className="text-sm text-muted-foreground">PNG, JPG, GIF 최대 10MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) onDupFileChange(file)
                      }}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden shadow-lg max-h-96">
                    <img src={dupPreviewUrl} alt="제품 사진" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        if (dupPreviewUrl) URL.revokeObjectURL(dupPreviewUrl)
                        setDupPreviewUrl(null)
                        setDupSelectedFile(null)
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="py-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">분석 결과</h2>
            {isAnalyzing ? (
              <div className="space-y-4">
                <Progress value={50} className="h-2" />
                <p className="text-center text-muted-foreground">제품을 분석하고 있습니다...</p>
              </div>
            ) : duplicates.length === 0 ? (
              <div className="border border-border rounded-xl p-12 text-center bg-muted/30">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">분석 결과가 없습니다</p>
                <p className="text-sm text-muted-foreground">제품명을 조금 더 구체적으로 입력해 보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {duplicates.map((d, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-foreground flex-1">{d.name}</h3>
                      <span className="text-sm font-bold text-foreground ml-4">{(d.score * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={d.score * 100} className={`h-2 ${getSimilarityColor(d.score)}`} />
                    <p className="text-xs text-muted-foreground mt-2">
                      {d.score >= 0.8 ? "매우 높은 유사도" : d.score >= 0.6 ? "높은 유사도" : "보통 유사도"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

