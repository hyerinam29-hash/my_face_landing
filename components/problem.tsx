import { AlertCircle, ShoppingBag, Clock } from "lucide-react"

export function Problem() {
  const problems = [
    {
      icon: AlertCircle,
      title: "내 피부 타입을 모르겠어요",
      description: "수많은 화장품 중 어떤 제품이 내 피부에 맞는지 알 수 없어 시행착오를 반복합니다.",
    },
    {
      icon: ShoppingBag,
      title: "비슷한 제품을 또 샀어요",
      description: "이미 가지고 있는 제품과 유사한 화장품을 중복 구매해 낭비가 발생합니다.",
    },
    {
      icon: Clock,
      title: "루틴 관리가 어려워요",
      description: "바쁜 일상 속에서 언제, 어떤 순서로 제품을 사용해야 할지 헷갈립니다.",
    },
  ]

  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            이런 고민 있으신가요?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            뷰티 정보 과부하 시대, 나에게 맞는 화장품을 찾는 시간은 길고 진단은 어렵습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {problems.map((problem, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
