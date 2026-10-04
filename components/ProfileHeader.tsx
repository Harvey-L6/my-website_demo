import { queryDatabase, getPageBlocks } from '@/lib/notion';
import NotionBlock from '@/components/NotionBlock';
import Image from 'next/image';

export default async function ProfileHeader() { 
  // 1. 抓取資料庫第一筆資料
  const rows = await queryDatabase(process.env.NOTION_PROFILE_DB_ID);
  
  if (!rows || rows.length === 0) {
    return null;
  }

  const profile = rows[0];
  const props = profile.properties;

  // 2. 提取 Notion 欄位資料
  const name = props['名稱']?.title?.[0]?.plain_text || '未命名';
  const enName = props['En_name']?.rich_text?.[0]?.plain_text || '';
  const githubUrl = props['GitHub']?.url || 'https://github.com/';

  // 3. 處理大頭照網址 (相容 Notion 內部上傳與外部連結)
  const avatarFile = props['大頭照']?.files?.[0];
  const avatarUrl = avatarFile?.type === 'external' ? avatarFile.external.url : avatarFile?.file?.url;

  // 4. 抓取該頁面內部的所有區塊 (作為簡介)
  const blocks = await getPageBlocks(profile.id);

  return (
    <header className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        
        {/* 大頭照區塊 */}
        <div className="relative w-24 h-24 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0 flex items-center justify-center">
          {avatarUrl ? (
            <Image 
              src={avatarUrl} 
              alt={`${name} 的大頭照`} 
              fill
              unoptimized={true}
              priority // 🌟 新增這行：大頭照優先預載
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <span className="text-zinc-400 text-xs font-medium">PHOTO</span>
          )}
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* 姓名與英文名 */}
            <div className="flex items-baseline justify-center sm:justify-start gap-3">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{name}</h1>
              {enName && (
                <span className="text-xl text-zinc-500 font-medium">{enName}</span>
              )}
            </div>
            
            {/* 僅保留帶有 Icon 的 GitHub 按鈕 */}
            <div className="flex justify-center">
              <a 
                href={githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-700 transition shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* 簡介內文區塊 (直接抓取 Notion Page 內部排版) */}
          <div className="pt-1">
            {blocks.length > 0 ? (
              blocks.map((block: any) => (
                <NotionBlock key={block.id} block={block} />
              ))
            ) : (
              <p className="text-zinc-400 text-xs italic">請在 Notion 頁面內新增簡介內容</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}