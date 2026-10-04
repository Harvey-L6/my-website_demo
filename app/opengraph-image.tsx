// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const alt = 'Harvey Li | Digital Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // 動態抓取你 Favicon 專用的 Satisfy 手寫字體檔
  const satisfyFont = await fetch(
    'https://fonts.gstatic.com/s/satisfy/v22/rP2Hp2yn6lkG50LoOZSCHBeHFl0.ttf'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b', // Zinc 950 深邃暗色背景
          color: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 背景微弱聚光氛圍 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '650px',
            height: '380px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '100%',
          }}
        />

        {/* 1:1 復刻 Favicon 的 HL 黑底圓角框 */}
        <div
          style={{
            width: 108,
            height: 108,
            borderRadius: 26,
            backgroundColor: '#18181b', // Zinc 900
            border: '1.5px solid #27272a', // Zinc 800 微細光澤邊框
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span
            style={{
              fontFamily: 'Satisfy',
              fontSize: 58,
              color: '#ffffff',
              marginTop: -2,
            }}
          >
            HL
          </span>
        </div>

        {/* 主標題 */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: 16,
            color: '#f4f4f5',
          }}
        >
          Harvey Li
        </div>

        {/* 副標題定位 */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: '#a1a1aa', // Zinc 400
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Digital Portfolio — System Integration & Automation
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Satisfy',
          data: satisfyFont,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}