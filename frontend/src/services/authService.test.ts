import { afterEach, expect, test, vi } from 'vitest'

import { getSession, signIn } from './authService'

afterEach(() => {
  document.cookie = 'csrftoken=; Max-Age=0; path=/'
  localStorage.clear()
  sessionStorage.clear()
  vi.unstubAllGlobals()
})

test('checks the current session with credentialed requests', async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ authenticated: true, user: { id: 1, username: 'project-manager' } }), { status: 200 }),
  )
  vi.stubGlobal('fetch', fetchMock)

  await expect(getSession()).resolves.toEqual({ id: 1, username: 'project-manager' })
  expect(fetchMock).toHaveBeenCalledWith(
    'http://127.0.0.1:8000/auth/session/',
    expect.objectContaining({ credentials: 'include' }),
  )
  expect(localStorage).toHaveLength(0)
  expect(sessionStorage).toHaveLength(0)
})

test('sends a CSRF token and credentials when signing in', async () => {
  document.cookie = 'csrftoken=test-csrf-token; path=/'
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ user: { id: 1, username: 'project-manager' } }), { status: 200 }),
  )
  vi.stubGlobal('fetch', fetchMock)

  await expect(signIn('project-manager', 'correct-password')).resolves.toEqual({ id: 1, username: 'project-manager' })
  expect(fetchMock).toHaveBeenCalledWith(
    'http://127.0.0.1:8000/auth/login/',
    expect.objectContaining({
      credentials: 'include',
      headers: expect.objectContaining({ 'X-CSRFToken': 'test-csrf-token' }),
    }),
  )
})
