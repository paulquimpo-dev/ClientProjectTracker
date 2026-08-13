interface ConfirmDialogProps {
  projectName: string
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ projectName, isDeleting, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-project-title" aria-describedby="delete-project-description">
      <p className="eyebrow">Delete project</p>
      <h2 id="delete-project-title">Delete this project?</h2>
      <p id="delete-project-description">
        Are you sure you want to delete <strong>“{projectName}”</strong>? This action cannot be undone.
      </p>
      <div className="confirm-dialog__actions">
        <button type="button" className="button button--secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </button>
        <button type="button" className="button button--danger-solid" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting project…' : 'Delete Project'}
        </button>
      </div>
    </section>
  )
}
