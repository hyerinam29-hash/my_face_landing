import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function Pricing() {
  const basicFeatures = ["맞춤형 제품 추천", "시간별 루틴 알림", "신제품 정보 제공"]

  const premiumFeatures = [
    "무제한 피부 진단",
    "맞춤형 제품 추천",
    "중복 화장품 감지",
    "시간별 루틴 알림",
    "신제품 정보 우선 제공",
    "전문가 상담 (월 1회)",
  ]

  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            지금 시작하세요
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            7일 무료 체험으로 모든 기능을 경험해보세요. 신용카드 등록 없이 시작할 수 있습니다.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-muted/30 rounded-3xl p-8 lg:p-10 border border-border/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/30 cursor-pointer">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">기본 플랜</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">₩9,900</span>
                  <span className="text-muted-foreground">/월</span>
                </div>
                <p className="text-muted-foreground">부가세 포함 · 언제든 해지 가능</p>
              </div>

              <div className="space-y-4">
                <p className="font-semibold text-foreground">포함된 기능:</p>
                <ul className="space-y-3">
                  {basicFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 pt-4">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  7일 무료로 시작하기
                </Button>
                <p className="text-center text-xs text-muted-foreground">무료 체험 기간 동안 언제든 해지 가능합니다</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 rounded-3xl p-8 lg:p-10 border-2 border-primary relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/80 cursor-pointer">
            <div className="absolute top-0 right-0 bg-gradient-to-br from-accent to-primary text-white px-6 py-2 rounded-bl-3xl font-semibold text-sm">
              인기
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">프리미엄 플랜</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-foreground">₩19,900</span>
                  <span className="text-muted-foreground">/월</span>
                </div>
                <p className="text-muted-foreground">부가세 포함 · 언제든 해지 가능</p>
              </div>

              <div className="space-y-4">
                <p className="font-semibold text-foreground">포함된 기능:</p>
                <ul className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 pt-4">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  7일 무료로 시작하기
                </Button>
                <p className="text-center text-xs text-muted-foreground">무료 체험 기간 동안 언제든 해지 가능합니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
