// components/SkillsList.tsx
import { queryDatabase, getPageBlocks } from '@/lib/notion';
import NotionBlock from './NotionBlock';

export default async function SkillsList() {
  // 1. 抓取 1-Row 資料庫的第一筆紀錄
  const rows = await queryDatabase(process.env.NOTION_SKILLS_DB_ID);

  if (!rows || rows.length === 0) {
    return <p className="text-xs text-zinc-400 italic">尚未填寫技能與優勢資料</p>;
  }

  const row = rows[0];
  const props = row.properties;

  // 2. 提取「技能標籤」 (Multi-select)
  const skillTags: string[] = 
    props['技能標籤']?.multi_select?.map((tag: { name: string }) => tag.name) || [];

  // 3. 抓取內頁區塊 (作為「核心優勢」內容)
  const blocks = await getPageBlocks(row.id);

  return (
    <div className="space-y-8">
      {/* 上區塊：技能標籤 */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          技能標籤
        </h3>
        {skillTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skillTags.map((tool) => (
              <span 
                key={tool} 
                className="px-3 py-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200/80"
              >
                {tool}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic">尚未設定技能標籤</p>
        )}
      </div>

      {/* 下區塊：核心優勢 (渲染 Notion 內頁排版) */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          核心優勢
        </h3>
        {blocks.length > 0 ? (
          <div className="space-y-1">
            {blocks.map((block: any) => (
              <NotionBlock key={block.id} block={block} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-400 italic">請在 Notion 頁面內新增核心優勢內容</p>
        )}
      </div>
    </div>
  );
}