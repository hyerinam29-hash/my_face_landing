import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 px-4">
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-2xl",
          },
        }}
        signInUrl="/login"
        afterSignUpUrl="/"
      />
    </div>
  )
}

