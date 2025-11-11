import { NextRequest } from 'next/server'
import { createGeminiStream, type ChatMessage } from '@/actions/gemini'

export async function POST(req: NextRequest) {
  try {
    const { messages, sources } = (await req.json()) as {
      messages: ChatMessage[]
      sources?: { title: string; url: string; snippet: string }[]
    }
    console.log('[api/chat] request', {
      messages: messages?.length ?? 0,
      sources: sources?.length ?? 0,
    })

    const headers = {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    }

    if (sources?.length) {
      console.log('[api/chat] mode:web', { count: sources.length })
      const block = sources
        .map((r, i) => `[${i + 1}] ${r.title}\n${r.url}\n${r.snippet}`)
        .join('\n\n')
      const guide: ChatMessage = {
        role: 'system',
        content:
          '아래 웹 검색 결과를 근거로 한국어로 간결하고 체계적으로 답하세요.\n' +
          '- 과도한 의학적 단정 금지, 불확실하면 추가 질문.\n' +
          '- 마지막에 출처 링크를 [1] 형식으로 나열.',
      }
      const lastUser = messages[messages.length - 1]
      const userAug: ChatMessage = {
        role: 'user',
        content: `사용자 질문:\n${lastUser?.content}\n\n웹 검색 결과:\n${block}`,
      }
      const hist = messages.filter((x) => x.role !== 'system')
      const stream = await createGeminiStream([...hist.slice(0, -1), userAug, guide])
      return new Response(stream, { headers })
    }

    const stream = await createGeminiStream(messages)
    return new Response(stream, { headers })
  } catch (e) {
    console.error('[api/chat] error', e)
    return new Response('Internal Error', { status: 500 })
  }
}



