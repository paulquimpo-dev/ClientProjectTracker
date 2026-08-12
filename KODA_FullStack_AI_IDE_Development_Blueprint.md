# KODA Full Stack Technical Assessment
## AI IDE Development Blueprint
### Client Project Tracker
### Core-First Implementation Plan with Bonus Expansion

---

## 1. Purpose of This Blueprint

This document is both:

1. A **software engineering development plan** for completing the KODA Kollectiv Full Stack Developer Technical Assessment.
2. A **master prompt / execution blueprint** that can be provided to an AI IDE or coding agent such as Cursor, Claude Code, GitHub Copilot, Windsurf, or another AI-assisted development environment.

The AI development tool should follow this document **phase by phase**.

The highest priority is to complete the required assessment correctly and cleanly before implementing optional or bonus features.

> **Core rule:** Never sacrifice required functionality, correctness, validation, code quality, or documentation in order to add bonus features.

---

# 2. Project Objective

Build a complete **Client Project Tracker** for a digital agency.

The application must allow a user to:

- View all projects.
- View project information.
- Create a project.
- Edit a project.
- Delete a project.
- Receive clear validation feedback.
- Receive meaningful error messages.
- Persist all project data in PostgreSQL.

The application must include both:

- A frontend application.
- A backend REST API.

---

# 3. Technology Stack

Use the following stack unless a serious technical blocker requires a change.

## Frontend

- React
- TypeScript
- Vite
- Native `fetch` API unless Axios provides a clear benefit
- ESLint
- Prettier

## Backend

- Python
- Django
- Django REST Framework
- django-cors-headers

## Database

- PostgreSQL

## Development / Quality

- Git
- GitHub
- Python virtual environment
- Django test framework or pytest
- Postman, Bruno, curl, or equivalent API client for manual API verification

## Configuration

- `.env`
- `.env.example`
- `.gitignore`

## Optional Later Enhancements

Only after the complete core application is stable:

- Search
- Filtering
- Sorting
- Automated tests
- Swagger / OpenAPI
- Docker
- GitHub Actions / CI
- Deployment

---

# 4. Engineering Principles

The AI development tool must follow these principles throughout implementation.

## 4.1 Core Before Bonus

Development priority:

```text
Required CRUD
    ↓
Database persistence
    ↓
Validation
    ↓
Error handling
    ↓
Clean architecture
    ↓
Documentation
    ↓
Core testing
    ↓
Bonus features
    ↓
Infrastructure polish
```

Do not implement bonus features while a required feature is incomplete or broken.

---

## 4.2 Keep Architecture Appropriate to Scope

This is a small technical assessment.

Do not introduce unnecessary enterprise abstractions.

Avoid creating excessive layers such as:

```text
Controller
Service
Repository
DAO
Manager
Factory
Adapter
Gateway
```

unless they solve an actual problem.

For this project, conventional Django REST Framework architecture is sufficient:

```text
URL
 ↓
ViewSet
 ↓
Serializer
 ↓
Model
 ↓
PostgreSQL
```

Frontend architecture should remain similarly clear:

```text
Page / Component
       ↓
Service Layer
       ↓
REST API
```

---

## 4.3 Favor Maintainability

Code should be:

- Easy to read.
- Easy to run.
- Easy to review.
- Easy to modify.
- Properly typed on the frontend.
- Clearly validated on the backend.
- Free from unnecessary duplication.

---

## 4.4 Security-Conscious Engineering

Apply secure engineering practices naturally without turning the assessment into a cybersecurity project.

Required habits:

- Never commit secrets.
- Never commit `.env`.
- Use environment variables.
- Use Django ORM instead of dynamic raw SQL.
- Validate data on the backend.
- Restrict CORS appropriately.
- Avoid exposing stack traces to the frontend.
- Keep `DEBUG` configurable.
- Use meaningful HTTP status codes.
- Keep dependencies minimal.

Do **not** add authentication, JWT, OAuth, RBAC, MFA, WAF, SIEM, or other large security features unless all required work and higher-priority bonus work are already complete.

---

# 5. High-Level System Architecture

```text
┌─────────────────────────────────────────────┐
│              React Frontend                 │
│                                             │
│ Pages                                       │
│ Components                                  │
│ Types                                       │
│ API Service                                 │
└──────────────────────┬──────────────────────┘
                       │
                   REST / JSON
                       │
                       ▼
┌─────────────────────────────────────────────┐
│          Django REST Framework              │
│                                             │
│ URLs                                        │
│ ViewSets                                    │
│ Serializers                                 │
│ Validation                                  │
│ Models                                      │
└──────────────────────┬──────────────────────┘
                       │
                   Django ORM
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 PostgreSQL                  │
│                                             │
│               projects table                │
└─────────────────────────────────────────────┘
```

