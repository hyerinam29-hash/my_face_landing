import { NextRequest } from 'next/server'
import { tavilySearch } from '@/actions/tavily'

export async function POST(req: NextRequest) {
  try {
    const { query, maxResults = 5 } = await req.json()
    console.log('[api/search/trigger] request', { query })
    const results = await tavilySearch(String(query ?? ''), Number(maxResults))
    return Response.json({ results })
  } catch (e) {
    console.error('[api/search/trigger] error', e)
    return new Response('Bad Request', { status: 400 })
  }
}


