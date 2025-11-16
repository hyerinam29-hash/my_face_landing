# 토스 페이먼츠 결제 연동 설정 가이드

## 1. 환경변수 설정

`.env.local` 파일에 다음 환경변수를 추가하세요:

```env
# 토스 페이먼츠 API 키
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxxxxxxxxxxxx
TOSS_SECRET_KEY=test_sk_xxxxxxxxxxxxx
```

### API 키 발급 방법

1. [토스 페이먼츠 개발자센터](https://developers.tosspayments.com/)에 로그인
2. **API 키** 메뉴에서 **테스트 키** 확인
   - **클라이언트 키**: `NEXT_PUBLIC_TOSS_CLIENT_KEY`에 설정
   - **시크릿 키**: `TOSS_SECRET_KEY`에 설정 (서버 전용, 클라이언트에 노출 금지)

### 주의사항

- `NEXT_PUBLIC_TOSS_CLIENT_KEY`는 클라이언트에서 사용되므로 `NEXT_PUBLIC_` 접두사가 필요합니다.
- `TOSS_SECRET_KEY`는 서버에서만 사용되며, 절대 클라이언트에 노출되면 안 됩니다.
- 테스트 키는 실제 결제가 발생하지 않습니다.
- 실서비스 배포 전에는 **라이브 키**로 변경해야 합니다.

## 2. Supabase 테이블 생성

`migrations/create_orders_table.sql` 파일의 SQL을 Supabase SQL Editor에서 실행하세요.

### 테이블 설명

- **pending_orders**: 결제 요청 전 주문 정보를 임시 저장하는 테이블
- **orders**: 결제 승인 성공 후 최종 주문 정보를 저장하는 테이블

## 3. 결제 흐름

1. 사용자가 "결제하기" 버튼 클릭
2. 주문 정보 임시 저장 (`pending_orders` 테이블)
3. 토스 페이먼츠 결제창 열기
4. 사용자 결제 정보 입력
5. 결제 인증 완료 후 `/payment/success`로 리다이렉트
6. 금액 검증 (보안)
7. 결제 승인 API 호출
8. 주문 정보 최종 저장 (`orders` 테이블)
9. 장바구니 비우기

## 4. 테스트 방법

### 테스트 카드 정보

토스 페이먼츠 테스트 환경에서는 아래 카드 정보를 사용할 수 있습니다:

- **카드번호**: 1234-5678-9012-3456
- **유효기간**: 12/34
- **CVC**: 123
- **비밀번호**: 123456

### 테스트 주의사항

- 테스트 키를 사용하면 실제 결제가 발생하지 않습니다.
- 테스트 결제는 즉시 승인됩니다.
- 실서비스 배포 전 반드시 라이브 키로 변경하세요.

## 5. 문제 해결

### 결제창이 열리지 않는 경우

- `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 올바르게 설정되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

### 결제 승인 실패

- `TOSS_SECRET_KEY`가 올바르게 설정되었는지 확인
- 서버 로그에서 에러 메시지 확인
- 금액 검증 실패 시 임시 주문 정보 확인

### 주문 정보 저장 실패

- Supabase 테이블이 올바르게 생성되었는지 확인
- Supabase API 키 권한 확인