---

# 6. Recommended Repository Structure

Use a single repository.

```text
koda-client-project-tracker/
│
├── backend/
│   ├── manage.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── projects/
│   │   ├── migrations/
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── seed_projects.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── tests.py
│   │   └── apps.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   │
│   │   ├── pages/
│   │   │   └── ProjectsPage.tsx
│   │   │
│   │   ├── services/
│   │   │   └── projectService.ts
│   │   │
│   │   ├── types/
│   │   │   └── project.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml          # optional, bonus phase only
```

Do not create extra directories unless they provide clear value.

---

# 7. Project Data Model

Create one primary `Project` entity.

## Required Fields

```text
id
client_name
project_name
description
status
priority
start_date
due_date
```

## Recommended Internal Fields

Also add:

```text
created_at
updated_at
```

These are useful but should not complicate the assessment.

---

## Status Values

Allowed values:

```text
Planning
In Progress
On Hold
Completed
```

Use Django `TextChoices` or an equivalent clean solution.

---

## Priority Values

Allowed values:

```text
Low
Medium
High
```

---

# 8. API Contract

Expose REST endpoints equivalent to:

```http
GET    /api/projects/
GET    /api/projects/{id}/
POST   /api/projects/
PUT    /api/projects/{id}/
DELETE /api/projects/{id}/
```

Use conventional Django REST Framework routing.

---

## Example Project Response

```json
{
  "id": 1,
  "clientName": "Acme Corporation",
  "projectName": "Corporate Website Redesign",
  "description": "Redesign and modernize the company's corporate website.",
  "status": "In Progress",
  "priority": "High",
  "startDate": "2026-06-01",
  "dueDate": "2026-07-15"
}
```

Choose one naming convention for the API and use it consistently.

If Django internally uses snake_case but the API uses camelCase, perform the mapping deliberately and consistently.

Do not create inconsistent payload formats.

---

# 9. Validation Requirements

Backend validation is authoritative.

Frontend validation exists for user experience.

## Required Rules

### Client Name

- Required.
- Cannot be blank.
- Cannot be whitespace-only.

### Project Name

- Required.
- Cannot be blank.
- Cannot be whitespace-only.

### Description

- May be optional unless assessment requirements state otherwise.
- Trim unnecessary whitespace when appropriate.

### Status

Must be one of:

```text
Planning
In Progress
On Hold
Completed
```

### Priority

Must be one of:

```text
Low
Medium
High
```

### Start Date

- Required.

### Due Date

- Required.
- Must not occur before the start date.

---

## Example Meaningful Validation Response

Preferred:

```json
{
  "dueDate": [
    "Due date cannot be earlier than start date."
  ]
}
```

Avoid vague responses such as:

```json
{
  "error": "Invalid"
}
```

---

# 10. HTTP Behavior

Use appropriate HTTP semantics.

```text
200 OK
→ Successful GET
→ Successful PUT

201 Created
→ Successful POST

204 No Content
→ Successful DELETE

400 Bad Request
→ Validation error

404 Not Found
→ Project does not exist

500 Internal Server Error
→ Unexpected backend failure
```

Do not return `200 OK` for every possible outcome.

---

# 11. Frontend Requirements

The main frontend should be a clean project management page.

At minimum it must support:

- Project listing.
- Project creation.
- Project editing.
- Project deletion.
- Loading states.
- Empty states.
- Error states.
- Validation feedback.

---

## Suggested Main Screen

```text
┌───────────────────────────────────────────────────────────┐
│ Client Project Tracker                      + New Project │
│ Manage client projects and delivery timelines            │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ Acme Corporation                                          │
│ Corporate Website Redesign                                │
│                                                           │
│ Redesign and modernize the company's corporate website.  │
│                                                           │
│ [In Progress] [High]                                      │
│ Jun 01, 2026 → Jul 15, 2026              Edit   Delete   │
│                                                           │
├───────────────────────────────────────────────────────────┤
│ GreenLeaf Cafe                                            │
│ Online Ordering System                                    │
│ ...                                                       │
└───────────────────────────────────────────────────────────┘
```

Do not prioritize visual complexity before functionality.

---

# 12. Frontend TypeScript Model

