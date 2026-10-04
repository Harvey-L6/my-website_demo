'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import NotionBlock from './NotionBlock';

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  galleryImages?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contentBlocks?: any[];
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // 🌟 直接使用 galleryImages 陣列，不需要再跟封面圖做合併判斷了
  const images = project?.galleryImages || [];
    
  const hasImages = images.length > 0;
  const isMultiImage = images.length > 1;

  const nextImage = useCallback(() => {
    if (!isMultiImage) return;
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  }, [isMultiImage, images.length]);

  const prevImage = useCallback(() => {
    if (!isMultiImage) return;
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [isMultiImage, images.length]);

  useEffect(() => {
    setCurrentImgIndex(0);
    setIsZoomed(false);
  }, [project]);

  // 🌟 新增這一段：當彈窗打開時，立刻預載該專案的所有圖片
  useEffect(() => {
    if (!project) return;
    
    // 取得該專案會用到的所有圖片網址
    const preloadUrls = project.galleryImages && project.galleryImages.length > 0 
      ? project.galleryImages 
      : (project.coverImage ? [project.coverImage] : []);
      
    // 透過原生的 Image 物件，讓瀏覽器在背景把這些圖塞進快取
    preloadUrls.forEach((url) => {
      const img = new window.Image();
      img.src = url;
    });
  }, [project]); // 只有當點開的專案改變時，才會觸發下載

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, isZoomed, prevImage, nextImage, onClose]);

  if (!project) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* 背景暗色遮罩 */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          onClick={onClose}
        />

        {/* 彈窗主體 */}
        <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-zinc-200">
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white transition-all shadow-md"
            aria-label="關閉彈窗"
          >
            ✕
          </button>

          {/* 左側：圖片區塊 */}
          <div className="lg:w-3/5 bg-zinc-100 relative flex flex-col justify-center min-h-[250px] lg:min-h-[450px] border-b lg:border-b-0 lg:border-r border-zinc-200/80">
            {hasImages ? (
              <div 
                onClick={() => setIsZoomed(true)} 
                className="relative w-full aspect-video overflow-hidden cursor-zoom-in group"
                title="點擊放大"
              >
                <Image
                  src={images[currentImgIndex]}
                  alt={`${project.title} 截圖 ${currentImgIndex + 1}`}
                  fill
                  unoptimized={true} // 🌟 新增這行
                  className="object-contain transition-all duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 select-none">
                  點擊放大
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video flex flex-col items-center justify-center text-zinc-400 gap-2">
                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">NO IMAGES AVAILABLE</span>
              </div>
            )}

            {/* 多圖切換按鈕 */}
            {isMultiImage && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center transition shadow-md border border-zinc-200"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-zinc-800 flex items-center justify-center transition shadow-md border border-zinc-200"
                >
                  ›
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(idx); }}
                      className={`h-2 rounded-full transition-all ${
                        currentImgIndex === idx ? 'bg-white w-4' : 'bg-white/50 w-2'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 右側：詳情介紹區塊 */}
          <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col max-h-[50vh] lg:max-h-[90vh] bg-white overflow-hidden">
            
            {/* 🌟 修改這裡：移除了 mb-5，稍微縮小 pb-5 為 pb-4 讓線條更貼合 */}
            <div className="shrink-0 border-b border-zinc-100 pb-4">
              <h2 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">{project.title}</h2>

              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 🌟 2. 內文區塊：加上 my-3，並透過 Tailwind 選擇器強行消除首尾多餘的間距 */}
            <div className="flex-1 overflow-y-auto pr-3 my-3 custom-scrollbar">
              {project.contentBlocks && project.contentBlocks.length > 0 ? (
                <div className="space-y-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                  {project.contentBlocks.map((block: any) => (
                    <NotionBlock key={block.id} block={block} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              )}
            </div>

            {/* 🌟 3. 按鈕區：加上條件判斷，避免沒有按鈕時出現空橫線 */}
            {(project.demoUrl || project.githubUrl) && (
              <div className="flex gap-3 pt-4 border-t border-zinc-100 mt-auto shrink-0">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>線上 Demo</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-medium border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg transition shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub Code</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 全螢幕放大檢視 */}
      {isZoomed && hasImages && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 select-none animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          {/* 關閉按鈕 */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white text-xl transition shadow-lg border border-white/10"
            title="關閉 (ESC)"
          >
            ✕
          </button>

          {/* 大圖主體 */}
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
          >
            <Image
              src={images[currentImgIndex]}
              alt={`${project.title} 放大圖 ${currentImgIndex + 1}`}
              fill
              unoptimized={true} // 🌟 新增這行
              className="object-contain"
              sizes="100vw"
              priority
            />

            {/* 左右切換按鈕 */}
            {isMultiImage && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white text-3xl flex items-center justify-center transition shadow-xl border border-white/10"
                  title="上一張 (←)"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 text-white text-3xl flex items-center justify-center transition shadow-xl border border-white/10"
                  title="下一張 (→)"
                >
                  ›
                </button>

                {/* 頁碼標籤 */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1 rounded-full font-mono border border-white/10 shadow-md">
                  {currentImgIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}