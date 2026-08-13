# DevOps Guide

This guide explains how to configure a newly cloned project, run the full stack, fetch repository updates, and resolve common local setup problems.

## Prerequisites

- Git
- Python 3.12 or newer
- PostgreSQL (version 18 is used in development; another supported version should work)
- `psql`, pgAdmin, or another PostgreSQL administration client

Node.js 22+ and npm are required to run the React frontend.

```text
git --version
python --version
psql --version
```

On some macOS or Linux systems, use `python3` instead of `python`.

## Set up a newly cloned project

### 1. Clone the repository

```powershell
git clone <repository-url>
cd ClientProjectTracker
```

Run the remaining commands from the repository root unless stated otherwise.

### 2. Configure the environment

PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

Edit `.env` and replace the placeholder secrets:

```dotenv
DJANGO_SECRET_KEY=replace-with-a-long-unique-random-value
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1

DB_NAME=client_project_tracker
DB_USER=postgres
DB_PASSWORD=replace-with-your-postgres-superuser-password
DB_HOST=127.0.0.1
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:5173
DJANGO_COOKIE_SECURE=False
DJANGO_SESSION_COOKIE_AGE=28800
```

The project currently uses the local PostgreSQL `postgres` superuser. Set `DB_PASSWORD` to that user's password. The `.env` file is ignored by Git and must never be committed. Django refuses to start when `DJANGO_SECRET_KEY` is missing.

`DJANGO_COOKIE_SECURE=False` is for local HTTP development only. Set it to `True` when the deployed application is served over HTTPS. Keep the CORS and CSRF origin lists limited to the exact frontend origins that need credentialed API access.

In production, set `DJANGO_DEBUG=False`, configure explicit `DJANGO_ALLOWED_HOSTS`, serve the application through HTTPS, and set `DJANGO_COOKIE_SECURE=True`. Django refuses to start in production mode without allowed hosts or secure session cookies.

### 3. Configure PostgreSQL

Ensure PostgreSQL is running, then connect using the `postgres` superuser:

```powershell
psql -U postgres -h 127.0.0.1
```

Create the application database:

```sql
CREATE DATABASE client_project_tracker;
\q
```

In pgAdmin, connect to the local server as `postgres`, right-click **Databases**, select **Create > Database**, and enter `client_project_tracker`. Do not recreate the database if it already exists.

Optionally verify the connection:

```powershell
psql -U postgres -h 127.0.0.1 -d client_project_tracker -c "SELECT 1;"
```

### 4. Create the Python environment

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

The virtual environment is local and ignored by Git. Activate it whenever a new terminal is opened.

### 5. Initialize and verify the backend

From `backend/`, with the virtual environment active:

```powershell
python manage.py migrate
python manage.py check
python manage.py showmigrations projects
python manage.py test
```

`showmigrations projects` should display `[X] 0001_initial`.

### 6. Run the backend

```powershell
python manage.py runserver
```

The backend runs at [http://127.0.0.1:8000/](http://127.0.0.1:8000/), and the required project API is available at [http://127.0.0.1:8000/projects/](http://127.0.0.1:8000/projects/). A `404` at the root `/` is expected because no root route is defined. Stop the server with `Ctrl+C`.

Create a regular project-manager account once before opening the frontend:

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

Django stores the account password as a hash. Do not place that password in `.env`, source files, tests, or documentation. `python manage.py createsuperuser` is optional and only needed for Django Admin access.

### 7. Run the frontend

Open a second terminal from the repository root:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/). Keep Django running in the first terminal. Use `127.0.0.1` rather than `localhost` so the browser can return Django's session and CSRF cookies to the API. The frontend reads the required `VITE_API_BASE_URL` from `frontend/.env`; set it to `http://127.0.0.1:8000` for local development.

Verify the frontend after installation or changes:

```powershell
npm run test
npm run lint
npm run build
```

## Authentication and local security checks

- Use `http://127.0.0.1:5173/`, not `localhost`, so browser cookies match the `127.0.0.1` API host.
- Project endpoints return `401` before sign-in and after sign-out.
- State-changing requests require CSRF verification and return a safe `403` error if the token is missing or invalid.
- Five failed login attempts for the same username and IP address are throttled for 15 minutes. Restart the backend during local development if you deliberately test the limit and need to clear it.
- Never place passwords, cookies, CSRF tokens, database credentials, or `DJANGO_SECRET_KEY` in Git, logs, screenshots, or documentation.

## Load demonstration data

From `backend/`, with the virtual environment active:

```powershell
python manage.py seed_projects
```

The command loads twelve fictional client projects. It can be rerun safely: missing seed records are created, changed seed values are synchronized, duplicates are avoided, and unrelated user projects are preserved.

After starting Django, verify the records through the API:

```powershell
curl.exe http://127.0.0.1:8000/projects/
```


## Fetch the latest repository changes

From the repository root, check for local work:

```powershell
git status
```

Commit or stash changes that must be kept, then fetch the latest version of the current branch:

```powershell
git pull
```

Synchronize and verify the backend:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py check
python manage.py test
```

After each pull, review `.env.example` for new variables and add them to the local `.env` without overwriting existing secrets. The ignored `.env` and `.venv` remain unchanged by `git pull`.

## Daily workflow

```powershell
cd ClientProjectTracker\backend
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

Reinstall requirements after `requirements.txt` changes and apply migrations after new migration files are pulled. In a second terminal, run `npm install` after `frontend/package.json` changes, then use `npm run test`, `npm run lint`, and `npm run build` to verify the frontend before starting it with `npm run dev`.

## Troubleshooting

| Symptom | Resolution |
| --- | --- |
| `DJANGO_SECRET_KEY must be set` | Confirm `.env` exists in the repository root or `backend/` and contains a value. |
| `connection refused` | Start PostgreSQL and confirm `DB_HOST` and `DB_PORT`. |
| `password authentication failed` | Make `DB_USER` and `DB_PASSWORD` match the PostgreSQL credentials. |
| `database ... does not exist` | Create the database or correct `DB_NAME` in `.env`. |
| PowerShell blocks `Activate.ps1` | Use `.\.venv\Scripts\python.exe` directly for the Python commands. |
| Port `8000` is in use | Run `python manage.py runserver 8001`. |
| CORS request fails | Add the exact frontend origin to `CORS_ALLOWED_ORIGINS`. |
| Port `5173` is in use | Run `npm run dev -- --port 5174`, then add that exact `127.0.0.1` origin to both `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`. |
