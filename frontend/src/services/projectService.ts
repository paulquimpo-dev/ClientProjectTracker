import { ApiError, request, type ApiValidationErrors } from './apiClient'
import type { Project, ProjectInput } from '../types/project'

export { ApiError, type ApiValidationErrors }

export function getProjects(): Promise<Project[]> {
  return request<Project[]>('/projects/')
}

export function getProject(id: number): Promise<Project> {
  return request<Project>(`/projects/${id}/`)
}

export function createProject(data: ProjectInput): Promise<Project> {
  return request<Project>('/projects/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateProject(id: number, data: ProjectInput): Promise<Project> {
  return request<Project>(`/projects/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function deleteProject(id: number): Promise<void> {
  return request<void>(`/projects/${id}/`, { method: 'DELETE' })
}
