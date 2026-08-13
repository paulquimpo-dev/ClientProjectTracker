import { ApiError, request } from './apiClient'

export interface AuthenticatedUser {
  id: number
  username: string
}

interface SessionResponse {
  authenticated: boolean
  user?: AuthenticatedUser
}

export async function getSession(): Promise<AuthenticatedUser | null> {
  const session = await request<SessionResponse>('/auth/session/', {}, false)
  return session.authenticated && session.user ? session.user : null
}

export async function signIn(username: string, password: string): Promise<AuthenticatedUser> {
  try {
    const response = await request<{ user: AuthenticatedUser }>(
      '/auth/login/',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) },
      false,
    )
    return response.user
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError('Invalid username or password.', 401)
    }
    if (error instanceof ApiError && error.status === 429) {
      throw new ApiError('Too many sign-in attempts. Please wait before trying again.', 429)
    }
    throw error
  }
}

export function signOut(): Promise<void> {
  return request<void>('/auth/logout/', { method: 'POST' })
}

export { ApiError }
