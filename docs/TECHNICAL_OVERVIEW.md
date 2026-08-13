# Technical Overview

## Architecture

```text
React + TypeScript frontend
             |
          REST/JSON
             |
Django REST Framework backend
             |
        Django ORM
             |
        PostgreSQL
```

The frontend calls a typed API service layer. Backend requests flow through URL routing, Django REST Framework views, serializers, models, and PostgreSQL.

## Repository structure

```text
ClientProjectTracker/
|-- backend/
|   |-- config/                 # Django settings and root URLs
|   |-- projects/               # Model, migration, admin, and serializer
|   |   `-- management/commands/# Local seed command
|   |-- manage.py
|   `-- requirements.txt
|-- frontend/                   # React UI, API service, components, pages, and types
|-- docs/                       # Extended project documentation
|-- .env.example                # Safe configuration template
|-- KODA_FullStack_AI_IDE_Development_Blueprint.md
|-- PROJECT_PROGRESS.md
`-- README.md
```

## REST API

Phase 4 implements the required CRUD API.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/projects/` | List projects |
| `GET` | `/projects/{id}/` | Retrieve one project |
| `POST` | `/projects/` | Create a project |
| `PUT` | `/projects/{id}/` | Update a project |
| `DELETE` | `/projects/{id}/` | Delete a project |

The external API uses camelCase fields such as `clientName`, `projectName`, `startDate`, and `dueDate`. The serializer maps these fields to Django's internal snake_case model fields.

The API returns `200` for successful reads and updates, `201` for creation, `204` for deletion, `400` for invalid input, and `404` for missing projects. See the [API Testing Guide](API_TESTING_GUIDE.md) for repeatable manual checks.

## Automated testing

The Django test suite covers required CRUD behavior, validation rules, missing-resource responses, and the `/projects/` route contract. The frontend uses Vitest and React Testing Library to cover project-card rendering/actions and the environment-configured API service, including validation-error handling. Run `python manage.py test` from `backend/` and `npm run test` from `frontend/`.

## Validation rules

The backend is the authoritative validation layer. It currently enforces:

- Client and project names are required and cannot contain only whitespace.
- Status must be `Planning`, `In Progress`, `On Hold`, or `Completed`.
- Priority must be `Low`, `Medium`, or `High`.
- Start and due dates are required.
- The due date cannot be earlier than the start date.

## Frontend

The React UI is organized by responsibility:

- `pages/ProjectsPage.tsx` owns list/create/edit/delete screen state.
- `components/` contains reusable project cards, badges, the ProjectForm, and delete confirmation.
- `services/projectService.ts` centralizes typed HTTP requests and API error handling.
- `types/project.ts` mirrors the camelCase API contract.

The UI supports responsive project listing, create/edit forms, delete confirmation, client-side validation, backend field errors, and loading/empty/failure states.

## Demonstration data

`python manage.py seed_projects` loads six fictional Philippine-based client projects. Client and project names identify each seed record. Repeated runs avoid duplicates and synchronize the approved seed values without deleting unrelated projects.

## Configuration and security

- `.env`, `backend/.env`, and `backend/.venv/` are ignored by Git.
- Database credentials and the Django secret are loaded from environment variables.
- Local development uses `DJANGO_DEBUG=True`; production must use `False`.
- Production requires a unique secret, restricted allowed hosts and origins, and managed database credentials.
- CORS uses explicit origins rather than a wildcard.
- Database access uses Django's ORM.

## AI-assisted development

This project was developed with assistance from OpenAI Codex. It was used for:

- Planning implementation work against the development blueprint
- Scaffolding and reviewing code
- Writing and improving documentation
- Suggesting validation and verification steps
- Assisting with debugging and code-quality checks

All AI-assisted output is reviewed by the developer before acceptance. Implementation decisions, final code, configuration, testing, and submission responsibility remain with the developer. Open-source frameworks and libraries are identified in the root README and dependency files.

## Related documents

- [Documentation Index](README.md)
- [DevOps Guide](DEVOPS_GUIDE.md)
- [UI/UX Design Guide](UI_UX_DESIGN_GUIDE.md)
- [Development Blueprint](../KODA_FullStack_AI_IDE_Development_Blueprint.md)
- [Project Progress](../PROJECT_PROGRESS.md)
