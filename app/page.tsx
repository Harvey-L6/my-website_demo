// app/page.tsx
import ProfileHeader from '@/components/ProfileHeader';
import TabSection from '@/components/TabSection';
import ProjectList from '@/components/ProjectList'; 
import CertificationsList from '@/components/CertificationsList';
import SkillsList from '@/components/SkillsList';
import ExperienceList from '@/components/ExperienceList'; // 🌟 引入

// 🌟 補上這行：將這頁的背景渲染上限延長至 60 秒，防止 Notion 回應過慢導致 504 Timeout
export const maxDuration = 60;

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader />
        
        {/* 🌟 傳入 experienceContent */}
        <TabSection 
          portfolioContent={<ProjectList />} 
          certificationsContent={<CertificationsList />} 
          skillsContent={<SkillsList />}
          experienceContent={<ExperienceList />}
        />
        
      </div>
    </main>
  );
}