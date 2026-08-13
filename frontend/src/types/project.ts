export const PROJECT_STATUSES = [
  'Planning',
  'In Progress',
  'On Hold',
  'Completed',
] as const

export const PROJECT_PRIORITIES = ['Low', 'Medium', 'High'] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]

export interface Project {
  id: number
  clientName: string
  projectName: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  dueDate: string
  created_at: string
  updated_at: string
}

export type ProjectInput = Omit<Project, 'id' | 'created_at' | 'updated_at'>
