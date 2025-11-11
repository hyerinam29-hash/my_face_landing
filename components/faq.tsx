"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
  const faqs = [
    {
      question: "무료 체험은 어떻게 시작하나요?",
      answer:
        "회원가입 후 바로 7일 무료 체험을 시작할 수 있습니다. 신용카드 등록 없이 모든 기능을 체험할 수 있으며, 체험 기간 동안 언제든 해지 가능합니다.",
    },
    {
      question: "AI 피부 진단은 정확한가요?",
      answer:
        "10만 건 이상의 피부 데이터로 학습된 AI 모델을 사용하며, 피부과 전문의의 검증을 거쳤습니다. 다만 정확한 진단을 위해서는 밝은 조명에서 정면 사진을 촬영하는 것을 권장합니다.",
    },
    {
      question: "중복 화장품 감지는 어떻게 작동하나요?",
      answer:
        "등록하신 화장품의 성분을 분석하여 유사도가 80% 이상인 제품을 자동으로 감지합니다. 새로운 제품을 추가할 때 중복 여부를 즉시 알려드립니다.",
    },
    {
      question: "언제든 해지할 수 있나요?",
      answer:
        "네, 언제든 해지 가능합니다. 해지 시 다음 결제일부터 요금이 청구되지 않으며, 현재 결제 기간이 끝날 때까지는 모든 기능을 계속 사용하실 수 있습니다.",
    },
    {
      question: "개인정보는 안전하게 보호되나요?",
      answer:
        "모든 데이터는 암호화되어 안전하게 저장되며, 개인정보 보호법을 준수합니다. 사진 데이터는 분석 후 즉시 삭제되며, 제3자와 공유되지 않습니다.",
    },
  ]

  return (
    <section id="faq" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            자주 묻는 질문
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            궁금하신 점이 있으신가요? 가장 많이 받는 질문들을 모았습니다.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
