import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // 允許 Notion 內部直傳的圖片 (AWS S3)
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      // 允許 Notion 官方相關的靜態圖片
      {
        protocol: 'https',
        hostname: 'files.notion.so',
      },
    ],
  },
};

export default nextConfig;