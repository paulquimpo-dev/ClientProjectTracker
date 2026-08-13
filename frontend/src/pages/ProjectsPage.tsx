import { useCallback, useEffect, useState } from 'react'

import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { createProject, getProjects } from '../services/projectService'
import type { Project, ProjectInput } from '../types/project'

type LoadState = 'loading' | 'success' | 'error'

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [isCreating, setIsCreating] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
    setSuccessMessage(`“${project.projectName}” was created successfully.`)
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
          onClick={() => { setIsCreating(true); setSuccessMessage(null) }}
          aria-expanded={isCreating}
        >
          <span aria-hidden="true">+</span> New Project
        </button>
      </header>

      {isCreating ? (
        <ProjectForm
          submitLabel="Create Project"
          submittingLabel="Creating project…"
          onCancel={() => setIsCreating(false)}
          onSubmit={handleCreateProject}
        />
      ) : null}

      {successMessage ? <p className="success-message" role="status">{successMessage}</p> : null}

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

      {loadState === 'success' && projects.length > 0 ? <ProjectList projects={projects} /> : null}
    </main>
  )
}
