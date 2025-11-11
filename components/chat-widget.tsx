'use client'

import { useState } from 'react'

type Message = { role: 'user' | 'model'; content: string }

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
          <div className="p-4 space-y-2 overflow-auto flex-1 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span
                  className={
                    m.role === 'user'
                      ? 'inline-block bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-3 py-2 rounded-2xl'
                      : 'inline-block bg-[var(--color-card)] border border-[var(--color-border)] text-foreground px-3 py-2 rounded-2xl'
                  }
                >
                  {m.content}
                </span>
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


