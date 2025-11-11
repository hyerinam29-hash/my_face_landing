import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'R80xFlZ6LAb6S_1JUev9gK_kmWhEdSKPifQNDmMobi4'

interface ImageQuery {
  filename: string
  query: string
  orientation?: 'landscape' | 'portrait' | 'squarish'
}

const imageQueries: ImageQuery[] = [
  {
    filename: 'step-1-photo.jpg',
    query: 'woman taking selfie smartphone mirror skincare beauty',
    orientation: 'landscape',
  },
  {
    filename: 'step-2-ai-analysis.jpg',
    query: 'ai artificial intelligence face recognition technology skin analysis',
    orientation: 'landscape',
  },
  {
    filename: 'step-3-recommendation.jpg',
    query: 'skincare products cosmetics routine organized beauty shelf',
    orientation: 'landscape',
  },
]

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`))
          return
        }
        const fileStream = fs.createWriteStream(filepath)
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve()
        })
        fileStream.on('error', reject)
      })
      .on('error', reject)
  })
}

async function searchUnsplashImage(query: string, orientation?: string): Promise<string | null> {
  const params = new URLSearchParams({
    query,
    per_page: '1',
    orientation: orientation || 'landscape',
  })

  const url = `https://api.unsplash.com/search/photos?${params.toString()}`

  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        },
        (response) => {
          let data = ''
          response.on('data', (chunk) => {
            data += chunk
          })
          response.on('end', () => {
            try {
              const json = JSON.parse(data)
              const imageUrl = json.results?.[0]?.urls?.regular
              resolve(imageUrl || null)
            } catch (e) {
              reject(e)
            }
          })
        }
      )
      .on('error', reject)
  })
}

async function main() {
  console.log('[download] Starting real image download from Unsplash...')

  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  for (const { filename, query, orientation } of imageQueries) {
    try {
      console.log(`[download] Searching for: ${query}`)
      const imageUrl = await searchUnsplashImage(query, orientation)

      if (!imageUrl) {
        console.error(`[download] No image found for: ${query}`)
        continue
      }

      const filepath = path.join(publicDir, filename)
      console.log(`[download] Downloading ${filename}...`)
      await downloadImage(imageUrl, filepath)
      console.log(`[download] Saved ${filename}`)
    } catch (e: any) {
      console.error(`[download] Error for ${filename}:`, e.message || e)
    }
  }

  console.log('[download] Done!')
}

main().catch((e) => {
  console.error('[download] Fatal error:', e)
  process.exit(1)
})

