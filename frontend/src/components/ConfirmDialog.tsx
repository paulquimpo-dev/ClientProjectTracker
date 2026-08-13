interface ConfirmDialogProps {
  projectName: string
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ projectName, isDeleting, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <section className="confirm-dialog" aria-labelledby="delete-project-title" aria-describedby="delete-project-description">
      <div className="confirm-dialog__title">
        <span className="confirm-dialog__warning-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8v5m0 3h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </span>
        <h2 id="delete-project-title">Delete project?</h2>
      </div>
      <p id="delete-project-description">
        Permanently delete <strong>“{projectName}”</strong>. This action cannot be undone.
      </p>
      <div className="confirm-dialog__actions">
        <button type="button" className="button button--secondary" onClick={onCancel} disabled={isDeleting} data-autofocus>
          Cancel
        </button>
        <button type="button" className="button button--danger-solid" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting project…' : 'Delete Project'}
        </button>
      </div>
    </section>
  )
}
