# Client Project Tracker

A full-stack application for digital-agency project managers to track client work, delivery dates, status, and priority.

## Built with

- Frontend: React, TypeScript, Vite
- Backend: Django and Django REST Framework
- Database: PostgreSQL

## Features implemented

### Required

- View all projects and a single project
- Create, edit, and delete projects
- Store projects in PostgreSQL
- Validate required client and project names
- Validate supported status and priority values
- Prevent a due date earlier than its start date
- Show meaningful validation, loading, empty, and error states

### Optional enhancements

- Search by client or project name
- Filter by status and priority
- Sort by dates, names, or priority
- Django session authentication with CSRF protection and sign-in throttling
- Backend API tests and frontend component/service tests

## Setup

### 1. Prerequisites

Install Git, Python 3.12+, PostgreSQL, Node.js 22+, and npm.

### 2. Clone and configure

```powershell
git clone <repository-url>
cd ClientProjectTracker
Copy-Item .env.example .env
```

Edit the root `.env` and provide a unique `DJANGO_SECRET_KEY` plus valid local PostgreSQL credentials. Do not commit this file.

### 3. Set up the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_projects
```

The seed command loads 12 repeatable demo projects.

### 4. Create a sign-in account

From `backend/`, with the virtual environment active:

```powershell
python manage.py shell
```

```python
from getpass import getpass
from django.contrib.auth import get_user_model

User = get_user_model()
User.objects.create_user(username=input("Username: ").strip(), password=getpass("Password: "))
exit()
```

This creates a regular application user. A Django superuser is optional and is only needed for Django Admin.

### 5. Set up the frontend

```powershell
cd ..\frontend
Copy-Item .env.example .env
npm install
```

The provided frontend `.env` uses `http://127.0.0.1:8000` for the local API. Keep this value unless the backend runs elsewhere.

## Run the application

Use two terminals from the repository root.

### Terminal 1 — Django API

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 — React frontend

```powershell
cd frontend
npm run dev
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) and sign in with the account created above. Use `127.0.0.1`, not `localhost`, so local session and CSRF cookies work consistently.

## Test

```powershell
# Backend API/integration tests
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py test

# Frontend unit/component tests and quality checks
cd ..\frontend
npm run test
npm run lint
npm run build
```

For manual API checks, see the [API Testing Guide](docs/API_TESTING_GUIDE.md).

## API

All project routes require an authenticated session.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/projects/` | List projects |
| `GET` | `/projects/{id}/` | Get one project |
| `POST` | `/projects/` | Create a project |
| `PUT` | `/projects/{id}/` | Update a project |
| `DELETE` | `/projects/{id}/` | Delete a project |

Authentication routes are `GET /auth/csrf/`, `POST /auth/login/`, `POST /auth/logout/`, and `GET /auth/session/`.

## Assumptions

- The application is for authenticated project managers; role-based permissions and per-user project ownership are outside this assessment's scope.
- The project list is a small working dataset, so search, filtering, and sorting run in the frontend. Server-side pagination/filtering can be added as the dataset grows.
- Description is optional because the requirements do not define it as required.
- Django REST Framework uses trailing-slash routes, such as `/projects/` and `/projects/{id}/`.
- Local development uses the documented `127.0.0.1` addresses for reliable session and CSRF handling.

## Security

Passwords are hashed by Django. The application uses server-managed `HttpOnly` sessions, CSRF protection, explicit credentialed CORS origins, and login throttling. React does not store passwords or reusable access tokens.

For production, use a fresh strong `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, explicit allowed hosts, HTTPS, and secure cookies.

## Documentation

- [DevOps Guide](docs/DEVOPS_GUIDE.md) — environment setup, PostgreSQL provisioning, troubleshooting, and repository updates
- [API Testing Guide](docs/API_TESTING_GUIDE.md) — manual authentication, CRUD, and validation checks
- [Technical Overview](docs/TECHNICAL_OVERVIEW.md) — architecture, validation, security, and AI-use disclosure

## AI use

OpenAI Codex assisted with planning, code scaffolding, debugging, documentation, UI refinement, and verification guidance. The developer reviewed the implementation and remains responsible for the final code, testing, configuration, and submission.
