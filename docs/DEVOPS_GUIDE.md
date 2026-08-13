# DevOps Guide

Use the [root README](../README.md) for the standard setup and run sequence. This guide covers PostgreSQL setup, configuration details, updates, and troubleshooting.

## PostgreSQL setup

Ensure PostgreSQL is running, then connect as a local administrator:

```powershell
psql -U postgres -h 127.0.0.1
```

Create the database once:

```sql
CREATE DATABASE client_project_tracker;
\q
```

Verify the connection:

```powershell
psql -U postgres -h 127.0.0.1 -d client_project_tracker -c "SELECT 1;"
```

## Environment configuration

Copy `.env.example` to the root `.env`. Set these values for local development:

```dotenv
DJANGO_SECRET_KEY=replace-with-a-long-unique-random-value
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=127.0.0.1
DB_NAME=client_project_tracker
DB_USER=postgres
DB_PASSWORD=replace-with-your-postgresql-password
DB_HOST=127.0.0.1
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:5173
DJANGO_COOKIE_SECURE=False
DJANGO_SESSION_COOKIE_AGE=28800
```

`.env` is ignored by Git. Never commit database passwords, cookies, CSRF tokens, or `DJANGO_SECRET_KEY`.

For production, use a fresh strong secret, `DJANGO_DEBUG=False`, explicit allowed hosts, HTTPS, `DJANGO_COOKIE_SECURE=True`, and only the exact allowed frontend origins.

## Seed data

From `backend/`, with the virtual environment active:

```powershell
python manage.py seed_projects
```

The command creates or synchronizes 12 demo projects. It does not delete unrelated projects.

## Updating the repository

Before pulling changes, check your worktree:

```powershell
git status
git pull
```

Then update dependencies and the database when needed:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py check
python manage.py test

cd ..\frontend
npm install
npm run test
npm run lint
npm run build
```

Review `.env.example` after pulls and add new variables to your ignored `.env` without overwriting your local secrets.

## Troubleshooting

| Problem | Check |
| --- | --- |
| `DJANGO_SECRET_KEY must be set` | Confirm a root `.env` exists and has a non-placeholder value. |
| Database connection refused | Start PostgreSQL; verify `DB_HOST` and `DB_PORT`. |
| PostgreSQL password error | Match `DB_USER` and `DB_PASSWORD` to your local PostgreSQL account. |
| Database does not exist | Create `client_project_tracker` or correct `DB_NAME`. |
| PowerShell blocks `Activate.ps1` | Use `.\.venv\Scripts\python.exe manage.py <command>` instead. |
| Port 8000 is in use | Run `python manage.py runserver 8001`. |
| Frontend cannot call the API | Use `127.0.0.1`, not `localhost`; confirm matching CORS and CSRF origins. |
| Port 5173 is in use | Run `npm run dev -- --port 5174`, then add that exact origin to CORS and CSRF settings. |
