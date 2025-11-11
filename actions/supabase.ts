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


