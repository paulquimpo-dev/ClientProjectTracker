# Technical Overview

This document explains the main technical decisions behind the Client Project Tracker.

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

React components use a shared service layer for API requests. Django REST Framework routes requests through serializers and models, while Django's ORM persists data in PostgreSQL.

## Main structure

```text
ClientProjectTracker/
|-- backend/        # Django settings, authentication, projects, migrations, seed command
|-- frontend/       # React pages, components, services, and TypeScript types
|-- docs/           # Setup, API testing, and technical documentation
|-- .env.example    # Safe local configuration template
`-- README.md       # Primary setup and submission guide
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/projects/` | List projects |
| `GET` | `/projects/{id}/` | Get one project |
| `POST` | `/projects/` | Create a project |
| `PUT` | `/projects/{id}/` | Update a project |
| `DELETE` | `/projects/{id}/` | Delete a project |

The external API uses camelCase fields such as `clientName`, `projectName`, `startDate`, and `dueDate`. The Django serializer maps them to internal snake_case model fields.

## Validation and errors

The backend is authoritative. It requires client and project names, enforces the allowed status and priority values, and rejects a due date earlier than its start date. The frontend repeats the essential checks for immediate feedback, then displays backend field errors when a request is rejected.

The API returns standard JSON responses: `200` for reads/updates, `201` for creation, `204` for deletion, `400` for invalid input, `401` for unauthenticated requests, `403` for failed CSRF verification, `404` for missing projects, and `429` for throttled sign-in attempts.

## Authentication and security

- Django's built-in user model hashes passwords.
- Server-managed `HttpOnly`, `SameSite=Lax` session cookies authenticate requests.
- React does not store passwords or reusable access tokens.
- CSRF protection applies to all state-changing requests.
- CORS and CSRF trust use explicit origins, not wildcards.
- Five failed sign-in attempts for the same IP address and username are throttled for 15 minutes.
- Django serializers and the ORM protect validation and database access.
- Production requires `DJANGO_DEBUG=False`, explicit allowed hosts, HTTPS, secure cookies, and a fresh strong `DJANGO_SECRET_KEY`.

## Frontend design

`ProjectsPage` owns page state. Reusable components render project cards, status/priority badges, project forms, confirmation dialogs, and accessible modal workflows. The API client centralizes the environment-configured base URL, session cookies, CSRF handling, and safe error mapping.

## Testing

- Django tests cover CRUD, validation, authentication, CSRF handling, throttling, CORS, and seed-command repeatability.
- Vitest and React Testing Library cover UI components, authentication behavior, and the API service layer.
- The current seed command creates or synchronizes 12 demo projects without deleting unrelated records.

## AI use

OpenAI Codex assisted with planning, implementation scaffolding, debugging, documentation, UI refinement, and verification guidance. The developer reviewed the code and remains responsible for the implementation, configuration, testing, and submission.

## Related guides

- [Root README](../README.md)
- [DevOps Guide](DEVOPS_GUIDE.md)
- [API Testing Guide](API_TESTING_GUIDE.md)
