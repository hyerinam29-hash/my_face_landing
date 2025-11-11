"use client"

import { useState } from "react"
import { ArrowLeft, Package, Search, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Navigation } from "@/components/navigation"
import { useUser } from "@clerk/nextjs"
import { addToCart } from "@/actions/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

type ProductDetail = {
  name: string
  image: string
  price: string
  volume: string
  purchaseUrl?: string
}

export default function RecommendationPage() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

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
      { name: "저자극 진정 토너", image: "https://images-kr.amoremall.com/products/111650000177/111650000177_01.jpg?1723599939544&format=webp&resize=550:550&shrink=550:550", price: "20,250원", volume: "150ml" },
      { name: "BHA 수렴 토너", image: "https://cosrxinc.jpg3.kr/cosrximg/cosrx/product/vitamin_toner/vitamin_toner_04.jpg", price: "16500원", volume: "280ml" },
    ],
    serum: [
      { name: "히알루론산 수분 세럼", image: "https://cdn.ananti.kr/ej/1001573/prdt/2024/06/03/20240603164009645.303754.jpg", price: "28,000원", volume: "30ml" },
      { name: "니아신아마이드 균일 세럼", image: "https://ecimg.cafe24img.com/pg798b18057154020/repiel/web/product/extra/big/20250708/24702e3cfa2ee7400a06b9b015fef65a.jpg", price: "24,000원", volume: "50ml" },
      { name: "비타민C 브라이트닝 세럼", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0019/A00000019269926ko.jpg?l=ko", price: "14,600원", volume: "40ml" },
      { name: "펩타이드 리프팅 세럼", image: "https://forencos.com/web/product/extra/small/202412/6e89124f324ed60721244b81c8a22cfa.jpg", price: "19,900원", volume: "50ml" },
    ],
    cream: [
      { name: "세라마이드 장벽 크림", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0022/A00000022512706ko.jpg?qt=80", price: "25,000원", volume: "80ml" },
      { name: "라이트 젤 크림", image: "https://cf.product-image.s.zigzag.kr/original/d/2025/3/31/13624_202503310941490892_77854.jpeg", price: "18,000원", volume: "75ml" },
      { name: "리치 밤 크림", image: "https://caudalie-asia.imgix.net/media/catalog/product/1/_/1_premiercru_lacremeriche_caudalie_packshot.jpg?auto=format,compress&cs=srgb&fm=auto&w=1200", price: "170,000원", volume: "50ml" },
      { name: "수분 크림", image: "https://wonjineffect.co.kr/web/product/extra/big/202311/042f4507f1ef7aa46013f925f609acd8.jpg", price: "28,000원", volume: "100ml" },
    ],
    sunscreen: [
      { name: "논나노 무기자차", image: "https://godomall.speedycdn.net/e36a84f0dca2fbb1ee1887a280d33ba4/goods/1000015569/image/add2/1000015569_add2_071.jpg", price: "17,900원", volume: "50ml" },
      { name: "워터프루프 유기자차", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0022/A00000022718806ko.jpg?l=ko", price: "17,500원", volume: "100ml" },
      { name: "톤업 선크림", image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0020/A00000020061459ko.jpg?qt=80", price: "51,000원", volume: "50ml+50ml" },
      { name: "민감성 피부용 선크림", image: "https://fs.dr-g.co.kr/item/4415/4415-add1.jpg?202511011123", price: "16,800원", volume: "35ml" },
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

  async function handlePurchase() {
    if (!selectedProduct) return
    
    // 이미지 링크를 새 창에서 열기
    window.open(selectedProduct.image, '_blank')
    console.log("[purchase] Opening product image link", { image: selectedProduct.image })
  }

  async function handleAddToCart() {
    if (!selectedProduct) return
    
    if (!isLoaded) {
      toast({
        title: "로딩 중",
        description: "잠시만 기다려주세요.",
      })
      return
    }

    if (!user) {
      toast({
        title: "로그인 필요",
        description: "장바구니에 추가하려면 로그인이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart({
        name: selectedProduct.name,
        image: selectedProduct.image,
        price: selectedProduct.price,
        volume: selectedProduct.volume,
        userId: user.id,
      })
      console.log("[cart] Product added to cart", { product: selectedProduct.name, userId: user.id })
      toast({
        title: "장바구니에 추가됨",
        description: `${selectedProduct.name}이(가) 장바구니에 추가되었습니다.`,
      })
      // 장바구니 페이지로 자동 이동
      router.push("/cart")
    } catch (error: any) {
      console.error("[cart] Error adding to cart", error)
      
      // 에러 메시지에 따라 더 자세한 안내 제공
      let errorMessage = error.message || "장바구니 추가 중 오류가 발생했습니다."
      
      // Supabase 테이블이 없는 경우 안내
      if (errorMessage.includes("테이블이 없습니다")) {
        errorMessage += "\n\nSupabase 대시보드에서 'cart' 테이블을 생성해주세요."
      }
      
      toast({
        title: "오류 발생",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsAddingToCart(false)
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
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handlePurchase}
                >
                  구매하기
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  {isAddingToCart ? "추가 중..." : "찜하기"}
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