Create explicit frontend types.

Example:

```typescript
export type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "On Hold"
  | "Completed";

export type ProjectPriority =
  | "Low"
  | "Medium"
  | "High";

export interface Project {
  id: number;
  clientName: string;
  projectName: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  dueDate: string;
}
```

Avoid `any` unless absolutely necessary.

---

# 13. Frontend API Service

Raw HTTP logic should not be duplicated across UI components.

Create:

```text
src/services/projectService.ts
```

Provide functions similar to:

```text
getProjects()
getProject(id)
createProject(data)
updateProject(id, data)
deleteProject(id)
```

Components should call these service functions rather than building API URLs independently.

---

# 14. Reusable Project Form

Use the same form component for both create and edit operations where practical.

Fields:

```text
Client Name *
Project Name *
Description
Status *
Priority *
Start Date *
Due Date *
```

Create mode:

```text
Create Project
```

Edit mode:

```text
Update Project
```

The form should clearly display field-level validation errors.

---

# 15. Delete Confirmation

Do not immediately delete a record when the delete button is clicked.

Use a confirmation step.

Example:

```text
Delete Project?

Are you sure you want to delete
"Corporate Website Redesign"?

This action cannot be undone.

Cancel                     Delete
```

---

# 16. Required Error / UX States

Implement at least:

## Loading

```text
Loading projects...
```

## Empty

```text
No projects found.
```

## API Failure

```text
Unable to load projects.
Please try again.
```

## Save Failure

```text
Unable to save project.
Please review the highlighted fields.
```

Do not display raw framework exceptions or low-level browser networking errors directly to the user.

---

# 17. Development Phases

The AI development tool must execute these phases **in order**.

Do not skip forward into bonus phases.

---

# PHASE 0 — Project Preparation

## Goal

Prepare a clean development environment and repository.

## Tasks

1. Create the project directory.
2. Initialize Git.
3. Add:
   - `backend/`
   - `frontend/`
   - `.gitignore`
   - `.env.example`
   - `README.md`
4. Verify:
   - Python
   - Node.js
   - npm
   - Git
   - PostgreSQL
5. Create Python virtual environment.

## Suggested Git Commit

```text
chore: initialize project structure
```

## Exit Criteria

```text
[ ] Repository exists
[ ] Git initialized
[ ] Python works
[ ] Node/npm works
[ ] PostgreSQL works
[ ] Virtual environment works
```

Do not move forward until all exit criteria are satisfied.

---

# PHASE 1 — Django Backend Foundation

## Goal

Create a working Django REST backend connected to PostgreSQL.

## Tasks

1. Install:
   - Django
   - djangorestframework
   - psycopg
   - django-cors-headers
   - environment-variable helper if needed
2. Create Django project.
3. Create `projects` app.
4. Configure PostgreSQL.
5. Configure Django REST Framework.
6. Configure CORS.
7. Configure environment variables.
8. Keep secrets out of source control.
9. Create/update `requirements.txt`.

## Exit Criteria

```text
[ ] Django runs successfully
[ ] PostgreSQL connection succeeds
[ ] No secret is committed
[ ] Environment variables are documented
```

---

# PHASE 2 — Project Data Model

## Goal

Create the persistent Project model.

## Tasks

Implement:

```text
id
client_name
project_name
description
status
priority
start_date
due_date
created_at
updated_at
```

Use enum-like choices for status and priority.

Run:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Exit Criteria

```text
[ ] Migration succeeds
[ ] Project table exists
[ ] A project can be created through Django shell
[ ] Project can be retrieved from PostgreSQL
```

## Suggested Git Commit

```text
feat: add project model and database migration
```

---

# PHASE 3 — Serializer and Backend Validation

## Goal

Define the API data contract and business validation.

## Tasks

1. Create Project serializer.
2. Validate required fields.
3. Reject whitespace-only project/client names.
4. Restrict status values.
5. Restrict priority values.
6. Validate start and due dates.
7. Return meaningful error messages.

## Required Date Rule

```text
due_date >= start_date
```

## Exit Criteria

```text
[ ] Valid project passes serializer validation
[ ] Missing client name fails
[ ] Missing project name fails
[ ] Invalid status fails
[ ] Invalid priority fails
[ ] Invalid date range fails
[ ] Errors are human-readable
```

---

# PHASE 4 — Required REST CRUD API

## Goal

Complete all required backend operations before frontend development.

## Required Endpoints

