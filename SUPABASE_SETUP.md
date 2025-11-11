# Supabase 장바구니 테이블 생성 가이드

## 문제 해결

네트워크 오류가 발생하는 경우, Supabase에 `cart` 테이블이 생성되어 있는지 확인하세요.

## 테이블 생성 방법

### 방법 1: SQL Editor 사용 (권장)

1. Supabase 대시보드에 로그인
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. 다음 SQL을 실행:

```sql
-- 장바구니 테이블 생성
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price TEXT NOT NULL,
  volume TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 사용자별 조회를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);

-- RLS (Row Level Security) 정책 설정 (선택사항)
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 장바구니만 볼 수 있도록 정책 설정
CREATE POLICY "Users can view their own cart"
  ON cart FOR SELECT
  USING (auth.uid()::text = user_id);

-- 사용자는 자신의 장바구니에만 추가할 수 있도록 정책 설정
CREATE POLICY "Users can insert their own cart"
  ON cart FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- 사용자는 자신의 장바구니만 삭제할 수 있도록 정책 설정
CREATE POLICY "Users can delete their own cart"
  ON cart FOR DELETE
  USING (auth.uid()::text = user_id);
```

### 방법 2: Table Editor 사용

1. Supabase 대시보드에 로그인
2. 왼쪽 메뉴에서 **Table Editor** 클릭
3. **New Table** 클릭
4. 테이블 이름: `cart`
5. 다음 컬럼 추가:
   - `id` (uuid, Primary Key, Default: `gen_random_uuid()`)
   - `user_id` (text, Not Null)
   - `name` (text, Not Null)
   - `image` (text, Not Null)
   - `price` (text, Not Null)
   - `volume` (text, Not Null)
   - `created_at` (timestamptz, Default: `now()`)
6. **Save** 클릭

## 환경변수 확인

`.env.local` 파일에 다음 환경변수가 설정되어 있는지 확인하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

또는

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 테스트

테이블 생성 후:
1. 웹사이트에서 로그인
2. 제품 상세 페이지에서 "찜하기" 버튼 클릭
3. 장바구니 페이지(`/cart`)에서 제품이 표시되는지 확인

## 문제 해결

- **404 오류**: 테이블이 생성되지 않았습니다. 위의 방법으로 테이블을 생성하세요.
- **401/403 오류**: API 키가 잘못되었거나 권한이 없습니다. 환경변수를 확인하세요.
- **네트워크 오류**: Supabase URL이 잘못되었거나 네트워크 연결 문제입니다.

