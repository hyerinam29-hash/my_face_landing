import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'R80xFlZ6LAb6S_1JUev9gK_kmWhEdSKPifQNDmMobi4'

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
  console.log('[download] Downloading new step-1 image from Unsplash...')

  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Search for Asian woman taking selfie three angles portrait skincare
  const query = 'asian woman taking selfie portrait front side profile angle skincare beauty clean'
  const filename = 'step-1-photo-new.jpg'

  try {
    console.log(`[download] Searching for: ${query}`)
    const imageUrl = await searchUnsplashImage(query, 'landscape')

    if (!imageUrl) {
      console.error(`[download] No image found`)
      process.exit(1)
    }

    const filepath = path.join(publicDir, filename)
    console.log(`[download] Downloading ${filename}...`)
    await downloadImage(imageUrl, filepath)
    console.log(`[download] Saved ${filename}`)
    
    // Rename to replace old image
    const targetPath = path.join(publicDir, 'step-1-photo.jpg')
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath)
    }
    fs.renameSync(filepath, targetPath)
    console.log(`[download] Replaced step-1-photo.jpg`)
  } catch (e: any) {
    console.error(`[download] Error:`, e.message || e)
    process.exit(1)
  }

  console.log('[download] Done!')
}

main().catch((e) => {
  console.error('[download] Fatal error:', e)
  process.exit(1)
})




