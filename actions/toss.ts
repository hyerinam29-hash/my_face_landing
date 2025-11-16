"use server"

// 토스 페이먼츠 결제 승인 API 호출
export async function approvePayment(data: {
  paymentKey: string
  orderId: string
  amount: number
}): Promise<{
  paymentKey: string
  orderId: string
  status: string
  totalAmount: number
  approvedAt: string
}> {
  const { paymentKey, orderId, amount } = data

  if (!paymentKey || !orderId || !amount) {
    throw new Error("결제 승인 정보가 올바르지 않습니다.")
  }

  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) {
    console.error("[toss] Secret key missing")
    throw new Error("토스 페이먼츠 시크릿 키가 설정되지 않았습니다.")
  }

  // 시크릿 키 base64 인코딩 (시크릿 키 뒤에 : 추가)
  const encodedSecret = Buffer.from(`${secretKey}:`).toString("base64")
  const authHeader = `Basic ${encodedSecret}`

  console.log("[toss] Approving payment", { orderId, amount })

  let res: Response
  try {
    res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount
      })
    })
  } catch (e: any) {
    console.error("[toss] Network error", e?.message || e)
    throw new Error("결제 승인 중 네트워크 오류가 발생했습니다.")
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    console.error("[toss] Payment approval error", res.status, errorData)
    
    const errorCode = errorData.code || "UNKNOWN_ERROR"
    const errorMessage = errorData.message || "결제 승인 중 오류가 발생했습니다."
    
    throw new Error(`${errorMessage} (코드: ${errorCode})`)
  }

  const paymentData = await res.json()
  console.log("[toss] Payment approved", { 
    orderId: paymentData.orderId, 
    status: paymentData.status,
    totalAmount: paymentData.totalAmount 
  })

  return {
    paymentKey: paymentData.paymentKey,
    orderId: paymentData.orderId,
    status: paymentData.status,
    totalAmount: paymentData.totalAmount,
    approvedAt: paymentData.approvedAt || new Date().toISOString()
  }
}

