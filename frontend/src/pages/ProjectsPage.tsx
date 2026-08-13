import { useCallback, useEffect, useMemo, useState } from 'react'

import { ConfirmDialog } from '../components/ConfirmDialog'
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

type LoadState = 'loading' | 'success' | 'error'

type SortField =
  | 'created-at'
  | 'due-date'
  | 'start-date'
  | 'client-name'
  | 'project-name'
  | 'priority'

type SortDirection = 'ascending' | 'descending'

const priorityRank: Record<ProjectPriority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
}

export function ProjectsPage() {
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

  useEffect(() => {
    void loadProjects()
  }, [loadProjects])

  return (
    <main className="projects-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Client Project Tracker</p>
          <h1>Projects</h1>
          <p className="page-header__summary">Manage client projects and delivery timelines.</p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => { setIsCreating(true); setEditingProject(null); setSuccessMessage(null); setActionError(null) }}
          aria-expanded={isCreating}
        >
          <span aria-hidden="true">+</span> New Project
        </button>
      </header>

      <div className="project-controls" aria-label="Project search, filters, and sorting">
        <div className="project-search">
        <label htmlFor="project-search">Search projects</label>
        <div className="project-search__input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            id="project-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by client or project name"
          />
        </div>
        </div>

        <div className="project-filter">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as ProjectStatus | 'all')}
          >
            <option value="all">All statuses</option>
            {PROJECT_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </div>

        <div className="project-filter">
          <label htmlFor="priority-filter">Priority</label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as ProjectPriority | 'all')}
          >
            <option value="all">All priorities</option>
            {PROJECT_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </div>

        <div className="project-filter project-filter--sort">
          <label htmlFor="project-sort">Sort by</label>
          <div className="project-sort-control">
            <select
              id="project-sort"
              value={sortField}
              onChange={(event) => setSortField(event.target.value as SortField)}
            >
              <option value="created-at">Date created</option>
              <option value="due-date">Due date</option>
              <option value="start-date">Start date</option>
              <option value="client-name">Client name</option>
              <option value="project-name">Project name</option>
              <option value="priority">Priority</option>
            </select>
            <button
              type="button"
              className="sort-direction-button"
              onClick={() => setSortDirection((direction) => direction === 'ascending' ? 'descending' : 'ascending')}
              aria-label={`Sort ${sortDirection === 'ascending' ? 'descending' : 'ascending'}`}
              title={`Sort ${sortDirection === 'ascending' ? 'descending' : 'ascending'}`}
            >
              <span aria-hidden="true">{sortDirection === 'ascending' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>
      </div>

      {isCreating ? (
        <ProjectForm
          mode="create"
          submitLabel="Create Project"
          submittingLabel="Creating project…"
          onCancel={() => setIsCreating(false)}
          onSubmit={handleCreateProject}
        />
      ) : null}

      {editingProject ? (
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
          submitLabel="Update Project"
          submittingLabel="Updating project…"
          onCancel={() => setEditingProject(null)}
          onSubmit={handleUpdateProject}
        />
      ) : null}

      {deletingProject ? (
        <ConfirmDialog
          projectName={deletingProject.projectName}
          isDeleting={isDeleting}
          onCancel={() => { setDeletingProject(null); setActionError(null) }}
          onConfirm={() => void handleDeleteProject()}
        />
      ) : null}

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
