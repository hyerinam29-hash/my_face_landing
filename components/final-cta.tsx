import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance px-4 sm:px-0">
            AI가 설계한 나만의 스킨케어 루틴,
            <br />
            지금 시작하세요
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
            사진 한 장으로 3초 만에 피부를 진단하고, 딱 맞는 화장품을 추천받으세요.
            <br />
            7일 무료 체험으로 모든 기능을 경험해보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 px-4 sm:px-0">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base group w-full sm:w-auto">
              <span className="animate-pulse">내 피부 진단 지금 시작하기</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground pt-4 px-4 sm:px-0">
            신용카드 등록 없이 시작 · 7일 무료 체험 · 언제든 해지 가능
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">F</span>
            </div>
            <span className="font-serif text-lg sm:text-xl font-semibold text-foreground">페이스 캘린더</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              고객센터
            </a>
          </div>
        </div>

        <div className="text-center md:text-left mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Face Calendar. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}
