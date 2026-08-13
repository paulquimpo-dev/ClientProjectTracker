# Client Project Tracker

A full-stack client-project management application for an agency. It uses a React frontend, Django REST API, and PostgreSQL database.

## Quick start

Prerequisites: Git, Python 3.12+, PostgreSQL, Node.js 22+, and npm.

Clone and configure the project once:

```powershell
git clone <repository-url>
cd ClientProjectTracker
Copy-Item .env.example .env
```

Update the root `.env` with a unique `DJANGO_SECRET_KEY` and valid PostgreSQL credentials, then install dependencies and prepare the database:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_projects

cd ../frontend
Copy-Item .env.example .env
npm install
```

The frontend `.env` may retain its provided local API URL unless the backend runs elsewhere.

For database provisioning, macOS/Linux commands, troubleshooting, and repository updates, see the [DevOps Guide](docs/DEVOPS_GUIDE.md).

## How to run

Use two terminals from the repository root after setup is complete.

### Terminal 1 — Django API

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

The API runs at [http://127.0.0.1:8000/api/projects/](http://127.0.0.1:8000/api/projects/).

### Terminal 2 — React frontend

```powershell
cd frontend
npm run dev
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in a browser. Press `Ctrl+C` in either terminal to stop that development server.

`VITE_API_BASE_URL` defaults to `http://127.0.0.1:8000/api`. Keep both `http://localhost:5173` and `http://127.0.0.1:5173` in `CORS_ALLOWED_ORIGINS` so either local Vite address can reach the API.

## Testing

```powershell
# Backend
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py test

# Frontend
cd ../frontend
npm run lint
npm run build
```

For manual API verification, use the [API Testing Guide](docs/API_TESTING_GUIDE.md).

## Features

- View projects stored in PostgreSQL
- Create, edit, and delete projects through the React interface
- Validate names, allowed status/priority values, and delivery dates
- Display loading, empty, success, and friendly error states
- Search loaded projects by client or project name
- Load repeatable demonstration data with `python manage.py seed_projects`

## API and validation

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/` | List projects |
| `GET` | `/api/projects/{id}/` | Retrieve a project |
| `POST` | `/api/projects/` | Create a project |
| `PUT` | `/api/projects/{id}/` | Update a project |
| `DELETE` | `/api/projects/{id}/` | Delete a project |

The API uses camelCase fields. Client and project names are required; status and priority must use supported values; start and due dates are required; and a due date cannot be earlier than its start date. The backend is authoritative, while the frontend provides immediate field feedback.

## Documentation

- [DevOps Guide](docs/DEVOPS_GUIDE.md) — clone, configure, run, update, and troubleshoot the project
- [API Testing Guide](docs/API_TESTING_GUIDE.md) — manually verify CRUD behavior with curl or Postman
- [Technical Overview](docs/TECHNICAL_OVERVIEW.md) — architecture, structure, validation, and security
- [UI/UX Design Guide](docs/UI_UX_DESIGN_GUIDE.md) — visual direction, accessibility, and UI principles
- [Development Blueprint](KODA_FullStack_AI_IDE_Development_Blueprint.md) — complete phase-by-phase plan
- [Project Progress](PROJECT_PROGRESS.md) — completed phases and verification records

## Architecture

```text
React + TypeScript UI
        |
  Typed API service
        |
Django REST Framework
        |
 Django ORM + PostgreSQL
```

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Python 3.12+, Django 5.2, Django REST Framework |
| Database | PostgreSQL |
| Configuration | `python-dotenv`, `.env` |

## Project status

Phases 1–17 of the core blueprint are complete, along with the Phase 18 client-side search bonus: backend CRUD, PostgreSQL persistence, React CRUD UI, validation, failure handling, regression testing, documentation, and repository review.

The required core is complete. Frontend automated tests and optional bonus features remain future improvements.

## AI-assisted development

OpenAI Codex assisted with planning, scaffolding, documentation, debugging, and verification guidance. All AI-assisted output was reviewed by the developer, who remains responsible for the implementation and submission. Details are in the [Technical Overview](docs/TECHNICAL_OVERVIEW.md#ai-assisted-development).

## Known limitations

- The required full-stack core is complete.
- Backend automated tests and repeatable seed data are implemented.
- Frontend automated tests and optional bonus features remain future improvements.