```text
GET    /api/projects/
GET    /api/projects/{id}/
POST   /api/projects/
PUT    /api/projects/{id}/
DELETE /api/projects/{id}/
```

## Tasks

1. Add routing.
2. Add ViewSet or equivalent DRF views.
3. Implement CRUD behavior.
4. Verify HTTP status codes.
5. Verify 404 handling.
6. Manually test every endpoint.

## Mandatory Manual Tests

### List

```text
GET /api/projects/
Expected: 200
```

### Retrieve Existing

```text
GET /api/projects/1/
Expected: 200
```

### Retrieve Missing

```text
GET /api/projects/999999/
Expected: 404
```

### Create Valid

```text
POST /api/projects/
Expected: 201
```

### Create Invalid

Expected:

```text
400
```

### Update

```text
PUT /api/projects/1/
Expected: 200
```

### Delete

```text
DELETE /api/projects/1/
Expected: 204
```

## Critical Gate

> **Do not begin React development until all required backend CRUD endpoints work independently through an API client.**

## Suggested Git Commit

```text
feat: implement project CRUD API
```

---

# PHASE 5 — Seed / Test Data

## Goal

Make reviewer setup easier.

## Tasks

1. Use KODA-provided test data where available.
2. Create a Django management command such as:

```bash
python manage.py seed_projects
```

3. Ensure it can populate a clean database.

## Exit Criteria

```text
[ ] Clean database can be migrated
[ ] Seed command succeeds
[ ] GET /api/projects/ returns seeded records
```

## Suggested Git Commit

```text
feat: add project seed data command
```

---

# PHASE 6 — Backend Core Completion Gate

Before frontend work, verify:

```text
[ ] PostgreSQL works
[ ] Project model works
[ ] GET collection works
[ ] GET detail works
[ ] POST works
[ ] PUT works
[ ] DELETE works
[ ] Validation works
[ ] 404 behavior works
[ ] HTTP status codes are correct
[ ] No secrets are tracked
```

If any item fails, fix it before continuing.

---

# PHASE 7 — React + TypeScript Foundation

## Goal

Create the frontend application and basic architecture.

## Tasks

1. Initialize Vite React TypeScript.
2. Create directories:
   - `components`
   - `pages`
   - `services`
   - `types`
3. Create Project types.
4. Configure frontend environment variables if needed.
5. Verify frontend builds and runs.

## Exit Criteria

```text
[ ] React runs
[ ] TypeScript compiles
[ ] Project type exists
[ ] Basic application shell renders
```

## Suggested Git Commit

```text
feat: initialize React TypeScript frontend
```

---

# PHASE 8 — API Service Layer

## Goal

Connect the frontend to the backend cleanly.

## Tasks

Create:

```text
src/services/projectService.ts
```

Implement:

```text
getProjects()
getProject(id)
createProject(data)
updateProject(id, data)
deleteProject(id)
```

Handle HTTP failures in a reusable way where reasonable.

## Exit Criteria

```text
[ ] Frontend successfully retrieves backend data
[ ] API URL is configurable
[ ] Components do not duplicate raw endpoint logic
```

---

# PHASE 9 — Project Listing

## Goal

Display project data in React.

## Tasks

Implement:

```text
ProjectsPage
ProjectList
ProjectCard
StatusBadge
PriorityBadge
```

Display all required project fields.

Add:

```text
Edit
Delete
```

actions.

Implement loading, empty, and error states.

## Exit Criteria

```text
[ ] PostgreSQL data appears in React
[ ] Loading state works
[ ] Empty state works
[ ] API failure is handled gracefully
```

## Suggested Git Commit

```text
feat: implement project listing
```

---

# PHASE 10 — Create Project

## Goal

Allow project creation through the UI.

## Tasks

1. Build reusable `ProjectForm`.
2. Add all fields.
3. Add frontend validation.
4. Submit through service layer.
5. Handle server validation errors.
6. Refresh or update UI after success.

## Exit Criteria

```text
[ ] Project can be created from React
[ ] Created project persists in PostgreSQL
[ ] Invalid data is rejected
[ ] Validation errors are visible
```

## Suggested Git Commit

```text
feat: implement project creation
```

---

# PHASE 11 — Edit Project

## Goal

Allow project updates.

## Tasks

1. Reuse ProjectForm.
2. Prepopulate existing values.
3. Submit `PUT`.
4. Handle success and failure.
5. Ensure updates persist after browser refresh.

## Exit Criteria

```text
[ ] Project can be edited
[ ] Updated values persist in PostgreSQL
[ ] Refresh does not revert changes
```

