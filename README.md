# Client Project Tracker

A full-stack client-project management application being built for the KODA Kollectiv Full Stack Developer Technical Assessment. The intended application lets an agency manage projects, their delivery dates, status, and priority through a React interface backed by a Django REST API and PostgreSQL.

## Current status

Phases 1–2 — Django Backend Foundation and Project Data Model are complete and verified. The backend connects to PostgreSQL, uses Django REST Framework, permits requests from the planned local Vite frontend origin, and persists Project records.

REST CRUD endpoints, the React frontend, and automated application tests are planned for subsequent phases. They are not implemented yet.

## Planned features

- List projects
- Create, edit, and delete projects
- Persist projects in PostgreSQL
- Validate project input and date ranges on the backend
- Display useful loading, empty, error, and field-validation states in the frontend

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend (planned) | React, TypeScript, Vite |
| Backend | Python, Django, Django REST Framework |
| Database | PostgreSQL |
| Configuration | `python-dotenv`, `.env` |
| Cross-origin requests | `django-cors-headers` |

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

The backend follows Django's conventional application structure. As the project evolves, requests will flow from URL routing to DRF views, serializers, models, and PostgreSQL.

## Repository structure

```text
ClientProjectTracker/
├── backend/
│   ├── config/                 # Django configuration
│   ├── projects/               # Project model, migration, and future API code
│   ├── manage.py
│   └── requirements.txt
├── .env.example                # Safe environment-variable template
├── .gitignore
├── KODA_FullStack_AI_IDE_Development_Blueprint.md
└── README.md
```

## Prerequisites

- Python 3.12 or newer
- PostgreSQL 18 (or another supported PostgreSQL version)
- Git
- Node.js and npm (required when the planned frontend is added)

## Environment setup

1. Copy the template:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` and set real local values. Do not commit this file.

   ```dotenv
   DJANGO_SECRET_KEY=your-unique-django-secret-key
   DJANGO_DEBUG=True
   DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

   DB_NAME=client_project_tracker
   DB_USER=postgres
   DB_PASSWORD=your-postgresql-password
   DB_HOST=127.0.0.1
   DB_PORT=5432

   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

`DJANGO_SECRET_KEY` and `DB_PASSWORD` must be supplied locally. The application deliberately refuses to start when `DJANGO_SECRET_KEY` is missing.

## Database setup

Create the development database with a PostgreSQL role that has permission to create databases:

```sql
CREATE DATABASE client_project_tracker;
```

If you use a different database name, username, host, port, or password, update the matching `DB_*` values in `.env`.

## Backend setup and running

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py check
python manage.py runserver
```

The development server runs at `http://127.0.0.1:8000/` by default.

If PowerShell blocks activation scripts, run the virtual environment interpreter directly:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py runserver
```

## API

The CRUD API is not available yet. The planned endpoints are:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/` | List projects |
| `GET` | `/api/projects/{id}/` | Retrieve one project |
| `POST` | `/api/projects/` | Create a project |
| `PUT` | `/api/projects/{id}/` | Update a project |
| `DELETE` | `/api/projects/{id}/` | Delete a project |

These routes will be introduced only after the Project model and serializer are implemented.

## Planned validation rules

The backend will be the authoritative validation layer. Planned rules include:

- Client name and project name are required and cannot be whitespace-only.
- Status must be one of `Planning`, `In Progress`, `On Hold`, or `Completed`.
- Priority must be one of `Low`, `Medium`, or `High`.
- Start date and due date are required.
- Due date cannot be earlier than start date.

## Verification completed

The following Phase 1–2 checks have passed locally:

```text
Django system check
PostgreSQL authenticated connection
Direct PostgreSQL query (SELECT 1)
Django REST Framework configuration
CORS configuration for http://localhost:5173
Python dependency integrity check
Project migration applied
Project created and retrieved through the Django ORM
```

The initial `projects.0001_initial` migration has been applied. Project API routes and serializer validation will be added in later phases.

## Security and configuration

- `.env` and `backend/.venv/` are ignored by Git.
- Database credentials and Django secrets are loaded from environment variables.
- CORS is configured with an explicit local frontend origin rather than a wildcard.
- The project uses Django's ORM; raw dynamic SQL is not planned.

## Development plan

The detailed phase-by-phase implementation plan is in [KODA_FullStack_AI_IDE_Development_Blueprint.md](KODA_FullStack_AI_IDE_Development_Blueprint.md). Development follows that blueprint and prioritizes required CRUD functionality, validation, error handling, and documentation before optional enhancements.

See [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) for the current verified phase status and next milestone.

## AI-assisted development

AI assistance is used to help scaffold, document, and verify implementation work. All generated changes are reviewed against the project blueprint, and functionality is verified with local commands before it is reported as complete.

## Known limitations

At the current backend stage:

- There are no project API endpoints.
- There is no React frontend.
- There is no seed command or automated application test suite.

These limitations are intentional and will be addressed in their respective implementation phases.
