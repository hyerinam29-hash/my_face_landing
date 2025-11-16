"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"
import { getPendingOrder, deletePendingOrder, saveOrder } from "@/actions/supabase"
import { approvePayment } from "@/actions/toss"
import { removeFromCart } from "@/actions/supabase"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { toast } = useToast()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push("/login")
      return
    }

    handlePaymentSuccess()
  }, [isLoaded, user])

  async function handlePaymentSuccess() {
    try {
      // 쿼리 파라미터에서 결제 정보 추출
      const paymentKey = searchParams.get("paymentKey")
      const orderId = searchParams.get("orderId")
      const amountParam = searchParams.get("amount")

      if (!paymentKey || !orderId || !amountParam) {
        throw new Error("결제 정보가 올바르지 않습니다.")
      }

      const amount = parseInt(amountParam)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("결제 금액이 올바르지 않습니다.")
      }

      console.log("[payment] Processing payment success", { orderId, paymentKey, amount })

      // 임시 주문 정보 조회
      const pendingOrder = await getPendingOrder(orderId)
      if (!pendingOrder) {
        throw new Error("주문 정보를 찾을 수 없습니다.")
      }

      // 금액 검증 (보안)
      if (pendingOrder.amount !== amount) {
        console.error("[payment] Amount mismatch", {
          saved: pendingOrder.amount,
          received: amount
        })
        throw new Error("결제 금액이 일치하지 않습니다. 결제가 취소되었습니다.")
      }

      // 결제 승인 API 호출
      const approvalResult = await approvePayment({
        paymentKey,
        orderId,
        amount
      })

      console.log("[payment] Payment approved", approvalResult)

      // 최종 주문 정보 저장
      await saveOrder({
        userId: user!.id,
        orderId: orderId,
        paymentKey: approvalResult.paymentKey,
        totalAmount: approvalResult.totalAmount,
        items: pendingOrder.cartItems
      })

      // 임시 주문 삭제
      await deletePendingOrder(orderId)

      // 장바구니 비우기
      for (const item of pendingOrder.cartItems) {
        try {
          await removeFromCart(item.id)
        } catch (e) {
          console.error("[payment] Error removing cart item", item.id, e)
        }
      }

      setStatus("success")
      toast({
        title: "결제 완료",
        description: "결제가 성공적으로 완료되었습니다.",
      })
    } catch (error: any) {
      console.error("[payment] Payment processing error", error)
      setStatus("error")
      setErrorMessage(error.message || "결제 처리 중 오류가 발생했습니다.")
      toast({
        title: "결제 오류",
        description: error.message || "결제 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
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

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {status === "loading" && (
            <div className="text-center py-20 space-y-6">
              <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
              <h2 className="font-serif text-2xl font-bold text-foreground">결제 처리 중...</h2>
              <p className="text-muted-foreground">잠시만 기다려주세요.</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-20 space-y-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="font-serif text-3xl font-bold text-foreground">결제가 완료되었습니다</h2>
              <p className="text-lg text-muted-foreground">
                주문이 성공적으로 처리되었습니다. 감사합니다!
              </p>
              <div className="pt-6 space-x-4">
                <Link href="/recommendation">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    쇼핑 계속하기
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">홈으로 가기</Button>
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-20 space-y-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="font-serif text-3xl font-bold text-foreground">결제 처리 오류</h2>
              <p className="text-lg text-muted-foreground">{errorMessage}</p>
              <div className="pt-6 space-x-4">
                <Link href="/cart">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    장바구니로 돌아가기
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">홈으로 가기</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

