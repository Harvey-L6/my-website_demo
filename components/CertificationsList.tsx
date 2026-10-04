// components/CertificationsList.tsx
import { queryDatabase, getPageBlocks, pMap } from '@/lib/notion';
import CertificationsClient from './CertificationsClient';

export default async function CertificationsList() {
  const rows = await queryDatabase(process.env.NOTION_CERTIFICATIONS_DB_ID);

  // 使用 pMap 限流，每次最多同時發起 2 個請求
  const certs = await pMap(
    rows,
    async (row: any) => {
      const props = row.properties;

      const title = props['名稱']?.title?.[0]?.plain_text || '未命名證照';
      const subtitle = props['副標題']?.rich_text?.[0]?.plain_text || '';
      const order = props['順序']?.number || 999;

      const images = [];
      for (let i = 1; i <= 4; i++) {
        const label = props[`圖片名稱${i}`]?.rich_text?.[0]?.plain_text;
        const fileObj = props[`圖片${i}`]?.files?.[0];
        const url = fileObj?.file?.url;

        if (label && url) {
          images.push({ label, url });
        }
      }

      const contentBlocks = await getPageBlocks(row.id);

      return {
        id: row.id,
        title,
        subtitle,
        order,
        images,
        contentBlocks,
      };
    },
    2
  );

  const sortedCerts = certs.sort((a, b) => a.order - b.order); 

  return <CertificationsClient certs={sortedCerts} />;
}