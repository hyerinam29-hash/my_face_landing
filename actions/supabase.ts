"use server"

// Insert lead into Supabase via REST API using environment variables.
// Required env: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL, and any of ANON_KEY/NEXT_PUBLIC_ANON/SERVICE_ROLE

export async function submitLead(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()

  if (!name || !email || !phone) {
    throw new Error("이름, 이메일, 전화번호를 모두 입력해주세요.")
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[lead] Supabase env missing", {
      hasUrl: !!supabaseUrl,
      hasAnon: !!(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    })
    throw new Error(
      "서버 환경변수가 누락되었습니다. SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_URL, 그리고 ANON_KEY 또는 SERVICE_ROLE_KEY를 설정해주세요."
    )
  }

  // Send only required fields
  const payload = { name, email, phone }
  console.log("[lead] inserting to Supabase", { name, email, phone })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    })
  } catch (e: any) {
    console.error("[lead] Supabase network error", e?.message || e)
    throw new Error("Supabase 연결 중 네트워크 오류가 발생했습니다.")
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[lead] Supabase insert error", res.status, errorText)
    throw new Error("무료 체험 등록 중 오류가 발생했습니다.")
  }

  const data = await res.json().catch(() => null)
  console.log("[lead] Supabase insert success", { id: Array.isArray(data) ? data[0]?.id : undefined })
}

// 장바구니에 제품 추가
export async function addToCart(product: {
  name: string
  image: string
  price: string
  volume: string
  userId: string
}): Promise<void> {
  const { name, image, price, volume, userId } = product

  if (!name || !image || !userId) {
    throw new Error("제품 정보와 사용자 정보가 필요합니다.")
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[cart] Supabase env missing")
    throw new Error("서버 환경변수가 누락되었습니다.")
  }

  const payload = { name, image, price, volume, user_id: userId }
  console.log("[cart] adding to cart", { name, userId })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    })
  } catch (e: any) {
    const debugEnabled = process.env.DEBUG_SUPABASE === 'true' || process.env.NODE_ENV !== 'production'
    const maskedKey = supabaseKey ? `${supabaseKey.slice(0, 6)}...` : ''
    const isHttps = typeof supabaseUrl === 'string' ? supabaseUrl.startsWith('https://') : false
    const debugContext = {
      url: supabaseUrl || '(empty)',
      isHttps,
      hasKey: !!supabaseKey,
      keyPrefix: maskedKey,
      errorType: e?.name,
      errorCode: e?.code,
    }

    console.error("[cart] Supabase network error", e?.message || e, debugContext)

    // 사용자 친화적 메시지 + 선택적 디버그 부가정보
    let userMessage =
      `Supabase 서버에 연결할 수 없습니다. URL과 네트워크 연결을 확인해주세요. (${e?.message || '네트워크 오류'})`

    if (!supabaseUrl) {
      userMessage += " 환경변수(SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_URL)가 비어있습니다."
    }
    if (!supabaseKey) {
      userMessage += " 환경변수(SUPABASE_ANON_KEY 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY)가 비어있습니다."
    }
    if (!isHttps && supabaseUrl) {
      userMessage += " URL은 반드시 https로 시작해야 합니다."
    }

    if (debugEnabled) {
      userMessage += ` [debug:${JSON.stringify(debugContext)}]`
    }

    // 대표적인 네트워크 코드를 별도로 처리
    if (e?.message?.includes('fetch') || e?.code === 'ENOTFOUND' || e?.code === 'ECONNREFUSED' || e?.code === 'CERT_HAS_EXPIRED') {
      throw new Error(userMessage)
    }

    throw new Error(`장바구니 추가 중 네트워크 오류가 발생했습니다: ${e?.message || '알 수 없는 오류'}` + (debugEnabled ? ` [debug:${JSON.stringify(debugContext)}]` : ''))
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[cart] Supabase insert error", res.status, errorText)
    
    // 테이블이 없는 경우 (404 또는 406)
    if (res.status === 404 || res.status === 406) {
      throw new Error("장바구니 테이블이 없습니다. Supabase에 'cart' 테이블을 생성해주세요.")
    }
    
    // 권한 오류 (401, 403)
    if (res.status === 401 || res.status === 403) {
      throw new Error("권한 오류가 발생했습니다. Supabase API 키를 확인해주세요.")
    }
    
    throw new Error(`장바구니 추가 중 오류가 발생했습니다. (상태 코드: ${res.status})`)
  }

  const data = await res.json().catch(() => null)
  console.log("[cart] Supabase insert success", { id: Array.isArray(data) ? data[0]?.id : undefined })
}