## Suggested Git Commit

```text
feat: implement project editing
```

---

# PHASE 12 — Delete Project

## Goal

Complete frontend CRUD.

## Tasks

1. Add delete action.
2. Add confirmation dialog.
3. Send DELETE request.
4. Update UI after success.
5. Handle deletion errors.

## Exit Criteria

```text
[ ] Confirmation is required
[ ] Project is deleted from backend
[ ] Project disappears from UI
[ ] Deleted project does not reappear after refresh
```

## Suggested Git Commit

```text
feat: implement project deletion
```

---

# PHASE 13 — Frontend Validation and Error Handling

## Goal

Make the required application robust.

## Test Cases

```text
Blank client name
Blank project name
Invalid date range
Backend unavailable
Missing project
Failed save
Failed delete
```

Ensure the frontend does not crash.

## Exit Criteria

```text
[ ] Expected failures show user-friendly messages
[ ] Raw stack traces are not shown
[ ] Forms preserve useful state after validation failure
[ ] Backend validation messages can be surfaced appropriately
```

## Suggested Git Commit

```text
feat: add frontend validation and error states
```

---

# PHASE 14 — CORE ASSESSMENT COMPLETE

This is the first major delivery milestone.

At this point the system must include:

```text
[ ] React frontend
[ ] Django REST backend
[ ] PostgreSQL database
[ ] Project listing
[ ] Create
[ ] Edit
[ ] Delete
[ ] Backend validation
[ ] Frontend validation
[ ] Error handling
[ ] Loading state
[ ] Empty state
[ ] Clean architecture
```

> If development had to stop here, the project should already satisfy the primary technical assessment requirements.

Do not call the project core-complete if any required CRUD operation is unreliable.

---

# PHASE 15 — Core Regression Testing

## Goal

Aggressively verify required functionality before adding bonuses.

## CRUD Regression

```text
Create
→ Verify
→ Refresh
→ Verify persistence

Read
→ Verify correct data

Update
→ Verify
→ Refresh
→ Verify persistence

Delete
→ Verify
→ Refresh
→ Verify absence
```

## Validation Regression

Test:

```text
Blank client name
Blank project name
Invalid status
Invalid priority
Due date before start date
```

## Failure Regression

1. Stop Django.
2. Verify React displays a graceful API failure.
3. Restart Django.
4. Verify recovery.

## Exit Criteria

```text
[ ] No known P0 CRUD bugs
[ ] No known P1 validation bugs
[ ] Persistence works
[ ] Error handling works
```

---

# PHASE 16 — Core README

## Goal

Make the project easy for KODA to run and review before bonuses are attempted.

README should contain:

```text
Project Overview
Features
Technology Stack
Architecture
Project Structure
Prerequisites
Installation
Environment Setup
Database Setup
Backend Setup
Frontend Setup
Seed Data
Running the Application
API Endpoints
Validation Rules
Testing
AI Tool Usage
Known Limitations
Future Improvements
```

## Exit Criteria

A developer unfamiliar with the project can follow the README without undocumented assumptions.

## Suggested Git Commit

```text
docs: add setup and architecture documentation
```

---

# PHASE 17 — Core Git / Repository Review

## Goal

Ensure the repository itself looks professional.

Review:

```text
[ ] No .env
[ ] No secrets
[ ] No virtual environment
[ ] No node_modules
[ ] No generated junk
[ ] No debug files
[ ] No dead experimental code
[ ] Meaningful commit history
[ ] README is current
[ ] Public repository is ready
```

Recommended commit progression:

```text
chore: initialize project structure
feat: configure Django backend
feat: add project model and database migration
feat: implement project CRUD API
feat: add project validation
feat: add project seed data command
feat: initialize React TypeScript frontend
feat: add project API service
feat: implement project listing
feat: implement project creation
feat: implement project editing
feat: implement project deletion
feat: add frontend validation and error states
docs: add project setup instructions
```

At this point, a strong required submission already exists.

---

# BONUS DEVELOPMENT BEGINS HERE

The AI development tool must not execute bonus work before Phase 17 is complete and the core system is stable.

---

# PHASE 18 — Bonus: Search

## Goal

Add lightweight project search.

Search by at least:

```text
Client Name
Project Name
```

Client-side filtering is acceptable for this project scale.

## Exit Criteria

```text
[ ] Search is responsive
[ ] Search does not break CRUD
[ ] Empty search results are handled
```

---

# PHASE 19 — Bonus: Status Filter

