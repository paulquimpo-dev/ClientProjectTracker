import { useState, type FormEvent, type ReactNode } from 'react'

import { ApiError } from '../services/projectService'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type ProjectInput,
} from '../types/project'

type FieldErrors = Partial<Record<keyof ProjectInput, string>>

interface ProjectFormProps {
  initialValues?: ProjectInput
  submitLabel: string
  submittingLabel: string
  onCancel: () => void
  onSubmit: (data: ProjectInput) => Promise<void>
}

const emptyProject: ProjectInput = {
  clientName: '',
  projectName: '',
  description: '',
  status: 'Planning',
  priority: 'Medium',
  startDate: '',
  dueDate: '',
}

const inputNames = Object.keys(emptyProject) as (keyof ProjectInput)[]

function validate(data: ProjectInput): FieldErrors {
  const errors: FieldErrors = {}

  if (!data.clientName.trim()) errors.clientName = 'Client name is required.'
  if (!data.projectName.trim()) errors.projectName = 'Project name is required.'
  if (!data.startDate) errors.startDate = 'Start date is required.'
  if (!data.dueDate) errors.dueDate = 'Due date is required.'
  if (data.startDate && data.dueDate && data.dueDate < data.startDate) {
    errors.dueDate = 'Due date cannot be earlier than start date.'
  }

  return errors
}

function getServerFieldErrors(validationErrors?: Record<string, string[]>): FieldErrors {
  if (!validationErrors) return {}

  return Object.fromEntries(
    Object.entries(validationErrors)
      .filter(([field]) => inputNames.includes(field as keyof ProjectInput))
      .map(([field, messages]) => [field, messages[0]]),
  ) as FieldErrors
}

export function ProjectForm({
  initialValues = emptyProject,
  submitLabel,
  submittingLabel,
  onCancel,
  onSubmit,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectInput>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<K extends keyof ProjectInput>(field: K, value: ProjectInput[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validate(values)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit(values)
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setFieldErrors(getServerFieldErrors(error.validationErrors))
        setSubmitError(error.message)
      } else {
        setSubmitError('Unable to save project. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="project-form-panel" aria-labelledby="project-form-title">
      <div className="project-form-panel__header">
        <div>
          <p className="eyebrow">New project</p>
          <h2 id="project-form-title">Create a project</h2>
          <p>Fields marked with an asterisk are required.</p>
        </div>
        <button type="button" className="button button--text" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>

      {submitError ? <p className="form-error" role="alert">{submitError}</p> : null}

      <form className="project-form" noValidate onSubmit={(event) => void handleSubmit(event)}>
        <FormField label="Client Name" error={fieldErrors.clientName} required>
          <input
            id="clientName"
            name="clientName"
            value={values.clientName}
            onChange={(event) => updateField('clientName', event.target.value)}
            aria-invalid={Boolean(fieldErrors.clientName)}
            aria-describedby={fieldErrors.clientName ? 'clientName-error' : undefined}
            autoComplete="organization"
          />
        </FormField>

        <FormField label="Project Name" error={fieldErrors.projectName} required>
          <input
            id="projectName"
            name="projectName"
            value={values.projectName}
            onChange={(event) => updateField('projectName', event.target.value)}
            aria-invalid={Boolean(fieldErrors.projectName)}
            aria-describedby={fieldErrors.projectName ? 'projectName-error' : undefined}
          />
        </FormField>

        <FormField label="Description" error={fieldErrors.description} className="project-form__full-width">
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={(event) => updateField('description', event.target.value)}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={fieldErrors.description ? 'description-error' : undefined}
            rows={4}
          />
        </FormField>

        <FormField label="Status" error={fieldErrors.status} required>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={(event) => updateField('status', event.target.value as ProjectInput['status'])}
            aria-invalid={Boolean(fieldErrors.status)}
            aria-describedby={fieldErrors.status ? 'status-error' : undefined}
          >
            {PROJECT_STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </FormField>

        <FormField label="Priority" error={fieldErrors.priority} required>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={(event) => updateField('priority', event.target.value as ProjectInput['priority'])}
            aria-invalid={Boolean(fieldErrors.priority)}
            aria-describedby={fieldErrors.priority ? 'priority-error' : undefined}
          >
            {PROJECT_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
          </select>
        </FormField>

        <FormField label="Start Date" error={fieldErrors.startDate} required>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={(event) => updateField('startDate', event.target.value)}
            aria-invalid={Boolean(fieldErrors.startDate)}
            aria-describedby={fieldErrors.startDate ? 'startDate-error' : undefined}
          />
        </FormField>

        <FormField label="Due Date" error={fieldErrors.dueDate} required>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={values.dueDate}
            onChange={(event) => updateField('dueDate', event.target.value)}
            aria-invalid={Boolean(fieldErrors.dueDate)}
            aria-describedby={fieldErrors.dueDate ? 'dueDate-error' : undefined}
          />
        </FormField>

        <div className="project-form__actions project-form__full-width">
          <button type="button" className="button button--secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </section>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
}

function FormField({ label, error, required = false, className = '', children }: FormFieldProps) {
  const labelId = label.replaceAll(' ', '')
  const id = `${labelId.charAt(0).toLowerCase()}${labelId.slice(1)}`

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={id}>
        {label}{required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? <p className="field-error" id={`${id}-error`}>{error}</p> : null}
    </div>
  )
}