// 사용자의 장바구니 조회
export async function getCart(userId: string): Promise<any[]> {
  if (!userId) {
    return []
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[cart] Supabase env missing")
    return []
  }

  console.log("[cart] fetching cart for user", { userId })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/cart?user_id=eq.${userId}&order=created_at.desc`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    })
  } catch (e: any) {
    console.error("[cart] Supabase network error", e?.message || e)
    return []
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[cart] Supabase fetch error", res.status, errorText)
    return []
  }

  const data = await res.json().catch(() => [])
  console.log("[cart] Supabase fetch success", { count: Array.isArray(data) ? data.length : 0 })
  return Array.isArray(data) ? data : []
}

// 장바구니에서 제품 삭제
export async function removeFromCart(cartId: string): Promise<void> {
  if (!cartId) {
    throw new Error("장바구니 ID가 필요합니다.")
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[cart] Supabase env missing")
    throw new Error("서버 환경변수가 누락되었습니다.")
  }

  console.log("[cart] removing from cart", { cartId })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/cart?id=eq.${cartId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    })
  } catch (e: any) {
    console.error("[cart] Supabase network error", e?.message || e)
    throw new Error("장바구니 삭제 중 네트워크 오류가 발생했습니다.")
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[cart] Supabase delete error", res.status, errorText)
    throw new Error("장바구니 삭제 중 오류가 발생했습니다.")
  }

  console.log("[cart] Supabase delete success")
}

// 주문 임시 저장 (결제 요청 전)
export async function savePendingOrder(data: {
  userId: string
  orderId: string
  amount: number
  cartItems: any[]
}): Promise<void> {
  const { userId, orderId, amount, cartItems } = data

  if (!userId || !orderId || !amount || !cartItems || cartItems.length === 0) {
    throw new Error("주문 정보가 올바르지 않습니다.")
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[order] Supabase env missing")
    throw new Error("서버 환경변수가 누락되었습니다.")
  }

  const payload = {
    user_id: userId,
    order_id: orderId,
    amount: amount,
    cart_items: cartItems
  }
  console.log("[order] saving pending order", { orderId, userId, amount })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/pending_orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    })
  } catch (e: any) {
    console.error("[order] Supabase network error", e?.message || e)
    throw new Error("주문 임시 저장 중 네트워크 오류가 발생했습니다.")
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[order] Supabase insert error", res.status, errorText)
    throw new Error(`주문 임시 저장 중 오류가 발생했습니다. (상태 코드: ${res.status})`)
  }

  const pendingInsert = await res.json().catch(() => null)
  console.log("[order] Supabase pending order saved", { id: Array.isArray(pendingInsert) ? pendingInsert[0]?.id : undefined })
}

// 임시 주문 정보 조회 (금액 검증용)
export async function getPendingOrder(orderId: string): Promise<{
  userId: string
  orderId: string
  amount: number
  cartItems: any[]
} | null> {
  if (!orderId) {
    return null
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[order] Supabase env missing")
    return null
  }

  console.log("[order] fetching pending order", { orderId })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/pending_orders?order_id=eq.${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    })
  } catch (e: any) {
    console.error("[order] Supabase network error", e?.message || e)
    return null
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[order] Supabase fetch error", res.status, errorText)
    return null
  }

  const data = await res.json().catch(() => [])
  if (Array.isArray(data) && data.length > 0) {
    const order = data[0]
    return {
      userId: order.user_id,
      orderId: order.order_id,
      amount: order.amount,
      cartItems: order.cart_items
    }
  }
  return null
}

// 임시 주문 삭제 (결제 승인 성공 후)
export async function deletePendingOrder(orderId: string): Promise<void> {
  if (!orderId) {
    throw new Error("주문번호가 필요합니다.")
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[order] Supabase env missing")
    throw new Error("서버 환경변수가 누락되었습니다.")
  }

  console.log("[order] deleting pending order", { orderId })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/pending_orders?order_id=eq.${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`
      }
    })
  } catch (e: any) {
    console.error("[order] Supabase network error", e?.message || e)
    throw new Error("임시 주문 삭제 중 네트워크 오류가 발생했습니다.")
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[order] Supabase delete error", res.status, errorText)
    throw new Error("임시 주문 삭제 중 오류가 발생했습니다.")
  }

  console.log("[order] Supabase pending order deleted")
}

// 최종 주문 정보 저장 (결제 승인 성공 후)
export async function saveOrder(data: {
  userId: string
  orderId: string
  paymentKey: string
  totalAmount: number
  items: any[]
}): Promise<void> {
  const { userId, orderId, paymentKey, totalAmount, items } = data

  if (!userId || !orderId || !paymentKey || !totalAmount || !items || items.length === 0) {
    throw new Error("주문 정보가 올바르지 않습니다.")
  }

  const sanitize = (v: string | undefined) => (v || "").trim().replace(/,+$/, "")
  const supabaseUrl = sanitize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = sanitize(
    process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  if (!supabaseUrl || !supabaseKey) {
    console.error("[order] Supabase env missing")
    throw new Error("서버 환경변수가 누락되었습니다.")
  }

  const payload = {
    user_id: userId,
    order_id: orderId,
    payment_key: paymentKey,
    total_amount: totalAmount,
    status: "DONE",
    items: items
  }
  console.log("[order] saving final order", { orderId, userId, paymentKey, totalAmount })

  let res: Response
  try {
    res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify(payload)
    })
  } catch (e: any) {
    console.error("[order] Supabase network error", e?.message || e)
    throw new Error("주문 저장 중 네트워크 오류가 발생했습니다.")
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[order] Supabase insert error", res.status, errorText)
    throw new Error(`주문 저장 중 오류가 발생했습니다. (상태 코드: ${res.status})`)
  }

  const orderInsert = await res.json().catch(() => null)
  console.log("[order] Supabase order saved", { id: Array.isArray(orderInsert) ? orderInsert[0]?.id : undefined })
}


