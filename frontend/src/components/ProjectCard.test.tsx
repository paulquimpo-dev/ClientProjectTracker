import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import { ProjectCard } from './ProjectCard'
import type { Project } from '../types/project'

const project: Project = {
  id: 1,
  clientName: 'Acme Corporation',
  projectName: 'Website Redesign',
  description: 'Refresh the public website.',
  status: 'In Progress',
  priority: 'High',
  startDate: '2026-08-20',
  dueDate: '2026-10-15',
  created_at: '2026-08-13T12:00:44Z',
  updated_at: '2026-08-13T12:00:44Z',
}

test('renders project details and calls its actions', () => {
  const onEdit = vi.fn()
  const onDelete = vi.fn()

  render(<ProjectCard project={project} onEdit={onEdit} onDelete={onDelete} />)

  expect(screen.getByRole('heading', { name: 'Website Redesign' })).toBeInTheDocument()
  expect(screen.getByText('Acme Corporation')).toBeInTheDocument()
  expect(screen.getByText('In Progress')).toBeInTheDocument()
  expect(screen.getByText('High priority')).toBeInTheDocument()
  expect(screen.getByText(/Created/)).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

  expect(onEdit).toHaveBeenCalledWith(project)
  expect(onDelete).toHaveBeenCalledWith(project)
})
