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

Create a regular project-manager account before signing in. From `backend/`, with the virtual environment active:

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

The frontend `.env` may retain its provided local API URL unless the backend runs elsewhere. Django stores the account password as a secure hash, not readable text. A superuser is optional and needed only for Django Admin, not for signing in to this application.

For database provisioning, macOS/Linux commands, troubleshooting, and repository updates, see the [DevOps Guide](docs/DEVOPS_GUIDE.md).

## How to run

Use two terminals from the repository root after setup is complete.

### Terminal 1 — Django API

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver
```

The required API runs at [http://127.0.0.1:8000/projects/](http://127.0.0.1:8000/projects/). Sign in through the frontend with the regular account created above; project endpoints return `401 Unauthorized` without an authenticated session.

### Terminal 2 — React frontend

```powershell
cd frontend
npm run dev
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in a browser. Use this exact host—not `localhost`—because the local Django session and CSRF cookies are issued for `127.0.0.1`. Press `Ctrl+C` in either terminal to stop that development server.

Set `VITE_API_BASE_URL` in `frontend/.env` to the Django API base URL, such as `http://127.0.0.1:8000`. Keep `http://127.0.0.1:5173` in `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` for the local session-authentication flow.

## Testing

### Automated tests

- Backend: Django API/integration tests run against a temporary test database.
- Frontend: Vitest unit/component tests run in a simulated browser.

```powershell
# Backend API/integration tests
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py test

# Frontend unit/component tests
cd ../frontend
npm run test
```

### Frontend quality checks

```powershell
cd frontend
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
- Filter loaded projects by status and priority
- Sort loaded projects by date, name, or priority
- Sign in and sign out with Django session authentication
- Load repeatable demonstration data with `python manage.py seed_projects`

## Assumptions

- The application is used by authenticated project managers; role-based permissions and user-specific project ownership are outside this assessment's scope.
- The project list is a small working dataset, so search, filtering, and sorting run in the frontend. Server-side pagination and filtering can be added when the dataset grows.
- Description is optional because the requirements do not mark it as required.
- Django REST Framework uses canonical trailing-slash routes, such as `/projects/` and `/projects/{id}/`.
- Local development uses the documented `127.0.0.1` frontend and backend addresses so session and CSRF cookies work consistently.

## API and validation

| Method   | Endpoint          | Purpose            |
| -------- | ----------------- | ------------------ |
| `GET`    | `/projects/`      | List projects      |
| `GET`    | `/projects/{id}/` | Retrieve a project |
| `POST`   | `/projects/`      | Create a project   |
| `PUT`    | `/projects/{id}/` | Update a project   |
| `DELETE` | `/projects/{id}/` | Delete a project   |

Project routes require an authenticated session. The authentication endpoints are `GET /auth/csrf/`, `POST /auth/login/`, `POST /auth/logout/`, and `GET /auth/session/`.

## Security

- Django password hashes and server-managed `HttpOnly` session cookies protect credentials; React does not store passwords or tokens in browser storage.
- Authentication, project writes, and sign-out are protected by CSRF checks.
- Only the configured frontend origin can make credentialed API requests; local development uses `http://127.0.0.1:5173/` consistently.
- Five failed sign-in attempts for the same username and IP address are throttled for 15 minutes. Restart the backend to clear local development throttle state.
- Production configuration requires `DJANGO_DEBUG=False`, explicit allowed hosts, HTTPS, and secure cookies.

The API uses camelCase fields. Client and project names are required; status and priority must use supported values; start and due dates are required; and a due date cannot be earlier than its start date. The backend is authoritative, while the frontend provides immediate field feedback.

## Documentation

- [DevOps Guide](docs/DEVOPS_GUIDE.md) — clone, configure, run, update, and troubleshoot the project
- [API Testing Guide](docs/API_TESTING_GUIDE.md) — manually verify CRUD behavior with curl or Postman
- [Technical Overview](docs/TECHNICAL_OVERVIEW.md) — architecture, structure, validation, and security

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

| Layer         | Technology                                      |
| ------------- | ----------------------------------------------- |
| Frontend      | React, TypeScript, Vite                         |
| Backend       | Python 3.12+, Django 5.2, Django REST Framework |
| Database      | PostgreSQL                                      |
| Configuration | `python-dotenv`, `.env`                         |

## Project status

The required core and planned optional features are complete: backend CRUD, PostgreSQL persistence, React CRUD UI, validation, failure handling, authentication, search/filter/sort tools, automated tests, security hardening, and documentation.

A fresh-clone verification remains recommended before external submission.

## AI-assisted development

OpenAI Codex assisted with planning, scaffolding, documentation, debugging, and verification guidance. All AI-assisted output was reviewed by the developer, who remains responsible for the implementation and submission. Details are in the [Technical Overview](docs/TECHNICAL_OVERVIEW.md#ai-assisted-development).

## Known limitations

- The required full-stack core is complete.
- Backend and frontend automated tests and repeatable seed data are implemented.
- Authentication uses Django password hashing, server-managed sessions, `HttpOnly` session cookies, CSRF protection, and restricted credentialed CORS.
