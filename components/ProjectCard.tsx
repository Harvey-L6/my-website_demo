import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  techStack?: string[];
  onClick?: () => void;
  priority?: boolean; // 🌟 1. 新增 priority 介面定義
}

export default function ProjectCard({ 
  title, 
  description, 
  imageUrl, 
  techStack = [], 
  onClick,
  priority = false // 🌟 2. 設定預設值為 false
}: ProjectCardProps) {
  const hasImage = Boolean(imageUrl && imageUrl.trim() !== '');

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      {/* 上半部：圖片容器 */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-50 border-b border-zinc-100 flex items-center justify-center">
        {hasImage ? (
          <Image 
            src={imageUrl!} 
            alt={title} 
            fill
            unoptimized={true}
            priority={priority} // 🌟 3. 將 priority 傳給 Next.js Image
            className="object-cover transition-transform duration-500 group-hover:scale-105" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-300 gap-1.5 select-none">
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">NO PREVIEW</span>
          </div>
        )}
      </div>

      {/* 下半部：文字與標籤 */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-zinc-900 mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-zinc-600 mb-4 flex-1">
          {description}
        </p>
        
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {techStack.map((tech) => (
              <span 
                key={tech} 
                className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}