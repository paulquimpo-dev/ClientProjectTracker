# Client Project Tracker

A full-stack client-project management application being built for the KODA Kollectiv Full Stack Developer Technical Assessment. The application will let an agency manage project delivery dates, status, and priority through a React interface backed by a Django REST API and PostgreSQL.

## Current status

Phases 1-3 of the [development blueprint](KODA_FullStack_AI_IDE_Development_Blueprint.md) are complete: Django backend foundation, the Project data model, and serializer validation.

The backend currently connects to PostgreSQL, uses Django REST Framework, allows requests from the planned local Vite origin, persists Project records, and validates API data. REST CRUD endpoints, the React frontend, seed data, and the full automated test suite are planned for later phases and are not yet implemented.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend (planned) | React, TypeScript, Vite |
| Backend | Python 3.12+, Django 5.2, Django REST Framework |
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

## Repository structure

```text
ClientProjectTracker/
|-- backend/
|   |-- config/                 # Django settings and root URL configuration
|   |-- projects/               # Project model, migration, admin, and serializer
|   |-- manage.py
|   `-- requirements.txt
|-- .env.example                # Safe environment-variable template
|-- .gitignore
|-- KODA_FullStack_AI_IDE_Development_Blueprint.md
|-- PROJECT_PROGRESS.md
`-- README.md
```

## DevOps guide: set up a newly cloned project

### 1. Prerequisites

Install and confirm the following tools:

- Git
- Python 3.12 or newer
- PostgreSQL (PostgreSQL 18 is used in development; another currently supported release should work)
- `psql`, pgAdmin, or another PostgreSQL administration client

Node.js and npm are not required yet because the frontend has not been added.

```text
git --version
python --version
psql --version
```

On some macOS or Linux systems, use `python3` and `pip3` in place of `python` and `pip`.

### 2. Clone the repository

```powershell
git clone <repository-url>
cd ClientProjectTracker
```

Run all remaining commands from the repository root unless a step says otherwise.

### 3. Create the local environment file

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Edit `.env` and replace both placeholder secrets:

```dotenv
DJANGO_SECRET_KEY=replace-with-a-long-unique-random-value
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=client_project_tracker
DB_USER=postgres
DB_PASSWORD=replace-with-your-postgres-superuser-password
DB_HOST=127.0.0.1
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

This project currently uses the local PostgreSQL `postgres` superuser. Set `DB_PASSWORD` to the password configured for that user during PostgreSQL installation. `.env` is ignored by Git and must never be committed. Django deliberately refuses to start if `DJANGO_SECRET_KEY` is missing.

### 4. PostgreSQL Setup

Ensure the PostgreSQL service is running, then connect using the `postgres` superuser:

```powershell
psql -U postgres -h 127.0.0.1
```

Create the application database:

```sql
CREATE DATABASE client_project_tracker;
\q
```

The same operation can be performed in pgAdmin by connecting to the local server as `postgres`, right-clicking **Databases**, selecting **Create > Database**, and entering `client_project_tracker` as the database name. If the database already exists, do not recreate it.

Verify that the `postgres` user can connect to the database before continuing:

```powershell
psql -U postgres -h 127.0.0.1 -d client_project_tracker -c "SELECT 1;"
```

### 5. Create the Python virtual environment

PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

The virtual environment is intentionally local and ignored by Git. Re-activate it whenever opening a new terminal.

### 6. Initialize and verify the backend

With the terminal still in `backend/` and the virtual environment active:

```powershell
python manage.py migrate
python manage.py check
python manage.py showmigrations projects
python manage.py test
```

`migrate` creates all Django tables, including the Phase 2 `projects_project` table. `showmigrations projects` should display `[X] 0001_initial`. The current test command is also useful as a setup smoke test, although the full application test suite is planned for a later phase.

### 7. Run the development server

```powershell
python manage.py runserver
```

The backend starts at [http://127.0.0.1:8000/](http://127.0.0.1:8000/). At the current phase, a `404` response at `/` is expected because API routes are introduced in Phase 4. A successful startup with no Django system-check errors confirms that the service and database configuration load correctly.

Stop the server with `Ctrl+C`.

### 8. Daily development workflow

After the one-time setup, the normal PowerShell workflow is:

```powershell
cd ClientProjectTracker\backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Run the dependency install after pulling changes to `requirements.txt`, and run migrations after pulling new migration files.

## DevOps guide: fetch the latest repository changes

From the repository root, first confirm that you do not have uncommitted work:

```powershell
git status
```

Commit or stash any changes you want to keep, then download the latest version of the current branch:

```powershell
git pull
```

After the pull completes, update the backend and start the application:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py check
python manage.py runserver
```

Check `.env.example` for newly added settings after each pull. Add any new settings to your local `.env` without replacing existing secrets. The `.env` file and virtual environment are ignored by Git and remain unchanged by `git pull`.

## API status

The CRUD API is not available yet. These routes are planned for Phase 4:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/` | List projects |
| `GET` | `/api/projects/{id}/` | Retrieve one project |
| `POST` | `/api/projects/` | Create a project |
| `PUT` | `/api/projects/{id}/` | Update a project |
| `DELETE` | `/api/projects/{id}/` | Delete a project |

The API uses camelCase field names such as `clientName`, `projectName`, `startDate`, and `dueDate`. The serializer maps them to Django's internal snake_case model fields.

## Validation rules

The backend is the authoritative validation layer. It currently enforces:

- Client name and project name are required and cannot be whitespace-only.
- Status must be `Planning`, `In Progress`, `On Hold`, or `Completed`.
- Priority must be `Low`, `Medium`, or `High`.
- Start date and due date are required.
- Due date cannot be earlier than start date.

## Security and configuration notes

- `.env`, `backend/.env`, and `backend/.venv/` are ignored by Git.
- Database credentials and Django secrets are loaded from environment variables.
- Local development uses `DJANGO_DEBUG=True`; production must use `False`, a production secret, restricted hosts/origins, and appropriately managed PostgreSQL credentials.
- CORS uses explicit origins rather than a wildcard.
- The project uses Django's ORM; raw dynamic SQL is not planned.

## Project plan and progress

The detailed phase-by-phase plan is in [KODA_FullStack_AI_IDE_Development_Blueprint.md](KODA_FullStack_AI_IDE_Development_Blueprint.md). See [PROJECT_PROGRESS.md](PROJECT_PROGRESS.md) for verified phase status and the next milestone.

## AI tools disclosure

This project was developed with assistance from OpenAI Codex. The AI tool was used to support:

- Planning implementation work against the development blueprint
- Scaffolding and reviewing code
- Writing and improving documentation
- Suggesting validation and verification steps
- Assisting with debugging and code-quality checks

All AI-assisted output is reviewed by the developer before it is accepted. Implementation decisions, final code, configuration, testing, and submission responsibility remain with the developer. Open-source frameworks and libraries used by the application are listed in the technology stack and dependency files.

## Known limitations

- There are no project API endpoints yet.
- There is no React frontend yet.
- There is no seed command or complete automated application test suite yet.