Add:

```text
All Statuses
Planning
In Progress
On Hold
Completed
```

Filters should work with the existing project list.

---

# PHASE 20 — Bonus: Priority Filter

Add:

```text
All Priorities
Low
Medium
High
```

Status and priority filters should be usable together.

---

# PHASE 21 — Bonus: Sorting

Consider sorting by:

```text
Due Date
Start Date
Client Name
Project Name
Priority
```

Keep sorting understandable and predictable.

Do not overengineer.

---

# PHASE 22 — Bonus: Backend Automated Tests

## Goal

Add high-value automated coverage.

Prioritize:

```text
Create valid project
Reject missing client name
Reject missing project name
Reject invalid status
Reject invalid priority
Reject invalid date range
Retrieve project
Update project
Delete project
Return 404 for missing project
```

## Exit Criteria

```text
[ ] Test suite passes locally
[ ] Tests exercise business rules
[ ] Tests do not depend on production data
```

## Suggested Git Commit

```text
test: add project API test coverage
```

---

# PHASE 23 — Bonus: Frontend Tests

Only implement if comfortable and core/ backend tests are already solid.

Potential targets:

```text
Project list rendering
Form validation
Delete confirmation
API error state
```

Do not spend excessive time configuring frontend testing.

---

# PHASE 24 — Bonus: Swagger / OpenAPI

Optional enhancement.

Potential implementation:

```text
drf-spectacular
```

Possible endpoints:

```text
/api/schema/
/api/docs/
```

Document only what actually exists.

---

# PHASE 25 — Bonus: Docker

## Goal

Provide reproducible local setup.

Potential services:

```text
frontend
backend
postgres
```

Ideal usage:

```bash
docker compose up --build
```

Critical rule:

> A broken Docker setup is worse than no Docker setup.

Only keep Docker support if it works from a clean environment.

---

# PHASE 26 — Bonus: CI

Add GitHub Actions after tests are reliable.

Suggested pipeline:

```text
Push / Pull Request
       ↓
Install backend dependencies
       ↓
Run backend tests
       ↓
Install frontend dependencies
       ↓
TypeScript check
       ↓
Lint
       ↓
Build frontend
```

Do not add CI merely for appearance.

It must pass.

---

# PHASE 27 — Bonus: Deployment

Deployment is optional and lowest priority.

Possible architecture:

```text
Frontend → Vercel
Backend → Render / Railway / VPS / other platform
Database → Managed PostgreSQL
```

Do not allow deployment issues to destabilize the repository.

---

# PHASE 28 — Security Review

Before submission, inspect the repository as a secure software engineer.

Check:

```text
[ ] .env is ignored
[ ] No DB password committed
[ ] No Django SECRET_KEY committed
[ ] DEBUG is configurable
[ ] CORS is not unnecessarily unrestricted
[ ] Backend validation exists
[ ] ORM is used safely
[ ] No sensitive stack traces reach frontend
[ ] Dependencies are reasonable
[ ] No accidental secrets in Git history
```

---

# PHASE 29 — Fresh Clone Test

## Goal

Simulate the KODA reviewer experience.

Use a new directory.

Clone the repository.

Follow only the README.

Verify:

```text
Clone
↓
Configure environment
↓
Install backend
↓
Create/configure PostgreSQL
↓
Migrate
↓
Seed
↓
Run backend
↓
Install frontend
↓
Run frontend
↓
Open browser
↓
CRUD works
↓
Validation works
↓
Tests work
```

If any undocumented step is required, update the README.

---

# PHASE 30 — Technical Reflection Preparation

Prepare truthful answers based on the actual implementation.

Be ready to explain:

```text
Why React + TypeScript?

Why Django REST Framework?

Why PostgreSQL?

Why a frontend service layer?

How is validation handled?

Why validate on both frontend and backend?

How are API errors handled?

What tradeoffs were made?

What would be improved with more time?

Why were certain bonus features prioritized?

How was AI used?

Which architecture and implementation decisions were personally reviewed?
```

Do not fabricate complexity that was not actually implemented.

---

# PHASE 31 — Final Submission Review

## Core

```text
[ ] Project listing works
[ ] Create works
[ ] Edit works
[ ] Delete works
[ ] PostgreSQL persistence works
[ ] Validation works
[ ] Error handling works
```

## Quality

```text
[ ] Clean structure
[ ] TypeScript types
[ ] Reusable components
[ ] API service layer
[ ] Clear naming
[ ] No dead code
```

## Documentation

