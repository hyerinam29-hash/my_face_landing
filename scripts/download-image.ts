import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

async function downloadImageFromUrl(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol
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

async function main() {
  const imageUrl = process.argv[2]
  
  if (!imageUrl) {
    console.error('Usage: npx tsx download-image.ts <image-url>')
    console.error('Example: npx tsx download-image.ts https://example.com/image.jpg')
    process.exit(1)
  }

  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const targetPath = path.join(publicDir, 'step-1-photo.jpg')
  
  // Backup old image if exists
  if (fs.existsSync(targetPath)) {
    const backupPath = path.join(publicDir, 'step-1-photo-backup.jpg')
    fs.copyFileSync(targetPath, backupPath)
    console.log('[download] Backed up old image to step-1-photo-backup.jpg')
  }

  try {
    console.log(`[download] Downloading from: ${imageUrl}`)
    await downloadImageFromUrl(imageUrl, targetPath)
    console.log(`[download] Successfully saved to step-1-photo.jpg`)
  } catch (e: any) {
    console.error(`[download] Error:`, e.message || e)
    // Restore backup if download failed
    if (fs.existsSync(path.join(publicDir, 'step-1-photo-backup.jpg'))) {
      fs.copyFileSync(path.join(publicDir, 'step-1-photo-backup.jpg'), targetPath)
      console.log('[download] Restored backup image')
    }
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('[download] Fatal error:', e)
  process.exit(1)
})




