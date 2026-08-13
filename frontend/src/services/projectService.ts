import type { Project, ProjectInput } from '../types/project'

export type ApiValidationErrors = Record<string, string[]>

export class ApiError extends Error {
  readonly status: number
  readonly validationErrors?: ApiValidationErrors

  constructor(message: string, status: number, validationErrors?: ApiValidationErrors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.validationErrors = validationErrors
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError('Project service is not configured. Set VITE_API_BASE_URL and restart the frontend.', 0)
  }

  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError('Unable to reach the project service. Please try again.', 0)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const responseBody: unknown = await response.json().catch(() => undefined)

  if (!response.ok) {
    const validationErrors = isValidationErrors(responseBody) ? responseBody : undefined
    throw new ApiError(
      getErrorMessage(response.status, validationErrors),
      response.status,
      validationErrors,
    )
  }

  return responseBody as T
}

function isValidationErrors(value: unknown): value is ApiValidationErrors {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(
      (messages) => Array.isArray(messages) && messages.every((message) => typeof message === 'string'),
    )
  )
}

function getErrorMessage(status: number, validationErrors?: ApiValidationErrors): string {
  if (validationErrors) {
    return 'Please review the highlighted fields.'
  }

  if (status === 404) {
    return 'The requested project could not be found.'
  }

  return 'The project service could not complete your request. Please try again.'
}

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
