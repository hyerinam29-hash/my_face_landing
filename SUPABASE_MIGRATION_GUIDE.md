# Supabase 마이그레이션 적용 가이드

## 📋 적용할 마이그레이션 파일

프로젝트에 다음 마이그레이션 파일들이 준비되어 있습니다:

1. **`migrations/complete_schema.sql`** - 전체 데이터베이스 스키마 (모든 테이블 포함)
2. **`migrations/create_orders_table.sql`** - 주문 관련 테이블만

## 🚀 적용 방법

### 방법 1: 통합 SQL 파일 사용 (권장)

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard 에 로그인
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴에서 **SQL Editor** 클릭
   - **New Query** 버튼 클릭

3. **SQL 실행**
   - `migrations/complete_schema.sql` 파일의 **전체 내용**을 복사
   - SQL Editor에 붙여넣기
   - **Run** 버튼 클릭 (또는 `Ctrl + Enter`)

4. **결과 확인**
   - "Success. No rows returned" 메시지 확인
   - 또는 아래 확인 쿼리 실행:

```sql
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('leads', 'cart', 'pending_orders', 'orders')
ORDER BY table_name, ordinal_position;
```

## 📊 생성되는 테이블

### 1. leads (무료 체험 등록)
- 무료 체험 신청 정보 저장
- 컬럼: id, name, email, phone, created_at

### 2. cart (장바구니)
- 사용자가 찜한 제품 목록 저장
- 컬럼: id, user_id, name, image, price, volume, created_at

### 3. pending_orders (임시 주문)
- 결제 요청 전 주문 정보 임시 저장
- 컬럼: id, user_id, order_id, amount, cart_items, created_at

### 4. orders (최종 주문)
- 결제 승인 성공 후 최종 주문 정보 저장
- 컬럼: id, user_id, order_id, payment_key, total_amount, status, items, created_at

## ⚠️ 주의사항

- `IF NOT EXISTS` 구문을 사용하므로 중복 실행해도 안전합니다
- 이미 존재하는 테이블은 건너뜁니다
- 기존 데이터는 유지됩니다

## 🔍 문제 해결

### 테이블이 생성되지 않는 경우
- SQL Editor에서 에러 메시지 확인
- Supabase 프로젝트 권한 확인
- SQL 구문 오류 확인

### 인덱스 생성 실패
- 인덱스는 `IF NOT EXISTS`로 설정되어 있어 중복 실행해도 안전합니다
- 이미 존재하는 인덱스는 자동으로 건너뜁니다

