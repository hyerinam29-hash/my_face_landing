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
    console.error("[cart] Supabase network error", e?.message || e, {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      errorType: e?.name,
      errorStack: e?.stack
    })
    
    // 네트워크 오류인 경우 더 자세한 정보 제공
    if (e?.message?.includes('fetch') || e?.code === 'ENOTFOUND' || e?.code === 'ECONNREFUSED') {
      throw new Error(`Supabase 서버에 연결할 수 없습니다. URL과 네트워크 연결을 확인해주세요. (${e?.message || '네트워크 오류'})`)
    }
    
    throw new Error(`장바구니 추가 중 네트워크 오류가 발생했습니다: ${e?.message || '알 수 없는 오류'}`)
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


