import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitLead } from "@/actions/supabase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 lg:pt-20">
      {/* Decorative botanical elements */}
      <div className="absolute top-20 left-8 opacity-10">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-primary"></svg>
      </div>

      <div className="absolute bottom-32 right-12 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="text-primary">
          <circle cx="50" cy="30" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 38L50 70" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M50 50C50 50 35 45 30 50C25 55 28 62 35 62C42 62 50 55 50 50Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M50 50C50 50 65 45 70 50C75 55 72 62 65 62C58 62 50 55 50 50Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <p className="text-sm font-medium text-primary tracking-wide uppercase">AI 스킨케어 루틴</p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                사진 한 장으로 시작하는
                <span className="block">나만의 스킨케어 루틴</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                AI가 분석한 내 피부, 딱 맞는 화장품만 추천받으세요.
                <br />
                중복 구매는 이제 그만, 효율적인 루틴 관리를 시작하세요.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base group">
                    <span className="animate-pulse">7일 무료로 시작하기</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>7일 무료 체험 시작</DialogTitle>
                    <DialogDescription>
                      이름, 이메일, 전화번호를 입력해 무료 체험을 시작하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <form action={submitLead} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="signup-name">이름</Label>
                      <Input id="signup-name" name="name" placeholder="홍길동" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-email">이메일</Label>
                      <Input id="signup-email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="signup-phone">전화번호</Label>
                      <Input id="signup-phone" name="phone" placeholder="010-1234-5678" required />
                    </div>
                    <DialogClose asChild>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        시작하기
                      </Button>
                    </DialogClose>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">10,000+</p>
                <p className="text-sm text-muted-foreground">활성 사용자</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.9/5</p>
                <p className="text-sm text-muted-foreground">평균 만족도</p>
              </div>
            </div>
          </div>

          {/* Right content - Product mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 rounded-[3rem] blur-3xl" />
            <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border shadow-2xl">
              <img
                src="/modern-skincare-app-interface-showing-ai-skin-anal.jpg"
                alt="Face Calendar App Interface"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
