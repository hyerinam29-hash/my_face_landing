'use client'

import { useState } from 'react'

type Message = { role: 'user' | 'model'; content: string }

// 텍스트를 가독성 있게 포맷팅하는 함수
function formatMessage(content: string): React.ReactNode {
  if (!content) return content

  // 줄바꿈 처리
  const lines = content.split('\n')
  const formatted: React.ReactNode[] = []

  lines.forEach((line, index) => {
    // 빈 줄 처리
    if (line.trim() === '') {
      formatted.push(<div key={`empty-${index}`} className="h-2" />)
      return
    }

    // 리스트 항목 처리 (1. 2. 3. 또는 - * • 등)
    const listMatch = line.match(/^(\d+\.\s|[-*•]\s)(.+)/)
    if (listMatch) {
      formatted.push(
        <div key={`list-${index}`} className="flex items-start gap-2 my-1.5">
          <span className="text-primary mt-0.5 flex-shrink-0">•</span>
          <span className="flex-1 leading-relaxed">{formatInlineText(listMatch[2])}</span>
        </div>
      )
      return
    }

    // 일반 텍스트 줄
    formatted.push(
      <div key={`line-${index}`} className="my-1.5 leading-relaxed">
        {formatInlineText(line)}
      </div>
    )
  })

  return <div className="space-y-0.5">{formatted}</div>
}

// 인라인 텍스트 포맷팅 (볼드, 이탤릭 등)
function formatInlineText(text: string): React.ReactNode {
  if (!text) return text

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let keyIndex = 0

  // 볼드 처리 (**텍스트**)
  const boldRegex = /\*\*(.+?)\*\*/g
  let match

  while ((match = boldRegex.exec(text)) !== null) {
    // 볼드 앞의 텍스트
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    // 볼드 텍스트
    parts.push(
      <strong key={`bold-${keyIndex++}`} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    )
    lastIndex = match.index + match[0].length
  }

  // 남은 텍스트
  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex)
    // 이탤릭 처리 (*텍스트*, 볼드가 아닌 경우만)
    const italicRegex = /\*(.+?)\*/g
    let italicLastIndex = 0
    let italicMatch

    while ((italicMatch = italicRegex.exec(remaining)) !== null) {
      // 이탤릭 앞의 텍스트
      if (italicMatch.index > italicLastIndex) {
        parts.push(remaining.substring(italicLastIndex, italicMatch.index))
      }
      // 이탤릭 텍스트
      parts.push(
        <em key={`italic-${keyIndex++}`} className="italic">
          {italicMatch[1]}
        </em>
      )
      italicLastIndex = italicMatch.index + italicMatch[0].length
    }

    // 남은 텍스트
    if (italicLastIndex < remaining.length) {
      parts.push(remaining.substring(italicLastIndex))
    }
  }

  return parts.length > 0 ? <>{parts}</> : text
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [useWeb, setUseWeb] = useState(false)
  const [welcomed, setWelcomed] = useState(false)

  async function send() {
    if (!input.trim() || loading) return
    const next: Message[] = [...messages, { role: 'user' as const, content: input }]
    setMessages(next)
    setInput('')
    setLoading(true)
    console.log('[chat] send start')

    try {
      let sources: any[] | undefined
      if (useWeb) {
        console.log('[chat] web search start')
        const searchRes = await fetch('/api/search/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: input, maxResults: 5 }),
        })
        const data = searchRes.ok ? await searchRes.json() : { results: [] }
        sources = Array.isArray(data?.results) ? data.results : []
        console.log('[chat] web search done', (sources ?? []).length)
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, sources }),
      })

      if (!res.ok || !res.body) {
        console.error('[chat] response error', res.status)
        setLoading(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let modelText = ''
      setMessages((prev) => [...prev, { role: 'model', content: '' }])

      // Stream read loop
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        modelText += chunk
        console.log('[chat] chunk', chunk.length)
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'model', content: modelText }
          return copy
        })
      }

      setLoading(false)
      console.log('[chat] send end')
    } catch (e) {
      console.error('[chat] send error', e)
      setLoading(false)
    }
  }

  function handleToggle() {
    setOpen((prev) => {
      const next = !prev
      if (next && !welcomed) {
        // 페이지 톤에 맞춘 간단한 환영 메시지(1회)
        setMessages([{ role: 'model', content: '안녕하세요! 페이스 캘린더 상담 챗봇입니다. 피부 고민이나 목표를 말씀해 주세요. 성함,나이,성별, 피부 타입, 예산 등도 함께 알려주시면 더 정확히 도와드릴게요.' }])
        setWelcomed(true)
      }
      return next
    })
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-lg ring-1 ring-[var(--color-ring)] hover:opacity-90"
        aria-label="Open Chat"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[416px] h-[calc(45vh+3cm)] bg-[var(--color-popover)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col">
          <div className="p-4 border-b border-[var(--color-border)]">
            <div className="text-base font-semibold">페이스 캘린더 상담</div>
            <div className="text-xs text-gray-500 mt-0.5">피부 목표를 알려주시면 맞춤 가이드를 드려요</div>
          </div>
          <div className="p-4 space-y-3 overflow-auto flex-1 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                {m.role === 'user' ? (
                  <span className="inline-block bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-3 py-2 rounded-2xl max-w-[80%] break-words">
                    {m.content}
                  </span>
                ) : (
                  <div className="inline-block bg-[var(--color-card)] border border-[var(--color-border)] text-foreground px-4 py-3 rounded-2xl max-w-[85%] break-words">
                    {formatMessage(m.content)}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <span className="inline-block bg-[var(--color-card)] border border-[var(--color-border)] text-muted-foreground px-3 py-2 rounded-2xl">답변 작성 중...</span>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-[var(--color-border)] flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={useWeb} onChange={(e) => setUseWeb(e.target.checked)} />
              웹 검색 사용 (출처 포함)
            </label>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="피부 고민을 입력하세요 (예: 여드름 흉터 관리)"
              className="flex-1 border border-[var(--color-input)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
            />
            <button
              onClick={send}
              disabled={loading}
              className="px-3 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-md disabled:opacity-50"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  )
}


