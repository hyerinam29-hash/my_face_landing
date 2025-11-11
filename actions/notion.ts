"use server"

import { getNotionHeaders, NOTION_DATABASE_ID } from "@/lib/notion"

export async function submitLead(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()

  if (!name || !phone || !email) {
    throw new Error("이름, 이메일, 전화번호를 모두 입력해주세요.")
  }

  const body = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      name: { title: [{ text: { content: name } }] },
      "phone number": { phone_number: phone },
      email: { email },
    },
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[submitLead] Notion error:", res.status, errorText)
    throw new Error("노션 저장 중 오류가 발생했습니다.")
  }
}

// Start free trial lead using explicit args (for client-side calls)
export async function createTrialLead({ name, email, phone }: { name: string; email: string; phone: string }): Promise<void> {
  const body = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      name: { title: [{ text: { content: name } }] },
      "phone number": { phone_number: phone },
      email: { email },
    },
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[createTrialLead] Notion error:", res.status, errorText)
    throw new Error("무료 체험 등록 중 오류가 발생했습니다.")
  }
}

// Chat log to Notion (reuses same Notion config)
export async function logChatMessage({ role, content }: { role: 'user' | 'assistant'; content: string }): Promise<void> {
  const title = `${role.toUpperCase()} 메시지`
  const body = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      name: { title: [{ text: { content: title } }] },
      message: { rich_text: [{ text: { content } }] },
      role: { rich_text: [{ text: { content: role } }] },
    },
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[logChatMessage] Notion error:", res.status, errorText)
  }
}

// Save consultation lead (name/email/phone) to Notion
export async function saveConsultLead({ name, email, phone }: { name: string; email: string; phone: string }): Promise<void> {
  const body = {
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      name: { title: [{ text: { content: name } }] },
      email: { email },
      "phone number": { phone_number: phone },
    },
  }

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[saveConsultLead] Notion error:", res.status, errorText)
    throw new Error("상담 정보 저장 중 오류가 발생했습니다.")
  }
}

// List consultation leads (first 20)
export async function listConsultLeads(): Promise<{ id: string; name: string; email?: string; phone?: string }[]> {
  const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
    method: "POST",
    headers: getNotionHeaders(),
    body: JSON.stringify({ page_size: 20, sorts: [{ timestamp: "last_edited_time", direction: "descending" }] }),
    cache: "no-store",
  })
  if (!res.ok) {
    const errorText = await res.text().catch(() => "")
    console.error("[listConsultLeads] Notion error:", res.status, errorText)
    return []
  }
  const data = await res.json() as any
  const results = (data.results || []) as any[]
  return results.map((p) => {
    const props = p.properties || {}
    const title = props.name?.title?.[0]?.plain_text || "(이름 없음)"
    const email = props.email?.email as string | undefined
    const phone = props["phone number"]?.phone_number as string | undefined
    return { id: p.id, name: title, email, phone }
  })
}


