import { TrendingUp, DollarSign, Target, Calendar } from "lucide-react"

export function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      metric: "85%",
      label: "피부 개선율",
      description: "맞춤 루틴 사용 후 4주 이내",
    },
    {
      icon: DollarSign,
      metric: "평균 30만원",
      label: "연간 절약 금액",
      description: "중복 구매 방지 효과",
    },
    {
      icon: Target,
      metric: "5초",
      label: "피부 진단 시간",
      description: "즉시 결과 확인 가능",
    },
    {
      icon: Calendar,
      metric: "92%",
      label: "루틴 지속률",
      description: "알림 기능 활용 시",
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            실제 사용자들의 변화
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            데이터로 증명된 페이스 캘린더의 효과를 확인하세요.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 border border-border text-center space-y-4 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex w-12 h-12 rounded-full bg-accent/10 items-center justify-center">
                <benefit.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">{benefit.metric}</p>
                <p className="font-semibold text-foreground">{benefit.label}</p>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
