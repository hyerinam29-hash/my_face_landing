'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

export type ChatMessage = { role: 'user' | 'model' | 'system'; content: string }

export async function createGeminiStream(
  messages: ChatMessage[],
): Promise<ReadableStream<Uint8Array>> {
  console.log('[gemini] stream start', { count: messages?.length ?? 0 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('[gemini] missing GEMINI_API_KEY')
    throw new Error('Missing GEMINI_API_KEY')
  }

  const modelId = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
  const genAI = new GoogleGenerativeAI(apiKey)

  // 상담 챗봇 역할 고정 시스템 프롬프트
  const SYSTEM_PROMPT = [
    '너는 페이스 캘린더의 상담 챗봇이야.',
    '역할: 사용자의 피부 고민을 친절하고 명확하게 파악하고, 사진 없이도 질문을 통해 정보를 수집해 적절한 루틴/제품/다음 단계 안내를 제공한다.',
    '원칙:',
    '- 모르면 솔직히 모른다고 말하고, 필요한 정보를 질문으로 수집한다.',
    '- 과도한 의학적 진단/치료 주장 금지. 전문 상담이 필요한 경우는 적절히 안내한다.',
    '- 답변은 간결한 문장과 불릿을 섞어 체계적으로 제공한다.',
  ].join('\n')

  const model = genAI.getGenerativeModel({
    model: modelId,
    // Google AI Studio SDK는 systemInstruction 문자열을 허용
    systemInstruction: SYSTEM_PROMPT,
  })

  // Convert our chat messages to Gemini-compatible contents
  const contents = (messages || [])
    .filter((m) => m && m.content?.trim() && m.role !== 'system')
    .map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  const result = await model.generateContentStream({ contents })
  const encoder = new TextEncoder()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
        console.log('[gemini] stream end')
      } catch (e) {
        console.error('[gemini] stream error', e)
        controller.error(e)
      }
    },
  })
}



