"use client"

import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function PaymentFailPage() {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get("code")
  const errorMessage = searchParams.get("message")
  const orderId = searchParams.get("orderId")

  // 에러 코드에 따른 사용자 친화적 메시지
  function getErrorMessage(code: string | null): string {
    if (!code) return "결제가 실패했습니다."
    
    switch (code) {
      case "PAY_PROCESS_CANCELED":
        return "결제가 취소되었습니다."
      case "PAY_PROCESS_ABORTED":
        return "결제가 중단되었습니다."
      case "REJECT_CARD_COMPANY":
        return "카드사에서 결제를 거절했습니다. 카드 정보를 확인해주세요."
      default:
        return errorMessage || "결제 처리 중 오류가 발생했습니다."
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20 space-y-6">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="font-serif text-3xl font-bold text-foreground">결제 실패</h2>
            <p className="text-lg text-muted-foreground">
              {getErrorMessage(errorCode)}
            </p>
            {errorCode && (
              <p className="text-sm text-muted-foreground">
                오류 코드: {errorCode}
              </p>
            )}
            {orderId && (
              <p className="text-sm text-muted-foreground">
                주문번호: {orderId}
              </p>
            )}
            <div className="pt-6 space-x-4">
              <Link href="/cart">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  장바구니로 돌아가기
                </Button>
              </Link>
              <Link href="/recommendation">
                <Button variant="outline">제품 둘러보기</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

