"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ShoppingCart, Trash2, Package, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { useUser } from "@clerk/nextjs"
import { getCart, removeFromCart } from "@/actions/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

type CartItem = {
  id: string
  name: string
  image: string
  price: string
  volume: string
  created_at: string
}

export default function CartPage() {
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isLoaded && user) {
      loadCart()
    } else if (isLoaded && !user) {
      setIsLoading(false)
    }
  }, [isLoaded, user])

  async function loadCart() {
    if (!user) return

    setIsLoading(true)
    try {
      const items = await getCart(user.id)
      console.log("[cart] Loaded cart items", { count: items.length, userId: user.id })
      setCartItems(items as CartItem[])
    } catch (error: any) {
      console.error("[cart] Error loading cart", error)
      toast({
        title: "오류 발생",
        description: "장바구니를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRemove(itemId: string) {
    setRemovingIds((prev) => new Set(prev).add(itemId))
    try {
      await removeFromCart(itemId)
      console.log("[cart] Removed item from cart", { itemId })
      setCartItems((prev) => prev.filter((item) => item.id !== itemId))
      toast({
        title: "제품 삭제됨",
        description: "장바구니에서 제품이 삭제되었습니다.",
      })
    } catch (error: any) {
      console.error("[cart] Error removing item", error)
      toast({
        title: "오류 발생",
        description: error.message || "제품 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  // 가격 문자열에서 숫자만 추출하는 함수
  function parsePrice(priceString: string): number {
    const cleaned = priceString.replace(/[^0-9]/g, '')
    return parseInt(cleaned) || 0
  }

  // 총 금액 계산
  function calculateTotal(): number {
    return cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
  }

  // 개별 제품 구매하기 (외부 링크)
  function handlePurchaseItem(imageUrl: string) {
    window.open(imageUrl, '_blank')
    console.log("[purchase] Opening product image link", { image: imageUrl })
  }

  // 전체 결제하기
  function handleCheckout() {
    if (cartItems.length === 0) {
      toast({
        title: "장바구니가 비어있습니다",
        description: "결제할 제품이 없습니다.",
        variant: "destructive",
      })
      return
    }

    const total = calculateTotal()
    console.log("[checkout] Starting checkout", { 
      itemCount: cartItems.length, 
      totalPrice: total 
    })

    toast({
      title: "결제 준비 중",
      description: `총 ${total.toLocaleString()}원의 제품을 결제합니다.`,
    })

    // 실제 결제 시스템 연동은 여기에 구현
    // 예: 결제 페이지로 이동, 결제 API 호출 등
    // 현재는 시뮬레이션
    setTimeout(() => {
      toast({
        title: "결제 완료",
        description: "결제가 완료되었습니다. 감사합니다!",
      })
      // 결제 완료 후 장바구니 비우기
      setCartItems([])
    }, 2000)
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center py-20">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-20 space-y-4">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto" />
              <h2 className="font-serif text-2xl font-bold text-foreground">로그인이 필요합니다</h2>
              <p className="text-muted-foreground">장바구니를 보려면 로그인해주세요.</p>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  로그인하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <section className="py-12">
            <Link href="/recommendation" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>추천 페이지로 돌아가기</span>
            </Link>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                장바구니
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                찜한 제품 목록입니다.
              </p>
            </div>
          </section>

          {/* Cart Items */}
          <section className="py-12">
            {isLoading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">로딩 중...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="border border-border rounded-xl p-12 text-center bg-muted/30">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">장바구니가 비어있습니다</p>
                <p className="text-sm text-muted-foreground mb-6">제품을 찜해보세요.</p>
                <Link href="/recommendation">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    제품 둘러보기
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="aspect-square w-full md:w-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.jpg"
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">가격: </span>
                            <span className="font-semibold text-foreground">{item.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">용량: </span>
                            <span className="font-semibold text-foreground">{item.volume}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col md:flex-row gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handlePurchaseItem(item.image)}
                        >
                          바로 구매
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingIds.has(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {removingIds.has(item.id) ? "삭제 중..." : "삭제"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Checkout Section */}
          {!isLoading && cartItems.length > 0 && (
            <section className="py-12 border-t border-border">
              <div className="bg-card border border-border rounded-xl p-6 shadow-md">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">결제 정보</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">제품 수</span>
                    <span className="font-semibold text-foreground">{cartItems.length}개</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-foreground">총 결제 금액</span>
                    <span className="font-bold text-primary text-2xl">
                      {calculateTotal().toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    결제하기
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  결제하기 버튼을 클릭하면 결제가 진행됩니다.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}

