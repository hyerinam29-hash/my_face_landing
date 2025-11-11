'use server'

export type TavilyItem = { title: string; url: string; snippet: string }

export async function tavilySearch(
  query: string,
  maxResults: number = 5,
): Promise<TavilyItem[]> {
  console.log('[tavily] start', { query, maxResults })
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    console.error('[tavily] missing key')
    return []
  }

  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: maxResults,
        include_answer: false,
        search_depth: 'basic',
      }),
      // @ts-expect-error - Node 18+ only
      signal: (AbortSignal as any)?.timeout?.(8000) ?? undefined,
    })

    if (!res.ok) {
      console.error('[tavily] failed', res.status)
      return []
    }
    const data = await res.json()
    const items: TavilyItem[] = (data?.results ?? [])
      .slice(0, maxResults)
      .map((r: any) => ({
        title: r.title,
        url: r.url,
        snippet: r.content || r.snippet || '',
      }))
    console.log('[tavily] ok', { count: items.length })
    return items
  } catch (e) {
    console.error('[tavily] error', e)
    return []
  }
}


