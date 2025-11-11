// Minimal Notion API setup (no SDK dependency)

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
const NOTION_VERSION = '2022-06-28'

if (!NOTION_API_KEY) {
  throw new Error('환경변수 NOTION_API_KEY 가 설정되어 있지 않습니다.')
}

if (!NOTION_DATABASE_ID) {
  throw new Error('환경변수 NOTION_DATABASE_ID 가 설정되어 있지 않습니다.')
}

export function getNotionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

export { NOTION_DATABASE_ID }


