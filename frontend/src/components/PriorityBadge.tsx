import type { ProjectPriority } from '../types/project'

interface PriorityBadgeProps {
  priority: ProjectPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <span className={`badge badge--priority badge--priority-${priority.toLowerCase()}`}>{priority} priority</span>
}
