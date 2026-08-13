import { useCallback, useEffect, useState } from 'react'

import { ProjectList } from '../components/ProjectList'
import { getProjects } from '../services/projectService'
import type { Project } from '../types/project'

type LoadState = 'loading' | 'success' | 'error'

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')

  const loadProjects = useCallback(async () => {
    setLoadState('loading')

    try {
      setProjects(await getProjects())
      setLoadState('success')
    } catch {
      setLoadState('error')
    }
  }, [])

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
        <button type="button" className="button button--primary" disabled title="Project creation will be available in Phase 10">
          <span aria-hidden="true">+</span> New Project
        </button>
      </header>

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
