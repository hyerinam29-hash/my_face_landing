// Minimal Notion API setup (no SDK dependency)

const NOTION_VERSION = '2022-06-28'

export function getNotionHeaders() {
  const NOTION_API_KEY = process.env.NOTION_API_KEY
  if (!NOTION_API_KEY) {
    throw new Error('환경변수 NOTION_API_KEY 가 설정되어 있지 않습니다.')
  }
  return {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

export function getNotionDatabaseId() {
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
  if (!NOTION_DATABASE_ID) {
    throw new Error('환경변수 NOTION_DATABASE_ID 가 설정되어 있지 않습니다.')
  }
  return NOTION_DATABASE_ID
}


