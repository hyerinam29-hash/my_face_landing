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
      { 
        name: "약산성 폼 클렌저", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0014/A00000014840816ko.jpg?l=ko", 
        price: "21,000원", 
        volume: "250ml",
        // 구매 링크를 여기에 추가하세요 (예: purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000148408&t_page=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80&t_click=%EA%B2%80%EC%83%89%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_search_name=%EC%95%BD%EC%82%B0%EC%84%B1%20%ED%8F%BC%20%ED%81%B4%EB%A0%8C%EC%A0%80&t_number=5&dispCatNo=1000001001000010001&trackingCd=Result_5")
      },
      { 
        name: "저자극 젤 클렌저", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0018/A00000018496714ko.jpg?l=ko", 
        price: "19,200원", 
        volume: "200ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000184967&t_page=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80&t_click=%EA%B2%80%EC%83%89%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_search_name=%EC%A0%80%EC%9E%90%EA%B7%B9%20%EC%A0%A4%20%ED%81%B4%EB%A0%8C%EC%A0%80&t_number=4&dispCatNo=1000001001000010001&trackingCd=Result_4"
      },
      { 
        name: "클렌징 밤", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0020/A00000020247241ko.jpg?l=ko", 
        price: "19,900원", 
        volume: "90ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000202472&t_page=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80&t_click=%EA%B2%80%EC%83%89%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_search_name=%ED%81%B4%EB%A0%8C%EC%A7%95%20%EB%B0%A4&t_number=2&dispCatNo=1000001001000040002&trackingCd=Result_2"
      },
      { 
        name: "오일 클렌저", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0018/A00000018637710ko.jpg?l=ko", 
        price: "46,000원", 
        volume: "275ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000186377&t_page=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80&t_click=%EA%B2%80%EC%83%89%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_search_name=%EC%98%A4%EC%9D%BC%20%ED%81%B4%EB%A0%8C%EC%A0%80&t_number=8&dispCatNo=1000001000300050001&trackingCd=Result_8"
      },
    ],
    toner: [
      { 
        name: "수분 밸런싱 토너", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0021/A00000021279202ko.jpg?l=ko", 
        price: "19,9원", 
        volume: "150ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000212792&t_page=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80&t_click=%EA%B2%80%EC%83%89%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_search_name=%EC%88%98%EB%B6%84%20%EB%B0%B8%EB%9F%B0%EC%8B%B1%20%ED%86%A0%EB%84%88&t_number=1&dispCatNo=1000001000100130001&trackingCd=Result_1"
      },
      { 
        name: "AHA 각질 토너", 
        image: "https://velloaskin.com/web/product/big/202105/6bc581b2f445cfddbb3193ab3eae67aa.jpg", 
        price: "30,000원", 
        volume: "150ml",
        // purchaseUrl: "https://velloaskin.com/product/%EB%AC%B8%EC%A0%9C%EC%84%B1-%EC%97%AC%EB%93%9C%EB%A6%84-%ED%94%BC%EB%B6%80-%EA%B3%A0%EB%AF%BC-ac-control-%EB%B8%94%EB%A0%88%EB%AF%B8%EC%89%AC-aha-bha-%ED%86%A0%EB%84%88-150ml/47/"
      },
      { 
        name: "저자극 진정 토너", 
        image: "https://images-kr.amoremall.com/products/111650000177/111650000177_01.jpg?1723599939544&format=webp&resize=550:550&shrink=550:550", 
        price: "20,250원", 
        volume: "150ml",
        // purchaseUrl: "https://www.amoremall.com/kr/ko/product/detail?onlineProdSn=17949&srsltid=AfmBOoppMIPbuzDDRGl_C1NdWQj-MA8mtLqX_A_Kr8fUHMTyU2KwZyhH&onlineProdCode=111650000177"
      },
      { 
        name: "BHA 수렴 토너", 
        image: "https://www.masksheets.com/cdn/shop/files/image-2025-04-17T123726.286_1024x1024.png?v=1762459929", 
        price: "23,897원", 
        volume: "150ml",
        // purchaseUrl: "https://www.masksheets.com/ko/products/aha-bha-pha-30-days-miracle-toner?srsltid=AfmBOoriE68N6P0x0V1PVtV63T3Nsxx64CHOgPx68F1GAYH9-pEHsH4N"
      },
    ],
    serum: [
      { 
        name: "히알루론산 수분 세럼", 
        image: "https://cdn.ananti.kr/ej/1001573/prdt/2024/06/03/20240603164009645.303754.jpg", 
        price: "28,000원", 
        volume: "30ml",
        // purchaseUrl: "https://eternaljourney.ananti.kr/goods/755511"
      },
      { 
        name: "니아신아마이드 균일 세럼", 
        image: "https://ecimg.cafe24img.com/pg798b18057154020/repiel/web/product/extra/big/20250708/24702e3cfa2ee7400a06b9b015fef65a.jpg", 
        price: "24,000원", 
        volume: "50ml",
        // purchaseUrl: "https://repiel.co.kr/product/%EC%8B%9C%EC%B9%B4-%EB%82%98%EC%9D%B4%EC%95%84%EC%8B%A0-%ED%8F%AC%EC%96%B4-%EC%84%B8%EB%9F%BC/14/"
      },
      { 
        name: "비타민C 브라이트닝 세럼", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/550/10/0000/0019/A00000019269926ko.jpg?l=ko", 
        price: "14,600원", 
        volume: "40ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000192699&utm_source=google&utm_medium=shopping_search&utm_campaign=onpro_emnet_googlepmax_25_0101_1231&utm_term=&_CAD=google_pmax&gad_source=1&gad_campaignid=19622638980&gbraid=0AAAAADKpDR5r2OUo8Uw43AI_Hg25E4o3T&gclid=CjwKCAiA2svIBhB-EiwARWDPjq11fr5486RfqEORrfmzG4Vc3Haiu2TFJ14Sgu1OFZ2LT1KaH4k5ERoCxLkQAvD_BwE"
      },
      { 
        name: "펩타이드 리프팅 세럼", 
        image: "https://forencos.com/web/product/extra/small/202412/6e89124f324ed60721244b81c8a22cfa.jpg", 
        price: "19,900원", 
        volume: "50ml",
        // purchaseUrl: "https://forencos.com/product/%ED%8E%A9%ED%83%80%EC%9D%B4%EB%93%9C-%EB%A6%AC%EB%8D%B4%EC%8B%9C%ED%8C%8C%EC%9E%89-%ED%8F%AC%EC%96%B4-%EB%A6%AC%ED%94%84%ED%8C%85-%EC%95%B0%ED%94%8C/449/?srsltid=AfmBOoo7TFgHwSzMjjQ3afe3r9WEVI8Ln9tJf1Vtum6ok1QFTL7hWhmC"
      },
    ],
    cream: [
      { 
        name: "세라마이드 장벽 크림", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0022/A00000022512706ko.jpg?qt=80", 
        price: "25,000원", 
        volume: "80ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000225127"
      },
      { 
        name: "라이트 젤 크림", 
        image: "https://cafe24img.poxo.com/medicube0/web/product/extra/big/202411/1fa40f95de68823aed4a5637b9adc42f.jpg", 
        price: "15,500원", 
        volume: "300ml",
        // purchaseUrl: "https://themedicube.co.kr/product/detail.html?product_no=1987&gad_source=1&gad_campaignid=23230765190&gbraid=0AAAAABTO0oRVvvxyN56dEgTYCl3vrCP4k&gclid=CjwKCAiA2svIBhB-EiwARWDPjrZ8KztefvCbmBXj5JFUqNziFsu1HIEbH4JT-VT4X8i0Hp7mqS29HBoCvVgQAvD_BwE"
      },
      { 
        name: "리치 밤 크림", 
        image: "https://caudalie-asia.imgix.net/media/catalog/product/1/_/1_premiercru_lacremeriche_caudalie_packshot.jpg?auto=format,compress&cs=srgb&fm=auto&w=1200", 
        price: "170,000원", 
        volume: "50ml",
        // purchaseUrl: "https://kr.caudalie.com/p/459NA/premier-cru-the-rich-cream-50ml.html"
      },
      { 
        name: "수분 크림", 
        image: "https://cdn.ananti.kr/ej/1001048/prdt/2024/11/12/20241112192113104.147727.jpg", 
        price: "19,500원", 
        volume: "300ml",
        // purchaseUrl: "https://eternaljourney.ananti.kr/goods/170241"
      },
    ],
    sunscreen: [
      { 
        name: "논나노 무기자차", 
        image: "https://godomall.speedycdn.net/e36a84f0dca2fbb1ee1887a280d33ba4/goods/1000015569/image/add2/1000015569_add2_071.jpg", 
        price: "17,900원", 
        volume: "50ml",
        // purchaseUrl: "http://www.arvvien.com/goods/goods_view.php?goodsNo=1000015569"
      },
      { 
        name: "워터프루프 유기자차", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/400/10/0000/0022/A00000022932103ko.png?l=ko&SF=webp", 
        price: "17,500원", 
        volume: "100ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000227188&t_page=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80&t_click=%EA%B2%80%EC%83%89%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_search_name=%EC%9C%A0%EA%B8%B0%EC%9E%90%EC%B0%A8%2F%EB%8C%80%EC%9A%A9%EB%9F%89&t_number=1&dispCatNo=1000001001100060001&trackingCd=Result_1"
      },
      { 
        name: "톤업 선크림", 
        image: "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0020/A00000020061459ko.jpg?qt=80", 
        price: "51,000원", 
        volume: "50ml+50ml",
        // purchaseUrl: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000200614&t_page=%ED%86%B5%ED%95%A9%EA%B2%80%EC%83%89%EA%B2%B0%EA%B3%BC%ED%8E%98%EC%9D%B4%EC%A7%80&t_click=%EA%B2%80%EC%83%89%EC%83%81%ED%92%88%EC%83%81%EC%84%B8&t_search_name=%ED%86%A4%EC%97%85%20%EC%84%A0%ED%81%AC%EB%A6%BC&t_number=54&dispCatNo=1000001001100060001&trackingCd=Result_31_60"
      },
      { 
        name: "민감성 피부용 선크림", 
        image: "https://fs.dr-g.co.kr/item/4415/4415-add1.jpg?202511011123", 
        price: "16,800원", 
        volume: "35ml",
        // purchaseUrl: "https://www.dr-g.co.kr/item/4415?srsltid=AfmBOooac8RYbLAQreJr_GpDegpv1GF9cjp66OmD7PwSqBuym1cKcquL"
      },
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

  // 검색어가 있을 때 모든 제품에서 검색
  const searchResults: Array<{ categoryKey: string; categoryLabel: string; product: ProductDetail }> = []
  if (searchQuery.trim()) {
    Object.entries(productDetails).forEach(([categoryKey, products]) => {
      const category = categories.find((c) => c.key === categoryKey)
      products.forEach((product) => {
        if (product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          searchResults.push({
            categoryKey,
            categoryLabel: category?.label || categoryKey,
            product,
          })
        }
      })
    })
  }

  // 검색어가 없을 때는 카테고리별로 필터링
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: searchQuery.trim()
      ? cat.items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
      : cat.items,
  }))

  // 이미지 URL에서 구매 링크 생성 함수
  function getPurchaseUrl(product: ProductDetail): string {
    // purchaseUrl이 있으면 사용
    if (product.purchaseUrl) {
      return product.purchaseUrl
    }

    // 올리브영 이미지 URL인 경우 구매 링크 생성
    if (product.image.includes('oliveyoung.co.kr')) {
      // 이미지 URL에서 제품 ID 추출 (예: A00000014840816)
      const match = product.image.match(/A\d{13}/)
      if (match) {
        const productId = match[0]
        return `https://www.oliveyoung.co.kr/store/goods/getPrdDetail.do?prdCd=${productId}`
      }
    }

    // 기본값: 이미지 URL을 구매 링크로 사용
    return product.image
  }

  async function handlePurchase() {
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
        description: "구매하려면 로그인이 필요합니다.",
        variant: "destructive",
      })
      return
    }

    // 장바구니에 추가
    setIsAddingToCart(true)
    try {
      await addToCart({
        name: selectedProduct.name,
        image: selectedProduct.image,
        price: selectedProduct.price,
        volume: selectedProduct.volume,
        userId: user.id,
      })
      console.log("[purchase] Product added to cart for purchase", { 
        product: selectedProduct.name, 
        userId: user.id 
      })
      
      toast({
        title: "장바구니에 추가됨",
        description: `${selectedProduct.name}이(가) 장바구니에 추가되었습니다. 결제 페이지로 이동합니다.`,
      })
      
      // 장바구니 페이지로 이동
      router.push("/cart")
    } catch (error: any) {
      console.error("[purchase] Error adding to cart", error)
      toast({
        title: "오류 발생",
        description: error.message || "장바구니 추가 중 오류가 발생했습니다.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsAddingToCart(false)
    }
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
            <Link href="/#features" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
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
            {searchQuery.trim() ? (
              // 검색 결과 표시
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  검색 결과: "{searchQuery}" ({searchResults.length}개)
                </h2>
                {searchResults.length === 0 ? (
                  <div className="border border-border rounded-xl p-12 text-center bg-muted/30">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-2">검색 결과가 없습니다</p>
                    <p className="text-sm text-muted-foreground">다른 검색어로 시도해보세요.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((result, i) => (
                      <div
                        key={`${result.categoryKey}-${result.product.name}-${i}`}
                        className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <div className="aspect-square w-full mb-4 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={result.product.image}
                            alt={result.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.jpg"
                            }}
                          />
                        </div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {result.categoryLabel}
                            </span>
                            <h3 className="font-semibold text-foreground mt-2 mb-1">{result.product.name}</h3>
                            <p className="text-sm font-medium text-primary mb-1">{result.product.price}</p>
                            <p className="text-xs text-muted-foreground">{result.product.volume}</p>
                          </div>
                          <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={() => {
                            setSelectedProduct(result.product)
                            setIsDialogOpen(true)
                          }}
                        >
                          자세히 보기
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // 카테고리별 추천 (검색어가 없을 때)
              <div>
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
              </div>
            )}
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
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? "처리 중..." : "구매하기"}
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

