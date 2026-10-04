// components/ExperienceList.tsx
import { queryDatabase, getPageBlocks, pMap } from '@/lib/notion';
import NotionBlock from './NotionBlock';

export default async function ExperienceList() {
  const databaseId = process.env.NOTION_EXPERIENCE_DB_ID;

  if (!databaseId) {
    return <div className="text-zinc-500 text-sm">請設定 NOTION_EXPERIENCE_DB_ID</div>;
  }

  let rows = await queryDatabase(databaseId);
  
  rows = rows.sort((a: any, b: any) => {
    const orderA = a.properties['排序']?.number ?? 999;
    const orderB = b.properties['排序']?.number ?? 999;
    return orderA - orderB;
  });

  if (!rows || rows.length === 0) {
    return <div className="text-zinc-500 text-sm">目前尚無經歷資料。</div>;
  }

  // 使用 pMap 限流，每次最多同時發起 2 個請求
  const experiencesWithBlocks = await pMap(
    rows,
    async (row: any) => {
      const props = row.properties;
      
      const titleObj = props['職稱']?.title;
      const title = titleObj && titleObj.length > 0 ? titleObj[0].plain_text : '未命名職稱';
      
      const orgObj = props['組織單位']?.rich_text;
      const organization = orgObj && orgObj.length > 0 ? orgObj[0].plain_text : '';

      const dateObj = props['期間']?.date;
      let dateString = '';
      if (dateObj) {
        const start = dateObj.start ? dateObj.start.replace(/-/g, '.') : '';
        const formattedStart = start.substring(0, 7);
        
        if (dateObj.end) {
          const end = dateObj.end.replace(/-/g, '.');
          const formattedEnd = end.substring(0, 7);
          dateString = `${formattedStart} - ${formattedEnd}`;
        } else {
          dateString = `${formattedStart} - 至今`;
        }
      }

      const tags: string[] = props['關聯技能']?.multi_select?.map((t: any) => t.name) || [];

      const blocks = await getPageBlocks(row.id);

      return {
        id: row.id,
        title,
        organization,
        dateString,
        tags,
        blocks,
      };
    },
    2
  );

  return (
    <div className="space-y-0">
      {experiencesWithBlocks.map((exp, index) => (
        <div key={exp.id} className="relative pl-8 sm:pl-10 pb-8 group last:pb-0">
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-zinc-800 transition-colors mt-2 z-10 shrink-0" />
            
            {index !== experiencesWithBlocks.length - 1 ? (
              <div className="w-[1.5px] bg-zinc-100 flex-1 my-2" />
            ) : (
              <div className="w-[1.5px] bg-gradient-to-b from-zinc-100 via-zinc-100 via-[75%] to-transparent flex-1 mt-2 mb-2" />
            )}
          </div>

          <div>
            {exp.dateString && (
              <div className="text-[11px] font-semibold tracking-widest text-zinc-400 uppercase mb-2">
                {exp.dateString}
              </div>
            )}
            
            <h3 className="text-lg font-bold text-zinc-900 mb-1">{exp.title}</h3>
            
            {exp.organization && (
              <div className="text-sm font-medium text-zinc-500 mb-4">
                {exp.organization}
              </div>
            )}

            {exp.blocks && exp.blocks.length > 0 && (
              <div className="text-sm text-zinc-600 mb-4 space-y-1">
                {exp.blocks.map((block: any) => (
                  <NotionBlock key={block.id} block={block} />
                ))}
              </div>
            )}

            {exp.tags && exp.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-zinc-50 border border-zinc-200/60 text-zinc-500 text-[11px] font-medium rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}