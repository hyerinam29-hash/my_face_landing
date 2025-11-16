import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import ChatWidget from "@/components/chat-widget"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: {
    default: "페이스 캘린더 - AI 기반 맞춤형 스킨케어 루틴",
    template: "%s | 페이스 캘린더",
  },
  description:
    "사진 한 장으로 시작하는 나만의 스킨케어 루틴. AI가 분석한 내 피부, 딱 맞는 화장품만 추천받으세요.",
  openGraph: {
    title: "페이스 캘린더 - AI 기반 맞춤형 스킨케어 루틴",
    description:
      "사진 한 장으로 시작하는 나만의 스킨케어 루틴. AI가 분석한 내 피부, 딱 맞는 화장품만 추천받으세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "페이스 캘린더",
    images: [
      {
        url: "/modern-skincare-app-interface-showing-ai-skin-anal.jpg",
        alt: "Face Calendar App Interface",
      },
    ],
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
          {children}
          <ChatWidget />
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
