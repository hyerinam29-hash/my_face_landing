-- cart 테이블에 필요한 컬럼 추가
-- 실행 날짜: 2025-01-XX

-- 1. 필요한 컬럼들 추가
ALTER TABLE cart 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS price TEXT,
ADD COLUMN IF NOT EXISTS volume TEXT,
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 2. name 컬럼을 uuid에서 text로 변경 (제품 이름을 저장하기 위해)
-- 기존 데이터가 있다면 먼저 백업하세요
ALTER TABLE cart 
ALTER COLUMN name TYPE TEXT USING name::TEXT;

-- 3. name 컬럼의 기본값 제거 (gen_random_uuid() 제거)
ALTER TABLE cart 
ALTER COLUMN name DROP DEFAULT;

-- 4. name 컬럼을 nullable로 변경 (필요한 경우)
ALTER TABLE cart 
ALTER COLUMN name DROP NOT NULL;

