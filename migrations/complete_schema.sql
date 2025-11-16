-- ============================================
-- 페이스 캘린더 랜딩 페이지 전체 데이터베이스 스키마
-- ============================================
-- 실행 방법: Supabase SQL Editor에서 이 파일의 전체 내용을 복사하여 실행하세요.
-- 실행 순서: 순서대로 실행하시면 됩니다.

-- ============================================
-- 1. 무료 체험 등록 테이블 (leads)
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- ============================================
-- 2. 장바구니 테이블 (cart)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price TEXT NOT NULL,
  volume TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (사용자별 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_created_at ON public.cart(created_at DESC);

-- ============================================
-- 3. 주문 임시 저장 테이블 (pending_orders)
-- ============================================
-- 결제 요청 전 주문 정보를 임시 저장 (보안을 위한 금액 검증용)
CREATE TABLE IF NOT EXISTS public.pending_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  cart_items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_pending_orders_user_id ON public.pending_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_orders_order_id ON public.pending_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_pending_orders_created_at ON public.pending_orders(created_at);

-- ============================================
-- 4. 최종 주문 테이블 (orders)
-- ============================================
-- 결제 승인 성공 후 최종 주문 정보 저장
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON public.orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_key ON public.orders(payment_key);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ============================================
-- 5. Row Level Security (RLS) 설정 (선택사항)
-- ============================================
-- 보안을 위해 RLS를 활성화하려면 아래 주석을 해제하세요.

-- -- cart 테이블 RLS 설정
-- ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own cart"
--   ON public.cart FOR SELECT
--   USING (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can insert their own cart"
--   ON public.cart FOR INSERT
--   WITH CHECK (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can delete their own cart"
--   ON public.cart FOR DELETE
--   USING (auth.uid()::text = user_id);
-- 
-- -- pending_orders 테이블 RLS 설정
-- ALTER TABLE public.pending_orders ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own pending orders"
--   ON public.pending_orders FOR SELECT
--   USING (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can insert their own pending orders"
--   ON public.pending_orders FOR INSERT
--   WITH CHECK (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can delete their own pending orders"
--   ON public.pending_orders FOR DELETE
--   USING (auth.uid()::text = user_id);
-- 
-- -- orders 테이블 RLS 설정
-- ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own orders"
--   ON public.orders FOR SELECT
--   USING (auth.uid()::text = user_id);

-- ============================================
-- 6. 테이블 정보 확인
-- ============================================
-- 아래 쿼리를 실행하여 테이블이 올바르게 생성되었는지 확인하세요:
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' 
--   AND table_name IN ('leads', 'cart', 'pending_orders', 'orders')
-- ORDER BY table_name, ordinal_position;

