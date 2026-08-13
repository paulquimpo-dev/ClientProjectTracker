import type { ProjectStatus } from '../types/project'

interface StatusBadgeProps {
  status: ProjectStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge badge--status badge--status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
}
