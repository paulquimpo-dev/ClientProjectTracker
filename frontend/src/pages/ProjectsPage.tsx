import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { ApiError, createProject, deleteProject, getProjects, updateProject } from '../services/projectService'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type Project,
  type ProjectInput,
  type ProjectPriority,
  type ProjectStatus,
} from '../types/project'
import type { AuthenticatedUser } from '../services/authService'

type LoadState = 'loading' | 'success' | 'error'

type SortField =
  | 'created-at'
  | 'due-date'
  | 'start-date'
  | 'client-name'
  | 'project-name'
  | 'priority'

type SortDirection = 'ascending' | 'descending'

function getSortDirectionDescription(field: SortField, direction: SortDirection) {
  if (field === 'priority') return direction === 'ascending' ? 'Low to high priority' : 'High to low priority'
  if (field === 'client-name' || field === 'project-name') return direction === 'ascending' ? 'A to Z' : 'Z to A'
  return direction === 'ascending' ? 'Earliest first' : 'Latest first'
}

const priorityRank: Record<ProjectPriority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}

interface ProjectsPageProps {
  user: AuthenticatedUser
  onSignOut: () => void
}

interface SelectOption<T extends string> {
  label: string
  value: T
}

interface SelectControlProps<T extends string> {
  id: string
  label: string
  options: readonly SelectOption<T>[]
  value: T
  onChange: (value: T) => void
}

