// components/ProjectListClient.tsx
'use client';

import { useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal, { ProjectData } from './ProjectModal';

interface ProjectListClientProps {
  projects: ProjectData[];
}

export default function ProjectListClient({ projects }: ProjectListClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  if (!projects || projects.length === 0) {
    return <div className="text-zinc-400 text-sm text-center py-12">目前尚無作品資料，請至 Notion 新增。</div>;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {projects.map((project, index) => ( // 🌟 1. 取得 index 索引
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            imageUrl={project.coverImage}
            techStack={project.techStack}
            onClick={() => setSelectedProject(project)}
            priority={index < 2} // 🌟 2. 只有前兩張作品卡片會開啟優先預載
          />
        ))}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}