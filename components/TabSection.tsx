'use client';

import { useState } from 'react';

type TabSectionProps = {
  portfolioContent?: React.ReactNode; 
  certificationsContent?: React.ReactNode;
  skillsContent?: React.ReactNode;
  experienceContent?: React.ReactNode;
};

type TabType = 'portfolio' | 'skills' | 'experience';

export default function TabSection({ 
  portfolioContent, 
  certificationsContent,
  skillsContent,
  experienceContent
}: TabSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('portfolio');

  const tabs = [
    { id: 'portfolio', label: '作品集' },
    { id: 'skills', label: '專業技能與證照' },
    { id: 'experience', label: '經歷時間軸' },
  ] as const;

  return (
    <section className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm min-h-[400px]">
      {/* 頁籤選單列 */}
      <div className="flex border-b border-zinc-100 gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-zinc-700">
        {/* 1. 作品集 */}
        {activeTab === 'portfolio' && (
          <div className="animate-in fade-in duration-300">
            {portfolioContent}
          </div>
        )}

        {/* 2. 專業技能與證照 */}
        {activeTab === 'skills' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 語言與檢定 */}
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">語言能力與檢定</h3>
              {certificationsContent}
            </div>

            {/* 動態技能與核心優勢 */}
            {skillsContent}
          </div>
        )}

        {/* 3. 經歷時間軸 */}
        {activeTab === 'experience' && (
          <div className="animate-in fade-in duration-300">
            {experienceContent}
          </div>
        )}
      </div>
    </section>
  );
}