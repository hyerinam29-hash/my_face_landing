-- 주문 임시 저장 테이블 (결제 요청 전)
CREATE TABLE IF NOT EXISTS public.pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  cart_items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 최종 주문 테이블 (결제 승인 성공 후)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  payment_key TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'DONE',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_pending_orders_user_id ON public.pending_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_orders_order_id ON public.pending_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_key ON public.orders(payment_key);

