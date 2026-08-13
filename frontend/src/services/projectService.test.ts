import { afterEach, expect, test, vi } from 'vitest'

import { getProjects } from './projectService'

afterEach(() => {
  vi.unstubAllGlobals()
})

test('requests the required projects endpoint', async () => {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }),
  )
  vi.stubGlobal('fetch', fetchMock)

  await expect(getProjects()).resolves.toEqual([])
  expect(fetchMock).toHaveBeenCalledWith(
    'http://127.0.0.1:8000/projects/',
    expect.objectContaining({ headers: { Accept: 'application/json' } }),
  )
})

test('exposes backend validation errors to the form layer', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ clientName: ['Client name cannot be blank.'] }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  )

  await expect(getProjects()).rejects.toEqual(
    expect.objectContaining({
      name: 'ApiError',
      message: 'Please review the highlighted fields.',
      status: 400,
      validationErrors: { clientName: ['Client name cannot be blank.'] },
    }),
  )
})
