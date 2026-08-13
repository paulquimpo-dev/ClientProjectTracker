import { ProjectCard } from './ProjectCard'
import type { Project } from '../types/project'

interface ProjectListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  return (
    <section className="project-list" aria-label="Projects">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </section>
  )
}
