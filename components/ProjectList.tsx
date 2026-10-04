// components/ProjectList.tsx
import { queryDatabase, getPageBlocks, pMap } from '@/lib/notion';
import ProjectListClient from './ProjectListClient';

export default async function ProjectList() {
  const rows = await queryDatabase(process.env.NOTION_PROJECTS_DB_ID);

  // 使用 pMap 限流，每次最多同時發起 2 個請求
  const projects = await pMap(
    rows,
    async (row: any) => {
      const props = row.properties;

      const title = props['名稱']?.title?.[0]?.plain_text || '未命名作品';
      const description = props['簡介']?.rich_text?.map((t: any) => t.plain_text).join('') || '';
      
      const techStack = props['標籤']?.multi_select?.map((tag: any) => tag.name) || [];
      const demoUrl = props['Demo']?.url || undefined;
      const githubUrl = props['GitHub']?.url || undefined;
      const order = props['排序']?.number || 999;

      const getFileUrl = (fileObj: any) => 
        fileObj?.type === 'external' ? fileObj.external.url : fileObj?.file?.url;
      
      const galleryImages = props['展示圖片']?.files?.map(getFileUrl).filter(Boolean) || [];
      const coverImage = galleryImages.length > 0 ? galleryImages[0] : undefined;

      const contentBlocks = await getPageBlocks(row.id);

      return {
        id: row.id,
        title,
        description,
        techStack,
        demoUrl,
        githubUrl,
        coverImage,
        galleryImages,
        contentBlocks,
        order,
      };
    },
    2
  );

  const sortedProjects = projects.sort((a, b) => a.order - b.order); 

  return <ProjectListClient projects={sortedProjects} />;
}