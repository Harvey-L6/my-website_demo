import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/', // 明確允許所有人存取網頁 HTML
    },
  };
}