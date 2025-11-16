# Supabase 데이터베이스 마이그레이션 가이드

## 전체 스키마 생성

### 방법 1: 통합 SQL 파일 사용 (권장)

1. Supabase 대시보드에 로그인
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New Query** 클릭
4. `migrations/complete_schema.sql` 파일의 전체 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

이 방법으로 모든 테이블이 한 번에 생성됩니다.

### 방법 2: 개별 파일 사용

각 테이블을 개별적으로 생성하려면 다음 순서로 실행하세요:

1. `migrations/create_orders_table.sql` - 주문 관련 테이블 (pending_orders, orders)
2. 장바구니 테이블은 아래 SQL로 생성:

```sql
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price TEXT NOT NULL,
  volume TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);
```

3. 무료 체험 등록 테이블은 아래 SQL로 생성:

```sql
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
```

## 테이블 목록

### 1. leads (무료 체험 등록)
- **용도**: 랜딩 페이지에서 무료 체험 신청 정보 저장
- **컬럼**: id, name, email, phone, created_at

### 2. cart (장바구니)
- **용도**: 사용자가 찜한 제품 목록 저장
- **컬럼**: id, user_id, name, image, price, volume, created_at

### 3. pending_orders (임시 주문)
- **용도**: 결제 요청 전 주문 정보 임시 저장 (보안 검증용)
- **컬럼**: id, user_id, order_id, amount, cart_items, created_at

### 4. orders (최종 주문)
- **용도**: 결제 승인 성공 후 최종 주문 정보 저장
- **컬럼**: id, user_id, order_id, payment_key, total_amount, status, items, created_at

## 인덱스 설명

모든 테이블에 조회 성능 향상을 위한 인덱스가 생성되어 있습니다:
- `user_id`: 사용자별 데이터 조회
- `order_id`: 주문번호로 조회
- `payment_key`: 결제 키로 조회
- `created_at`: 날짜순 정렬

## Row Level Security (RLS)

보안을 강화하려면 `complete_schema.sql` 파일의 RLS 설정 부분의 주석을 해제하세요.
RLS를 활성화하면 사용자는 자신의 데이터만 조회/수정/삭제할 수 있습니다.

## 테이블 확인

SQL Editor에서 다음 쿼리를 실행하여 테이블이 올바르게 생성되었는지 확인하세요:

```sql
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'cart', 'pending_orders', 'orders')
ORDER BY table_name, ordinal_position;
```

## 문제 해결

### 테이블이 생성되지 않는 경우
- SQL Editor에서 에러 메시지를 확인하세요
- Supabase 프로젝트의 권한을 확인하세요

### 인덱스 생성 실패
- 인덱스는 `IF NOT EXISTS`로 설정되어 있어 중복 실행해도 안전합니다
- 이미 존재하는 인덱스는 건너뜁니다

### RLS 활성화 후 접근 불가
- RLS 정책이 올바르게 설정되었는지 확인하세요
- Clerk 인증을 사용하는 경우 `auth.uid()` 대신 `user_id`를 직접 비교해야 할 수 있습니다

