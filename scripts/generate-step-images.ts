import { GoogleGenerativeAI } from '@google/generative-ai'
import * as fs from 'fs'
import * as path from 'path'

const prompts = [
  {
    name: 'step-1-photo.png',
    prompt:
      'Nanobanana style illustration: A cheerful person taking a selfie with a smartphone. Soft pastel colors (pink, mint, cream), simple rounded shapes, minimalist kawaii aesthetic. Clean background with subtle decorative elements. Focus on the face capturing moment, friendly and inviting mood.',
  },
  {
    name: 'step-2-ai-analysis.png',
    prompt:
      'Nanobanana style illustration: AI analyzing skin with glowing neural network patterns around a face. Soft pastel colors (blue, lavender, cream), simple rounded shapes, minimalist kawaii aesthetic. Digital elements like floating geometric shapes, sparkles, and scan lines. Modern tech meets cute design.',
  },
  {
    name: 'step-3-recommendation.png',
    prompt:
      'Nanobanana style illustration: Personalized skincare products and routine displayed on screen. Soft pastel colors (peach, mint, cream), simple rounded shapes, minimalist kawaii aesthetic. Cosmetic bottles, charts, and checkmarks. Organized and satisfying feeling.',
  },
]

async function generateImages() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY or GOOGLE_API_KEY')
    process.exit(1)
  }

  console.log('[generate] Starting image generation with Gemini...')
  const genAI = new GoogleGenerativeAI(apiKey)

  // Use Imagen 3 model for image generation
  const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' })

  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  for (const { name, prompt } of prompts) {
    try {
      console.log(`[generate] Creating ${name}...`)
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      })

      const response = await result.response
      const imageData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData

      if (!imageData || !imageData.data) {
        console.error(`[generate] No image data for ${name}`)
        continue
      }

      const buffer = Buffer.from(imageData.data, 'base64')
      const filePath = path.join(publicDir, name)
      fs.writeFileSync(filePath, buffer)
      console.log(`[generate] Saved ${name}`)
    } catch (e: any) {
      console.error(`[generate] Error generating ${name}:`, e.message || e)
    }
  }

  console.log('[generate] Done!')
}

generateImages().catch((e) => {
  console.error('[generate] Fatal error:', e)
  process.exit(1)
})