```text
[ ] README complete
[ ] Setup instructions tested
[ ] API documented
[ ] .env.example exists
[ ] AI usage disclosed
```

## Repository

```text
[ ] Public
[ ] Secrets excluded
[ ] Clean Git history
[ ] No unnecessary files
```

## Bonus

```text
[ ] Search
[ ] Status filter
[ ] Priority filter
[ ] Sorting
[ ] Backend tests
[ ] Frontend tests
[ ] Swagger / OpenAPI
[ ] Docker
[ ] CI
[ ] Deployment
```

Only mark items actually completed.

---

# 18. Priority Classification

Use the following engineering priorities.

## P0 — Must Work

```text
PostgreSQL
Django backend
REST API
Project CRUD
React frontend
End-to-end CRUD
```

Any P0 defect blocks bonus development.

---

## P1 — Must Be Good

```text
Validation
Error handling
Code structure
Type safety
Configuration
README
Security hygiene
```

Any serious P1 defect should be fixed before bonus work.

---

## P2 — Strong Bonus

```text
Search
Status filtering
Priority filtering
Sorting
Automated backend tests
```

These are the preferred bonus targets.

---

## P3 — Polish

```text
Frontend tests
Swagger
Docker
CI
Deployment
```

Only implement after P0, P1, and desired P2 work are stable.

---

# 19. Recommended Stopping Points

## Minimum Acceptable

Complete through:

```text
Phase 14
```

The required application works.

## Strong Submission

Complete through:

```text
Phase 17
```

Core application plus documentation and repository quality.

## Excellent Submission

Complete through:

```text
Phase 22
```

Core application plus useful user-facing bonus features and backend tests.

## Exceptional Polish

Complete selected items from:

```text
Phases 23–29
```

Only when they are stable.

---

# 20. AI IDE Master Execution Instructions

The following instructions are intended specifically for the AI coding tool.

---

## AI ROLE

Act as a senior software engineer implementing a hiring technical assessment.

Optimize for:

1. Correctness.
2. Maintainability.
3. Simplicity.
4. Clear architecture.
5. Good validation.
6. Reviewer experience.
7. Professional documentation.

Do not optimize for showing off technology.

---

## EXECUTION RULES

### Rule 1 — Work Phase by Phase

Only implement the current phase.

Do not jump ahead.

Before advancing, verify that the phase exit criteria are satisfied.

---

### Rule 2 — Never Start Bonus Work Early

Bonus development starts only after:

```text
Phase 17
```

and after the complete required application is stable.

---

### Rule 3 — Preserve Working Functionality

Before significant changes:

- Inspect current code.
- Understand dependencies.
- Avoid unnecessary rewrites.
- Prefer small, reviewable changes.
- Do not replace working architecture merely to make it more sophisticated.

---

### Rule 4 — Explain Important Decisions

When making a significant decision, briefly document:

```text
Decision
Reason
Tradeoff
```

Examples:

```text
Use DRF ModelViewSet
Reason: Provides conventional CRUD with minimal boilerplate.
Tradeoff: Less explicit than separate API views, but appropriate for this scope.
```

Do not produce long theoretical essays during implementation.

---

### Rule 5 — Verify Instead of Assuming

After implementation:

- Run the relevant command.
- Check compilation.
- Check migrations.
- Check tests.
- Check API responses.
- Check frontend build.
- Fix failures before claiming completion.

Never claim a phase is complete without verification.

---

### Rule 6 — Do Not Hide Errors

If an implementation step fails:

1. Report the failure.
2. Diagnose the actual cause.
3. Fix the smallest responsible issue.
4. Re-run verification.
5. Continue only after success.

Do not silence errors merely to get a green command.

---

### Rule 7 — Avoid Unnecessary Dependencies

Before adding a dependency, ask:

```text
Can this be implemented cleanly with the existing stack?
```

If yes, avoid adding the dependency.

---

### Rule 8 — Keep User-Facing Errors Friendly

Do not show raw:

```text
AxiosError
TypeError
Traceback
OperationalError
```

to users.

Convert expected application failures into understandable messages.

---

### Rule 9 — Keep Backend Validation Authoritative

Even when frontend validation exists, the server must independently enforce all business rules.

Never rely solely on React validation.

---

### Rule 10 — Do Not Commit Secrets

Never place real credentials into source files or documentation.

Use:

```text
.env
```

locally and:

```text
.env.example
```

for documentation.

---

# 21. AI IDE Interaction Pattern

For every phase, follow this pattern:

