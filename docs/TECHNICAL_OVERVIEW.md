# Technical Overview

## Architecture

```text
React + TypeScript frontend (planned)
             |
          REST/JSON
             |
Django REST Framework backend
             |
        Django ORM
             |
        PostgreSQL
```

The backend follows Django's conventional structure. Requests will flow through URL routing, Django REST Framework views, serializers, models, and PostgreSQL.

## Repository structure

```text
ClientProjectTracker/
|-- backend/
|   |-- config/                 # Django settings and root URLs
|   |-- projects/               # Model, migration, admin, and serializer
|   |-- manage.py
|   `-- requirements.txt
|-- docs/                       # Extended project documentation
|-- .env.example                # Safe configuration template
|-- KODA_FullStack_AI_IDE_Development_Blueprint.md
|-- PROJECT_PROGRESS.md
`-- README.md
```

## API plan

The CRUD API will be introduced in Phase 4.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/` | List projects |
| `GET` | `/api/projects/{id}/` | Retrieve one project |
| `POST` | `/api/projects/` | Create a project |
| `PUT` | `/api/projects/{id}/` | Update a project |
| `DELETE` | `/api/projects/{id}/` | Delete a project |

The external API uses camelCase fields such as `clientName`, `projectName`, `startDate`, and `dueDate`. The serializer maps these fields to Django's internal snake_case model fields.

## Validation rules

The backend is the authoritative validation layer. It currently enforces:

- Client and project names are required and cannot contain only whitespace.
- Status must be `Planning`, `In Progress`, `On Hold`, or `Completed`.
- Priority must be `Low`, `Medium`, or `High`.
- Start and due dates are required.
- The due date cannot be earlier than the start date.

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
- [Development Blueprint](../KODA_FullStack_AI_IDE_Development_Blueprint.md)
- [Project Progress](../PROJECT_PROGRESS.md)
