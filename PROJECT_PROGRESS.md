# Project Progress

This tracker records implementation progress against the [development blueprint](KODA_FullStack_AI_IDE_Development_Blueprint.md). A phase is marked complete only after its stated verification criteria have been checked.

## Current milestone

**Completed phase:** Phase 3 — Serializer and Backend Validation
**Next phase:** Phase 4 — Required REST CRUD API

## Phase status

| Phase | Status | Notes |
| --- | --- | --- |
| 0. Project Preparation | Partially complete | Git repository and backend virtual environment now exist. Tool availability was checked during initial setup. |
| 1. Django Backend Foundation | Complete | Django, DRF, PostgreSQL configuration, CORS, environment template, and dependency requirements are in place. Django checks, authenticated PostgreSQL connection, and a direct query passed. |
| 2. Project Data Model | Complete | The `Project` model, status and priority choices, Django admin registration, and `projects.0001_initial` migration are implemented and applied. |
| 3. Serializer and Backend Validation | Complete | `ProjectSerializer` provides camelCase API fields, normalizes text input, and enforces required names, permitted choices, and date ordering. |
| 4. Required REST CRUD API | Not started | Add project routes and CRUD endpoints. |
| 5. Seed / Test Data | Not started | Add a repeatable seed command. |
| 6. Backend Core Completion Gate | Not started | Verify all backend requirements before frontend work. |
| 7–17. Frontend and Core Completion | Not started | React foundation, CRUD interface, regression testing, documentation, and repository review. |
| 18–31. Bonus and Submission Work | Not started | Begin only after the core application is stable. |

## Phase 1 verification record

- Django system check passed.
- PostgreSQL authentication and connection to `client_project_tracker` succeeded.
- A direct database `SELECT 1` query succeeded.
- Django REST Framework is enabled.
- CORS is restricted to `http://localhost:5173` for local development.
- Installed Python dependencies passed integrity checking.

## Phase 2 verification record

- `makemigrations --check --dry-run` reported no missing migration changes.
- `migrate` applied `projects.0001_initial` to PostgreSQL.
- Django recorded the Project migration as applied.
- A Project was created and retrieved through the Django ORM.
- The temporary verification record was deleted; no verification records remain.

## Phase 3 verification record

- A valid camelCase payload passed validation, with surrounding whitespace removed from text fields.
- Missing and whitespace-only client and project names were rejected with field-specific errors.
- Invalid status and priority values were rejected.
- A due date before the start date was rejected with a `dueDate` error.
- Django database checks passed and no migration changes were introduced.

## Current limitations

- No project API endpoint exists yet.
- No React frontend exists yet.

## Update convention

After each phase, update this file with the completed phase, verification results, known limitations, and the next phase. Record release-oriented or user-facing changes in a conventional `CHANGELOG.md` only once the project has meaningful released functionality.