```text
1. Inspect current repository state.
2. State current phase.
3. State files expected to change.
4. Implement only required changes.
5. Run verification commands.
6. Fix any errors.
7. Summarize:
   - What changed
   - What was verified
   - Any known limitations
8. Suggest the logical Git commit message.
9. Stop before beginning the next phase unless explicitly instructed to continue.
```

This keeps development controlled and reviewable.

---

# 22. AI IDE Example Start Prompt

Use the following prompt when beginning implementation with an AI IDE:

```text
You are acting as a senior software engineer helping me complete the KODA Kollectiv Full Stack Developer Technical Assessment.

The project is a Client Project Tracker.

Required stack:
- React
- TypeScript
- Vite
- Python
- Django
- Django REST Framework
- PostgreSQL

Follow the attached DEVELOPMENT_BLUEPRINT.md exactly.

Important rules:

1. Work phase by phase.
2. Begin at Phase 0.
3. Do not implement bonus features before Phase 17.
4. Prioritize required CRUD functionality, validation, error handling, architecture, and documentation.
5. Keep the architecture simple and appropriate for a small technical assessment.
6. Do not add unnecessary frameworks or dependencies.
7. Verify every phase with actual commands before marking it complete.
8. Do not claim success if a command, migration, test, build, or API call fails.
9. Keep backend validation authoritative.
10. Never hardcode secrets.
11. Explain meaningful engineering decisions briefly.
12. Suggest a Git commit message after each completed phase.
13. Stop at the end of each phase unless I explicitly tell you to continue.

Before making changes:
- Inspect the current repository.
- Tell me which phase we are in.
- Tell me which files you expect to create or modify.
- Then implement the phase.

Start with Phase 0 only.
```

---

# 23. AI IDE Prompt for Continuing a Phase

```text
Continue with the next phase in DEVELOPMENT_BLUEPRINT.md.

Before editing:
1. Verify the previous phase exit criteria.
2. Inspect the current repository state.
3. Identify the next phase.
4. State which files will change.

Then implement only that phase.

After implementation:
- Run the required verification.
- Fix any failures.
- Summarize the completed work.
- Suggest the Git commit message.
- Stop before starting another phase.
```

---

# 24. AI IDE Prompt for Core Regression Review

Use this after Phase 14:

```text
Perform the Phase 15 core regression review from DEVELOPMENT_BLUEPRINT.md.

Do not add features.

Test the existing application as a reviewer would.

Verify:
- Create
- Read
- Update
- Delete
- Persistence after refresh
- Backend validation
- Frontend validation
- Missing project behavior
- Backend unavailable behavior
- Loading state
- Empty state
- User-friendly errors

Identify every defect found.

Fix only defects affecting required functionality or P1 quality.

Re-run the relevant checks after each fix.

Do not begin any bonus development.
```

---

# 25. AI IDE Prompt for Bonus Development

Only use after Phase 17 is complete:

```text
The required application is now stable and Phase 17 is complete.

Begin bonus development according to DEVELOPMENT_BLUEPRINT.md.

Priority order:
1. Search
2. Status filter
3. Priority filter
4. Sorting
5. Backend automated tests
6. Frontend tests
7. Swagger / OpenAPI
8. Docker
9. CI
10. Deployment

Do not skip ahead to lower-priority bonus work while a higher-priority bonus is incomplete or unstable.

For every bonus:
- Keep core CRUD behavior unchanged.
- Run regression checks.
- Avoid unnecessary dependencies.
- Stop after completing and verifying one phase.
```

---

# 26. Definition of Done

The project is ready for submission when a reviewer can:

```text
Clone repository
      ↓
Read README
      ↓
Configure environment
      ↓
Install backend dependencies
      ↓
Configure PostgreSQL
      ↓
Run migrations
      ↓
Optionally seed data
      ↓
Run Django
      ↓
Install frontend dependencies
      ↓
Run React
      ↓
View project list
      ↓
Create project
      ↓
Edit project
      ↓
Delete project
      ↓
Trigger validation errors
      ↓
Receive clear feedback
      ↓
Run documented tests
```

with no hidden setup knowledge required.

---

# 27. Final Engineering Rule

When choosing between:

```text
More features
```

and:

```text
A smaller application that is correct, maintainable, documented, and easy to run
```

choose the second option.

The goal of this assessment is not to demonstrate the largest possible technology stack.

The goal is to demonstrate that the candidate can design, implement, validate, test, document, and deliver a clean full-stack software system.
