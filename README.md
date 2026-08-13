# Client Project Tracker

A full-stack client-project management application. It is designed to help an agency manage project delivery dates, status, and priority through a React frontend, Django REST API, and PostgreSQL database.

## Current status

Phases 1-17 are complete:

- Django backend foundation and PostgreSQL configuration
- Project data model and initial migration
- Serializer and backend validation
- REST API with project CRUD operations
- Repeatable local demonstration data command
- Verified backend completion gate
- React, TypeScript, and Vite frontend foundation
- Typed frontend API service layer and verified backend connection
- Responsive project listing with loading, empty, and API-error states
- Project creation form with frontend and backend validation feedback
- Project editing and confirmed deletion with persisted API updates
- Friendly frontend validation, loading, and failure handling across CRUD flows
- Required full-stack core application completion checkpoint
- Core regression testing, reviewer documentation, and repository-quality review

The required core is complete. Optional bonus work and frontend automated tests remain future improvements. See [Project Progress](PROJECT_PROGRESS.md) for the current milestone.

## Features

- View projects stored in PostgreSQL
- Create, edit, and delete projects through the React interface
- Validate names, allowed status/priority values, and delivery dates
- Display loading, empty, success, and friendly error states
- Load repeatable demonstration data with `python manage.py seed_projects`

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

## Quick start

Prerequisites: Git, Python 3.12+, and PostgreSQL.

```powershell
git clone <repository-url>
cd ClientProjectTracker
Copy-Item .env.example .env
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_projects
python manage.py runserver
```

Before running the backend, update `.env` with a unique `DJANGO_SECRET_KEY` and valid local PostgreSQL credentials. The backend runs at [http://127.0.0.1:8000/](http://127.0.0.1:8000/), and the project API is available at `/api/projects/`.

For database provisioning, macOS/Linux commands, verification, troubleshooting, and repository update instructions, read the [DevOps Guide](docs/DEVOPS_GUIDE.md).

### Frontend

In a second terminal, start the Vite development server:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

The frontend runs at [http://127.0.0.1:5173/](http://127.0.0.1:5173/) by default. `VITE_API_BASE_URL` configures the Django API base URL for the service layer; it defaults to `http://127.0.0.1:8000/api` when unset. Keep both `http://localhost:5173` and `http://127.0.0.1:5173` in the backend `CORS_ALLOWED_ORIGINS` value so either local Vite address can reach the API. The list, create, edit, and confirmed-delete flows are available.

## API and validation

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/` | List projects |
| `GET` | `/api/projects/{id}/` | Retrieve a project |
| `POST` | `/api/projects/` | Create a project |
| `PUT` | `/api/projects/{id}/` | Update a project |
| `DELETE` | `/api/projects/{id}/` | Delete a project |

The API uses camelCase fields. Client and project names are required; status and priority must use supported values; start and due dates are required; and a due date cannot be earlier than its start date. The backend is authoritative, while the frontend provides immediate field feedback.

## Testing

```powershell
# Backend
cd backend
python manage.py test

# Frontend
cd ../frontend
npm run lint
npm run build
```

For manual API verification, see the [API Testing Guide](docs/API_TESTING_GUIDE.md).

## Documentation

Extended project documentation is available in the [`docs/` directory](docs/README.md):

- [DevOps Guide](docs/DEVOPS_GUIDE.md) - clone, configure, run, update, and troubleshoot the project
- [API Testing Guide](docs/API_TESTING_GUIDE.md) - manually verify CRUD behavior with curl or Postman
- [Technical Overview](docs/TECHNICAL_OVERVIEW.md) - architecture, repository structure, validation, security, and API plans
- [UI/UX Design Guide](docs/UI_UX_DESIGN_GUIDE.md) - visual direction, color roles, semantic statuses, accessibility, and layout principles
- [Development Blueprint](KODA_FullStack_AI_IDE_Development_Blueprint.md) - complete phase-by-phase implementation plan
- [Project Progress](PROJECT_PROGRESS.md) - verified phase status and next milestone

## AI tools disclosure

This project was developed with assistance from OpenAI Codex for planning, code scaffolding and review, documentation, debugging, and verification guidance. All AI-assisted output is reviewed by the developer, who retains responsibility for the final implementation and submission. More detail is included in the [Technical Overview](docs/TECHNICAL_OVERVIEW.md#ai-assisted-development).

## Known limitations

- The required full-stack core is complete; frontend automated tests and optional bonus features remain future improvements.
- Backend automated tests and repeatable seed data are implemented; frontend tests are planned for a later phase.
