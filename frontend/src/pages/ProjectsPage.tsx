import { useCallback, useEffect, useState } from 'react'

import { ConfirmDialog } from '../components/ConfirmDialog'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { ApiError, createProject, deleteProject, getProjects, updateProject } from '../services/projectService'
import type { Project, ProjectInput } from '../types/project'

type LoadState = 'loading' | 'success' | 'error'

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [isCreating, setIsCreating] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

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

      {loadState === 'success' && projects.length > 0 ? (
        <ProjectList
          projects={projects}
          onEdit={(project) => { setEditingProject(project); setIsCreating(false); setSuccessMessage(null); setActionError(null) }}
          onDelete={(project) => { setDeletingProject(project); setSuccessMessage(null); setActionError(null) }}
        />
      ) : null}
    </main>
  )
}
