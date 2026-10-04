// components/CertificationsClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import NotionBlock from './NotionBlock';

export interface CertData {
  id: string;
  title: string;
  subtitle: string;
  images: { label: string; url: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentBlocks: any[];
}

export default function CertificationsClient({ certs }: { certs: CertData[] }) {
  const [selectedCert, setSelectedCert] = useState<CertData | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // 階段 1：當元件載入 (切換到技能頁籤) 時，預載每一張證照的「第一張圖片」
  useEffect(() => {
    if (!certs || certs.length === 0) return;
    
    certs.forEach((cert) => {
      if (cert.images.length > 0) {
        const firstImage = new window.Image();
        firstImage.src = cert.images[0].url;
      }
    });
  }, [certs]);

  // 階段 2：當打開特定證照彈窗時，預載該證照的「第二張及以後的圖片」
  useEffect(() => {
    if (!selectedCert || selectedCert.images.length <= 1) return;
    
    selectedCert.images.slice(1).forEach((img) => {
      const remainingImage = new window.Image();
      remainingImage.src = img.url;
    });
  }, [selectedCert]);

  // 按下 ESC 關閉放大或彈窗
  useEffect(() => {
    if (!selectedCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false); 
        } else {
          setSelectedCert(null); 
        }
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCert, isZoomed]);

  const openModal = (cert: CertData) => {
    setSelectedCert(cert);
    setActiveImgIndex(0);
    setIsZoomed(false); 
  };

  if (!certs || certs.length === 0) {
    return <div className="text-zinc-400 text-sm py-4">目前尚無證照資料...</div>;
  }

  return (
    <>
      {/* 外層卡片列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certs.map((cert) => (
          <div 
            key={cert.id}
            onClick={() => openModal(cert)}
            // 稍微把 p-4 加大到 p-5，讓變大的文字有更多呼吸空間
            className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition cursor-pointer flex justify-between items-center group"
          >
            <div className="pr-4">
              {/* 1. 標題放大：text-sm -> text-base */}
              <div className="font-bold text-zinc-900 text-base group-hover:text-zinc-700">
                {cert.title}
              </div>
              {/* 2. 副標題放大：text-xs -> text-sm，稍微增加一點 mt-1 讓上下拉開 */}
              <div className="text-sm text-zinc-500 mt-1">
                {cert.subtitle}
              </div>
            </div>
            
            {/* 3. 按鈕放大：text-[11px] -> text-xs，內距加大 px-3 py-1.5，並加入箭頭動態 */}
            <span className="flex items-center gap-1.5 text-xs bg-white border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-md shadow-xs group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition shrink-0">
              檢視證照
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        ))}
      </div>

      {/* 證照彈窗 Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] shadow-2xl relative border border-zinc-200 overflow-hidden flex flex-col lg:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white text-xs transition shadow-md cursor-pointer"
              aria-label="關閉彈窗" // 🌟 新增這行
            >
              ✕
            </button>

            {/* 左側：圖片預覽區與具名頁籤 */}
            <div className="lg:w-3/5 p-6 sm:p-8 bg-zinc-50 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col min-h-[350px]">
              <div>
                {/* 移除了原本的「證照與成績憑證」小標題，讓內容直接上移 */}
                
                {selectedCert.images.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCert.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIndex(idx)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                          activeImgIndex === idx
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400 mb-4">無提供圖片</div>
                )}
              </div>

              {/* 圖片展示框 */}
              {selectedCert.images.length > 0 && selectedCert.images[activeImgIndex] && (
                <div 
                  onClick={() => setIsZoomed(true)}
                  className="relative w-full aspect-4/3 bg-zinc-200 rounded-xl overflow-hidden border border-zinc-200/80 shadow-inner mt-auto cursor-zoom-in group"
                  title="點擊放大"
                >
                  <Image
                    src={selectedCert.images[activeImgIndex].url}
                    alt={selectedCert.images[activeImgIndex].label}
                    fill
                    unoptimized={true}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 select-none">
                    點擊放大
                  </div>
                </div>
              )}
            </div>

            {/* 右側：從 Notion 內頁抓取的詳細內容 */}
            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col bg-white overflow-hidden max-h-[50vh] lg:max-h-[90vh]">
              
              {/* 1. Header 區塊：移除 mb-5，改為 pb-4 讓底線更俐落 */}
              <div className="shrink-0 border-b border-zinc-100 pb-4">
                <h4 className="font-bold text-zinc-900 text-2xl mb-4 tracking-tight">
                  {selectedCert.title}
                </h4>
                
                {/* 副標題：橫幅樣式 */}
                {selectedCert.subtitle && (
                  <div className="px-4 py-3 bg-zinc-50 border-l-4 border-zinc-800 rounded-r-xl text-sm font-medium text-zinc-700 tracking-wide">
                    {selectedCert.subtitle}
                  </div>
                )}
              </div>

              {/* 2. 渲染 Notion 內頁排版：加上 mt-3，並用 Tailwind 選擇器強制消除首尾邊距 */}
              <div className="flex-1 overflow-y-auto pr-3 mt-3 mb-1 custom-scrollbar">
                {selectedCert.contentBlocks && selectedCert.contentBlocks.length > 0 ? (
                  <div className="space-y-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"> 
                    {selectedCert.contentBlocks.map((block: any) => (
                      <NotionBlock key={block.id} block={block} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-400 italic">尚無詳細說明內容。</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全螢幕放大檢視 (單圖) */}
      {isZoomed && selectedCert?.images[activeImgIndex] && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 select-none animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          {/* 關閉按鈕 */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white text-xl transition shadow-lg border border-white/10"
            title="關閉 (ESC)"
            aria-label="關閉放大圖片" // 🌟 新增這行
          >
            ✕
          </button>

          {/* 大圖主體 */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
          >
            <Image
              src={selectedCert.images[activeImgIndex].url}
              alt={`${selectedCert.title} 放大圖`}
              fill
              unoptimized={true}
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}