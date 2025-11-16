# 배포 가이드

## 1. Supabase 마이그레이션 적용

### Supabase 대시보드에서 SQL 실행

1. **Supabase 대시보드 접속**
   - https://supabase.com/dashboard
   - 프로젝트 선택

2. **SQL Editor 열기**
   - 왼쪽 메뉴 → **SQL Editor**
   - **New Query** 클릭

3. **마이그레이션 실행**
   - `migrations/complete_schema.sql` 파일 전체 내용 복사
   - SQL Editor에 붙여넣기
   - **Run** 버튼 클릭

4. **확인**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
     AND table_name IN ('leads', 'cart', 'pending_orders', 'orders');
   ```

## 2. Vercel 배포

### 방법 1: 자동 배포 (GitHub 연동 시)

GitHub에 푸시했으므로 Vercel이 자동으로 배포를 시작합니다.

1. **Vercel 대시보드 확인**
   - https://vercel.com/dashboard
   - 프로젝트 선택
   - **Deployments** 탭에서 최신 배포 상태 확인

2. **배포 완료 대기**
   - 배포가 완료되면 자동으로 새 버전이 적용됩니다
   - 배포 URL에서 확인 가능

### 방법 2: 수동 배포 (Vercel CLI 사용)

Vercel CLI가 설치되어 있지 않은 경우:

```bash
# Vercel CLI 설치
pnpm add -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

### 방법 3: Vercel 대시보드에서 수동 배포

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **Deployments** 탭 → **Redeploy** 버튼 클릭

## 3. 환경변수 확인

Vercel 배포 전에 다음 환경변수가 설정되어 있는지 확인하세요:

### 필수 환경변수
- `SUPABASE_URL` 또는 `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` 또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TOSS_CLIENT_KEY` (토스 페이먼츠)
- `TOSS_SECRET_KEY` (토스 페이먼츠)

### Vercel 환경변수 설정 방법

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 각 환경변수 추가:
   - Key: 환경변수 이름
   - Value: 환경변수 값
   - Environment: Production, Preview, Development 모두 선택

## 4. 배포 확인

배포 완료 후:
1. 배포 URL 접속
2. 페이지가 정상적으로 로드되는지 확인
3. 모바일 반응형이 제대로 작동하는지 확인
4. 기능 테스트 (로그인, 장바구니, 결제 등)

## 문제 해결

### 배포 실패 시
- Vercel 대시보드의 **Deployments** 탭에서 에러 로그 확인
- 환경변수가 올바르게 설정되었는지 확인
- 빌드 로그에서 구체적인 에러 메시지 확인

### Supabase 연결 오류 시
- 환경변수가 올바르게 설정되었는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 테이블이 올바르게 생성되었는지 확인

