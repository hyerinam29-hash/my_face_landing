"use client"

import { useState } from "react"
import { ArrowLeft, Package, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

type ProductDetail = {
  name: string
  image: string
  price: string
  volume: string
}

export default function RecommendationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const productDetails: Record<string, ProductDetail[]> = {
    cleanser: [
      { name: "약산성 폼 클렌저", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0014/A00000014840816ko.jpg?l=ko", price: "21,000원", volume: "250ml" },
      { name: "저자극 젤 클렌저", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0018/A00000018496714ko.jpg?l=ko", price: "19,200원", volume: "200ml" },
      { name: "클렌징 밤", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020247241ko.jpg?l=ko", price: "19,900원", volume: "90ml" },
      { name: "오일 클렌저", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0018/A00000018637710ko.jpg?l=ko", price: "46,000원", volume: "275ml" },
    ],
    toner: [
      { name: "수분 밸런싱 토너", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021279202ko.jpg?l=ko", price: "19,9원", volume: "150ml" },
      { name: "AHA 각질 토너", image: "https://velloaskin.com/web/product/big/202105/6bc581b2f445cfddbb3193ab3eae67aa.jpg", price: "30,000원", volume: "150ml" },
      { name: "저자극 진정 토너", image: "https://amarda.co.kr/web/product/medium/202504/708658eb3e0bd05a278785cdd27de4e1.png", price: "28,000원", volume: "200ml" },
      { name: "BHA 수렴 토너", image: "https://images.unsplash.com/photo-1750085036912-b4bff0ddcd77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHxCSEElMjBza2luY2FyZSUyMHByb2R1Y3R8ZW58MHx8fHwxNzYyODI0NDA1fDA&ixlib=rb-4.1.0&q=80&w=1080", price: "32,000원", volume: "150ml" },
    ],
    serum: [
      { name: "히알루론산 수분 세럼", image: "https://images.unsplash.com/photo-1685137562352-5db6e7495538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUQlOUUlODglRUMlOTUlOEMlRUIlQTMlQTglRUIlQTElQTAlRUMlODIlQjAlMjAlRUMlODglOTglRUIlQjYlODQlMjAlRUMlODQlQjglRUIlOUYlQkMlMjBoeWFsdXJvbmljJTIwYWNpZCUyMHNlcnVtfGVufDB8fHx8MTc2MjgyNDM4MXww&ixlib=rb-4.1.0&q=80&w=1080", price: "35,000원", volume: "50ml" },
      { name: "니아신아마이드 균일 세럼", image: "https://images.unsplash.com/photo-1608326389514-d9d2514e1933?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUIlOEIlODglRUMlOTUlODQlRUMlOEIlQTAlRUMlOTUlODQlRUIlQTclODglRUMlOUQlQjQlRUIlOTMlOUMlMjAlRUElQjclQTAlRUMlOUQlQkMlMjAlRUMlODQlQjglRUIlOUYlQkMlMjBuaWFjaW5hbWlkZSUyMHNlcnVtfGVufDB8fHx8MTc2MjgyNDM4Mnww&ixlib=rb-4.1.0&q=80&w=1080", price: "40,000원", volume: "30ml" },
      { name: "비타민C 브라이트닝 세럼", image: "https://images.unsplash.com/photo-1648139347040-857f024f8da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUIlQjklODQlRUQlODMlODAlRUIlQUYlQkNDJTIwJUVCJUI4JThDJUVCJTlEJUJDJUVDJTlEJUI0JUVEJThBJUI4JUVCJThCJTlEJTIwJUVDJTg0JUI4JUVCJTlGJUJDJTIwdml0YW1pbiUyMEMlMjBzZXJ1bXxlbnwwfHx8fDE3NjI4MjQzODN8MA&ixlib=rb-4.1.0&q=80&w=1080", price: "45,000원", volume: "30ml" },
      { name: "펩타이드 리프팅 세럼", image: "https://images.unsplash.com/photo-1618120508902-c8d05e7985ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUQlOEUlQTklRUQlODMlODAlRUMlOUQlQjQlRUIlOTMlOUMlMjAlRUIlQTYlQUMlRUQlOTQlODQlRUQlOEMlODUlMjAlRUMlODQlQjglRUIlOUYlQkMlMjBwZXB0aWRlJTIwc2VydW18ZW58MHx8fHwxNzYyODI0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080", price: "55,000원", volume: "30ml" },
    ],
    cream: [
      { name: "세라마이드 장벽 크림", image: "https://images.unsplash.com/photo-1728994062543-74a1dc2c9392?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUMlODQlQjglRUIlOUQlQkMlRUIlQTclODglRUMlOUQlQjQlRUIlOTMlOUMlMjAlRUMlOUUlQTUlRUIlQjIlQkQlMjAlRUQlODElQUMlRUIlQTYlQkMlMjBjZXJhbWlkZSUyMGNyZWFtfGVufDB8fHx8MTc2MjgyNDM4Nnww&ixlib=rb-4.1.0&q=80&w=1080", price: "38,000원", volume: "50ml" },
      { name: "라이트 젤 크림", image: "https://images.unsplash.com/photo-1696881694567-cd1a97958fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUIlOUQlQkMlRUMlOUQlQjQlRUQlOEElQjglMjAlRUMlQTAlQTQlMjAlRUQlODElQUMlRUIlQTYlQkMlMjBsaWdodCUyMGdlbCUyMGNyZWFtfGVufDB8fHx8MTc2MjgyNDM4N3ww&ixlib=rb-4.1.0&q=80&w=1080", price: "32,000원", volume: "50ml" },
      { name: "리치 밤 크림", image: "https://images.unsplash.com/photo-1605204768985-81bad5fd9d79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHxuaWdodCUyMGNyZWFtJTIwc2tpbmNhcmV8ZW58MHx8fHwxNzYyODI0NDA2fDA&ixlib=rb-4.1.0&q=80&w=1080", price: "42,000원", volume: "50ml" },
      { name: "수분 크림", image: "https://images.unsplash.com/photo-1638609927040-8a7e97cd9d6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUMlODglOTglRUIlQjYlODQlMjAlRUQlODElQUMlRUIlQTYlQkMlMjBtb2lzdHVyaXppbmclMjBjcmVhbXxlbnwwfHx8fDE3NjI4MjQzODl8MA&ixlib=rb-4.1.0&q=80&w=1080", price: "28,000원", volume: "50ml" },
    ],
    sunscreen: [
      { name: "논나노 무기자차", image: "https://images.unsplash.com/photo-1681916815996-9fdc49fe489a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUIlODUlQkMlRUIlODIlOTglRUIlODUlQjglMjAlRUIlQUMlQjQlRUElQjglQjAlRUMlOUUlOTAlRUMlQjAlQTglMjBtaW5lcmFsJTIwc3Vuc2NyZWVufGVufDB8fHx8MTc2MjgyNDM5MHww&ixlib=rb-4.1.0&q=80&w=1080", price: "25,000원", volume: "50ml" },
      { name: "워터프루프 유기자차", image: "https://images.unsplash.com/photo-1600110116536-7a98859a927c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUMlOUIlOEMlRUQlODQlQjAlRUQlOTQlODQlRUIlQTMlQTglRUQlOTQlODQlMjAlRUMlOUMlQTAlRUElQjglQjAlRUMlOUUlOTAlRUMlQjAlQTglMjB3YXRlcnByb29mJTIwc3Vuc2NyZWVufGVufDB8fHx8MTc2MjgyNDM5MXww&ixlib=rb-4.1.0&q=80&w=1080", price: "28,000원", volume: "50ml" },
      { name: "톤업 선크림", image: "https://images.unsplash.com/photo-1543364148-c43c4e908f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUQlODYlQTQlRUMlOTclODUlMjAlRUMlODQlQTAlRUQlODElQUMlRUIlQTYlQkMlMjB0b25lJTIwdXAlMjBzdW5zY3JlZW58ZW58MHx8fHwxNzYyODI0MzkyfDA&ixlib=rb-4.1.0&q=80&w=1080", price: "30,000원", volume: "50ml" },
      { name: "민감성 피부용 선크림", image: "https://images.unsplash.com/photo-1751821195194-0bbc1caab446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MTU3ODB8MHwxfHNlYXJjaHwxfHwlRUIlQUYlQkMlRUElQjAlOTAlRUMlODQlQjElMjAlRUQlOTQlQkMlRUIlQjYlODAlRUMlOUElQTklMjAlRUMlODQlQTAlRUQlODElQUMlRUIlQTYlQkMlMjBzZW5zaXRpdmUlMjBza2luJTIwc3Vuc2NyZWVufGVufDB8fHx8MTc2MjgyNDM5M3ww&ixlib=rb-4.1.0&q=80&w=1080", price: "32,000원", volume: "50ml" },
    ],
  }

  const categories: { key: string; label: string; items: string[] }[] = [
    { key: "cleanser", label: "클렌저", items: ["약산성 폼 클렌저", "저자극 젤 클렌저", "클렌징 밤", "오일 클렌저"] },
    { key: "toner", label: "토너", items: ["수분 밸런싱 토너", "AHA 각질 토너", "저자극 진정 토너", "BHA 수렴 토너"] },
    { key: "serum", label: "세럼", items: ["히알루론산 수분 세럼", "니아신아마이드 균일 세럼", "비타민C 브라이트닝 세럼", "펩타이드 리프팅 세럼"] },
    { key: "cream", label: "크림", items: ["세라마이드 장벽 크림", "라이트 젤 크림", "리치 밤 크림", "수분 크림"] },
    { key: "sunscreen", label: "선크림", items: ["논나노 무기자차", "워터프루프 유기자차", "톤업 선크림", "민감성 피부용 선크림"] },
  ]

  function handleViewDetails(categoryKey: string, productName: string) {
    const products = productDetails[categoryKey]
    const product = products.find((p) => p.name === productName)
    if (product) {
      setSelectedProduct(product)
      setIsDialogOpen(true)
    }
  }

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase())),
  }))

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
                  맞춤형 화장품 추천
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  진단 결과에 따른 개인화된 화장품 큐레이션을 제공합니다.
                  <br />
                  성분, 브랜드, 가격대별 다차원 필터로 나에게 딱 맞는 제품을 찾아보세요.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">개인화 큐레이션</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Search className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">다차원 필터</span>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">AI 추천</span>
                </div>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="py-12">
            <div className="space-y-4">
              <Label htmlFor="search" className="text-base font-semibold">
                제품 검색
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="제품명, 성분, 브랜드로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="py-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-6">카테고리별 추천</h2>
            <Tabs defaultValue={categories[0].key} className="mt-2">
              <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-5">
                {categories.map((c) => (
                  <TabsTrigger key={c.key} value={c.key} className="text-sm">
                    {c.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {filteredCategories.map((c) => (
                <TabsContent key={c.key} value={c.key} className="mt-0">
                  {c.items.length === 0 ? (
                    <div className="border border-border rounded-xl p-12 text-center bg-muted/30">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-semibold text-foreground mb-2">검색 결과가 없습니다</p>
                      <p className="text-sm text-muted-foreground">다른 검색어로 시도해보세요.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {c.items.map((name, i) => (
                        <div
                          key={i}
                          className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
                          style={{ animationDelay: `${i * 50}ms` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-2">{name}</h3>
                              <p className="text-sm text-muted-foreground mb-4">맞춤형 추천 제품</p>
                            </div>
                            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => handleViewDetails(c.key, name)}
                          >
                            자세히 보기
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </section>
        </div>
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{selectedProduct?.name}</DialogTitle>
            <DialogDescription>맞춤형 추천 제품 상세 정보</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              <div className="aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden bg-muted">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.jpg"
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">가격</p>
                  <p className="text-2xl font-bold text-foreground">{selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">용량</p>
                  <p className="text-2xl font-bold text-foreground">{selectedProduct.volume}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  구매하기
                </Button>
                <Button variant="outline" className="flex-1">
                  찜하기
                </Button>
              </div>
            </div>
          )}

          <DialogClose asChild>
            <Button variant="ghost" className="absolute top-4 right-4">닫기</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </main>
  )
}

