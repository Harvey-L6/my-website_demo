// lib/notion.ts

const NOTION_VERSION = '2022-06-28';

/**
 * 併發限流工具：將陣列分批處理，確保同時向 Notion 發送的請求不超過限制
 */
export async function pMap<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = 2
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
}

/**
 * 萬用資料庫查詢函式
 * 用途：獲取任何 Notion Database 的列表資料 (如：作品列表、技能牆、首頁簡介)
 * @param databaseId 傳入對應的 Notion Database ID
 */
export async function queryDatabase(databaseId?: string) {
  const token = process.env.NOTION_TOKEN;

  if (!databaseId || !token) {
    console.error('未設定 NOTION_TOKEN 或 Database ID');
    return [];
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, 
    });

    if (!res.ok) {
      console.error(`Notion API 資料庫查詢失敗 (${databaseId}):`, res.status);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Notion API 資料庫讀取錯誤:', error);
    return [];
  }
}

/**
 * 萬用頁面區塊查詢函式
 * 用途：獲取任何 Notion Page 內部的排版區塊 (如：長篇自傳、專案詳細介紹)
 * @param blockId 傳入對應的 Page ID 或 Block ID
 */
export async function getPageBlocks(blockId: string) {
  const token = process.env.NOTION_TOKEN;
  
  if (!token) {
    console.error('未設定 NOTION_TOKEN');
    return [];
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${blockId}/children`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': NOTION_VERSION,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Notion API 區塊查詢失敗 (${blockId}):`, res.status);
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('抓取頁面區塊錯誤:', error);
    return [];
  }
}