function SelectControl<T extends string>({ id, label, options, value, onChange }: SelectControlProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const controlRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  useEffect(() => {
    function closeWhenClickingAway(event: MouseEvent) {
      if (!controlRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('mousedown', closeWhenClickingAway)
    return () => document.removeEventListener('mousedown', closeWhenClickingAway)
  }, [])

  useEffect(() => {
    if (isOpen) optionRefs.current[selectedIndex]?.focus()
  }, [isOpen, selectedIndex])

  function selectOption(option: SelectOption<T>) {
    onChange(option.value)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex = event.key === 'ArrowDown' ? (index + 1) % options.length : (index - 1 + options.length) % options.length

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      optionRefs.current[nextIndex]?.focus()
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      optionRefs.current[event.key === 'Home' ? 0 : options.length - 1]?.focus()
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus()
    }
  }

  return (
    <div className="custom-select" ref={controlRef}>
      <label id={`${id}-label`} htmlFor={`${id}-trigger`}>{label}</label>
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className="custom-select__trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            setIsOpen(true)
          }
        }}
      >
        <span id={`${id}-value`}>{options[selectedIndex]?.label}</span>
        <svg className="custom-select__indicator" aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen ? (
        <ul className="custom-select__menu" role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option, index) => {
            const isSelected = option.value === value

            return (
              <li key={option.value}>
                <button
                  ref={(element) => { optionRefs.current[index] = element }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className="custom-select__option"
                  onClick={() => selectOption(option)}
                  onKeyDown={(event) => handleOptionKeyDown(event, index)}
                >
                  <span>{option.label}</span>
                  {isSelected ? <span aria-hidden="true">✓</span> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export function ProjectsPage({ user, onSignOut }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [isCreating, setIsCreating] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('created-at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('descending')
  const currentSortDirectionDescription = getSortDirectionDescription(sortField, sortDirection)
  const nextSortDirection = sortDirection === 'ascending' ? 'descending' : 'ascending'
  const nextSortDirectionDescription = getSortDirectionDescription(sortField, nextSortDirection)
  const hasActiveProjectControls = searchQuery !== '' || statusFilter !== 'all' || priorityFilter !== 'all' || sortField !== 'created-at' || sortDirection !== 'descending'

  const displayedProjects = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase()

    const matchingProjects = projects.filter((project) =>
      (query === '' ||
        [project.clientName, project.projectName].some((value) =>
          value.toLocaleLowerCase().includes(query),
        )) &&
      (statusFilter === 'all' || project.status === statusFilter) &&
      (priorityFilter === 'all' || project.priority === priorityFilter),
    )

    return [...matchingProjects].sort((first, second) => {
      const comparison = (() => {
        switch (sortField) {
          case 'created-at':
            return first.created_at.localeCompare(second.created_at)
          case 'due-date':
            return first.dueDate.localeCompare(second.dueDate)
          case 'start-date':
            return first.startDate.localeCompare(second.startDate)
          case 'client-name':
            return first.clientName.localeCompare(second.clientName)
          case 'project-name':
            return first.projectName.localeCompare(second.projectName)
          case 'priority':
            return priorityRank[first.priority] - priorityRank[second.priority]
        }
      })()

      return sortDirection === 'ascending' ? comparison : -comparison
    })
  }, [priorityFilter, projects, searchQuery, sortDirection, sortField, statusFilter])

  const loadProjects = useCallback(async () => {
    setLoadState('loading')

    try {
      setProjects(await getProjects())
      setLoadState('success')
    } catch {
      setLoadState('error')
    }
  }, [])

  async function handleCreateProject(data: ProjectInput) {
    const project = await createProject(data)
    setProjects((current) => [...current, project])
    setLoadState('success')
    setIsCreating(false)
    setActionError(null)
    setSuccessMessage(`“${project.projectName}” was created successfully.`)
  }

  async function handleUpdateProject(data: ProjectInput) {
    if (!editingProject) return

    const project = await updateProject(editingProject.id, data)
    setProjects((current) => current.map((currentProject) => currentProject.id === project.id ? project : currentProject))
    setEditingProject(null)
    setActionError(null)
    setSuccessMessage(`“${project.projectName}” was updated successfully.`)
  }

  async function handleDeleteProject() {
    if (!deletingProject) return

    setIsDeleting(true)

    try {
      await deleteProject(deletingProject.id)
      setProjects((current) => current.filter((project) => project.id !== deletingProject.id))
      setSuccessMessage(`“${deletingProject.projectName}” was deleted.`)
      setDeletingProject(null)
    } catch (error: unknown) {
      setActionError(
        error instanceof ApiError ? error.message : 'Unable to delete project. Please try again.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  function resetProjectControls() {
    setSearchQuery('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortField('created-at')
    setSortDirection('descending')
  }

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  return (
    <main className="projects-page">
      <header className="page-header">
        <div className="page-header__identity">
          <img className="brand-logo brand-logo--header" src="/branding/client-project-tracker-logo.png" alt="Client Project Tracker" />
          <h1>Projects</h1>
          <p className="page-header__summary">Manage client projects and delivery timelines.</p>
        </div>
        <div className="page-header__actions">
          <div className="page-header__account">
            <p className="signed-in-user">Signed in as <strong>{user.username}</strong></p>
            <button type="button" className="button button--secondary" onClick={onSignOut}>Sign out</button>
          </div>
          <button
            type="button"
            className="button button--primary"
            onClick={() => { setIsCreating(true); setEditingProject(null); setSuccessMessage(null); setActionError(null) }}
            aria-expanded={isCreating}
          >
            <span aria-hidden="true">+</span> New Project
          </button>
        </div>
      </header>

      <div className="project-controls" aria-label="Project search, filters, and sorting">
        <div className="project-controls__heading">
          <div className="project-controls__heading-copy">
            <p>Browse projects</p>
            <span>— Search, filter, and sort.</span>
          </div>
          {loadState === 'success' ? (
            <div className="project-controls__meta">
              <span className="project-controls__count" aria-live="polite">
                {displayedProjects.length} {displayedProjects.length === 1 ? 'project' : 'projects'}
              </span>
              {hasActiveProjectControls ? (
                <button
                  type="button"
                  className="project-controls__reset"
                  onClick={resetProjectControls}
                  title="Reset search, filters, and sorting"
                >
                  Reset all
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="project-search">
        <label htmlFor="project-search">Search</label>
        <div className="project-search__input-wrap">
          <svg className="project-search__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            id="project-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by client or project name"
          />
        </div>
        </div>

        <SelectControl
          id="status-filter"
          label="Status"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          options={[
            { value: 'all', label: 'All statuses' },
            ...PROJECT_STATUSES.map((status) => ({ value: status, label: status })),
          ]}
        />

        <SelectControl
          id="priority-filter"
          label="Priority"
          value={priorityFilter}
          onChange={(value) => setPriorityFilter(value)}
          options={[
            { value: 'all', label: 'All priorities' },
            ...PROJECT_PRIORITIES.map((priority) => ({ value: priority, label: priority })),
          ]}
        />

        <div className="project-filter project-filter--sort">
          <div className="project-sort-control">
            <SelectControl
              id="project-sort"
              label="Sort by"
              value={sortField}
              onChange={(value) => setSortField(value)}
              options={[
                { value: 'created-at', label: 'Date created' },
                { value: 'due-date', label: 'Due date' },
                { value: 'start-date', label: 'Start date' },
                { value: 'client-name', label: 'Client name' },
                { value: 'project-name', label: 'Project name' },
                { value: 'priority', label: 'Priority' },
              ]}
            />
            <button
              type="button"
              className="sort-direction-button"
              onClick={() => setSortDirection((direction) => direction === 'ascending' ? 'descending' : 'ascending')}
              aria-label={`Currently ${currentSortDirectionDescription}. Select to sort ${nextSortDirectionDescription}.`}
              title={`Currently ${currentSortDirectionDescription}. Select to sort ${nextSortDirectionDescription}.`}
            >
              <svg className="sort-direction-button__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                {sortDirection === 'ascending' ? (
                  <path d="M12 20V4m0 0-5 5m5-5 5 5" />
                ) : (
                  <path d="M12 4v16m0 0-5-5m5 5 5-5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {successMessage ? <p className="success-message" role="status">{successMessage}</p> : null}
      {actionError ? <p className="form-error" role="alert">{actionError}</p> : null}

      {loadState === 'loading' ? <p className="state-message" role="status">Loading projects…</p> : null}

      {loadState === 'error' ? (
        <section className="state-message state-message--error" role="alert">
          <h2>Unable to load projects.</h2>
          <p>Please try again.</p>
          <button type="button" className="button button--secondary" onClick={() => void loadProjects()}>
            Try again
          </button>
        </section>
      ) : null}

      {isCreating ? (
        <Modal labelledBy="project-form-title" onClose={() => setIsCreating(false)}>
          <ProjectForm
            mode="create"
            submitLabel="Create project"
            submittingLabel="Creating project…"
            onCancel={() => setIsCreating(false)}
            onSubmit={handleCreateProject}
          />
        </Modal>
      ) : null}

      {editingProject ? (
        <Modal labelledBy="project-form-title" onClose={() => setEditingProject(null)}>
          <ProjectForm
            key={editingProject.id}
            mode="edit"
            initialValues={{
              clientName: editingProject.clientName,
              projectName: editingProject.projectName,
              description: editingProject.description,
              status: editingProject.status,
              priority: editingProject.priority,
              startDate: editingProject.startDate,
              dueDate: editingProject.dueDate,
            }}
            submitLabel="Save changes"
            submittingLabel="Saving changes…"
            onCancel={() => setEditingProject(null)}
            onSubmit={handleUpdateProject}
          />
        </Modal>
      ) : null}

      {deletingProject ? (
        <Modal
          labelledBy="delete-project-title"
          isDismissible={!isDeleting}
          onClose={() => { setDeletingProject(null); setActionError(null) }}
        >
          <ConfirmDialog
            projectName={deletingProject.projectName}
            isDeleting={isDeleting}
            onCancel={() => { setDeletingProject(null); setActionError(null) }}
            onConfirm={() => void handleDeleteProject()}
          />
        </Modal>
      ) : null}

      {loadState === 'success' && projects.length === 0 ? (
        <section className="state-message">
          <h2>No projects found.</h2>
          <p>Create a project to begin tracking client work.</p>
        </section>
      ) : null}

      {loadState === 'success' && projects.length > 0 && displayedProjects.length === 0 ? (
        <section className="state-message">
          <h2>No matching projects found.</h2>
          <p>Try changing your search or filters.</p>
        </section>
      ) : null}

      {loadState === 'success' && projects.length > 0 ? (
        <ProjectList
          projects={displayedProjects}
          onEdit={(project) => { setEditingProject(project); setIsCreating(false); setSuccessMessage(null); setActionError(null) }}
          onDelete={(project) => { setDeletingProject(project); setSuccessMessage(null); setActionError(null) }}
        />
      ) : null}
    </main>
  )
}
