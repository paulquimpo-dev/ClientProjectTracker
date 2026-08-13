import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import type { Project } from '../types/project'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
})

const timestampFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
})

function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00`))
}

function formatTimestamp(timestamp: string): string {
  return timestampFormatter.format(new Date(timestamp))
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <article className={`project-card project-card--${project.status.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="project-card__header">
        <div>
          <p className="project-card__client">{project.clientName}</p>
          <h2>{project.projectName}</h2>
        </div>
        <div className="badge-group" aria-label="Project status and priority">
          <StatusBadge status={project.status} />
          <PriorityBadge priority={project.priority} />
        </div>
      </div>

      {project.description ? <p className="project-card__description">{project.description}</p> : null}

      <p className="project-card__created">
        Created <time dateTime={project.created_at}>{formatTimestamp(project.created_at)}</time>
      </p>

      <footer className="project-card__footer">
        <p className="project-card__dates">
          <span className="project-card__dates-label">Schedule</span>
          <span>{formatDate(project.startDate)} <span aria-hidden="true">→</span> {formatDate(project.dueDate)}</span>
        </p>
        <div className="project-card__actions" aria-label={`Actions for ${project.projectName}`}>
          <button type="button" className="button button--text" onClick={() => onEdit(project)} aria-label={`Edit ${project.projectName}`}>
            Edit
          </button>
          <button type="button" className="button button--text button--danger" onClick={() => onDelete(project)} aria-label={`Delete ${project.projectName}`}>
            Delete
          </button>
        </div>
      </footer>
    </article>
  )
}
