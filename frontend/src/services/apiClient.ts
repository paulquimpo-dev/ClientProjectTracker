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

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

export async function request<T>(
  path: string,
  options: RequestInit = {},
  notifyUnauthorized = true,
): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError('Project service is not configured. Set VITE_API_BASE_URL and restart the frontend.', 0)
  }

  const method = (options.method ?? 'GET').toUpperCase()
  const csrfToken = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ? await getCsrfToken() : null
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError('Unable to reach the project service. Please try again.', 0)
  }

  if (response.status === 204) return undefined as T

  const responseBody: unknown = await response.json().catch(() => undefined)

  if (!response.ok) {
    const validationErrors = isValidationErrors(responseBody) ? responseBody : undefined
    if (response.status === 401 && notifyUnauthorized) {
      window.dispatchEvent(new Event('authentication-required'))
    }
    throw new ApiError(getErrorMessage(response.status, validationErrors), response.status, validationErrors)
  }

  return responseBody as T
}

async function getCsrfToken(): Promise<string | null> {
  const existingToken = getCookie('csrftoken')
  if (existingToken) return existingToken

  if (!apiBaseUrl) return null

  try {
    const response = await fetch(`${apiBaseUrl}/auth/csrf/`, { credentials: 'include' })
    if (!response.ok) return null
    const data = await response.json() as { csrfToken?: unknown }
    return getCookie('csrftoken') ?? (typeof data.csrfToken === 'string' ? data.csrfToken : null)
  } catch {
    return null
  }
}

function getCookie(name: string): string | null {
  const value = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`))
  return value ? decodeURIComponent(value.split('=').slice(1).join('=')) : null
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
  if (validationErrors) return 'Please review the highlighted fields.'
  if (status === 401) return 'Your session has ended. Please sign in again.'
  if (status === 403) return 'This action could not be verified. Refresh the page and try again.'
  if (status === 404) return 'The requested project could not be found.'
  return 'The project service could not complete your request. Please try again.'
}
