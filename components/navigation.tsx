import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">F</span>
            </div>
            <span className="font-serif text-xl lg:text-2xl font-semibold text-foreground">페이스 캘린더</span>
          </Link>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-4 lg:gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                기능
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                사용방법
              </a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                요금제
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
                FAQ
              </a>
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <Link href="/login">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    로그인
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
