# Project Progress

This tracker records implementation progress against the [development blueprint](KODA_FullStack_AI_IDE_Development_Blueprint.md). A phase is complete only after its verification criteria have passed.

## Current milestone

**Completed phase:** Phase 21 - Bonus: Sorting

**Next phase:** Phase 22 - Automated Backend Tests

## Phase status

| Phase | Status | Notes |
| --- | --- | --- |
| 0. Project Preparation | Partially complete | Git repository and backend virtual environment exist. Tool availability was checked during setup. |
| 1. Django Backend Foundation | Complete | Django, DRF, PostgreSQL, CORS, environment configuration, and dependencies are in place. |
| 2. Project Data Model | Complete | Project model, choices, admin registration, and initial migration are implemented. |
| 3. Serializer and Backend Validation | Complete | CamelCase API fields, text normalization, choices, required fields, and date ordering are validated. |
| 4. Required REST CRUD API | Complete | CRUD routes, automated coverage, and all required manual endpoint checks pass. |
| 5. Seed / Test Data | Complete | Six approved local demo projects can be loaded repeatably without duplicates. |
| 6. Backend Core Completion Gate | Complete | Full backend, database, API, dependency, security, and repository audit passed. |
| 7. React + TypeScript Foundation | Complete | Vite React TypeScript app, frontend source structure, Project types, configurable API base URL, and application shell are in place. |
| 8. API Service Layer | Complete | Typed Project API client functions, friendly API errors, runtime connection status, and configurable API base URL are implemented. |
| 9. Project Listing | Complete | Responsive project cards, reusable status/priority badges, and loading, empty, and API-error states are implemented using the Phase 8 API service. |
| 10. Create Project | Complete | A reusable ProjectForm creates validated projects through the API, preserves failed input, surfaces field errors, and updates the visible list on success. |
| 11. Edit Project | Complete | The reusable ProjectForm prepopulates project values, sends updates through the API, and updates the visible list after persistence succeeds. |
| 12. Delete Project | Complete | Delete requires an explicit confirmation, persists through the API, removes the project from the visible list, and reports failures clearly. |
| 13. Frontend Validation and Error Handling | Complete | Field validation, focus management, friendly save/delete/API errors, and failure-state regression checks are implemented. |
| 14. Core Assessment Complete | Complete | The React/Django/PostgreSQL application delivers required end-to-end CRUD, validation, error states, and maintainable frontend/backend structure. |
| 15. Core Regression Testing | Complete | Automated backend/API/build checks and user-confirmed browser regression passed for CRUD persistence, validation, API downtime, and recovery. |
| 16. Core README | Complete | Root and supporting documentation now cover architecture, setup, frontend operation, API, validation, testing, security, and AI use. |
| 17. Core Git / Repository Review | Complete | Repository hygiene, ignored local artifacts, unused starter assets, tracked-file safety, documentation links, and commit history were reviewed. |
| 18. Bonus: Search | Complete | Client-side, case-insensitive search filters loaded projects by client name and project name without changing backend behavior. |
| 19. Bonus: Status Filter | Complete | Client-side status filtering works alongside search and preserves the existing CRUD flows. |
| 20. Bonus: Priority Filter | Complete | Client-side priority filtering combines with search and status filtering using clear all-values defaults. |
| 21. Bonus: Sorting | Complete | Projects can be ordered by date, client name, project name, or priority; a subtle creation timestamp and accessible direction button make the sort order clear without changing stored data. |
| 22-31. Bonus and Submission Work | Not started | Tests and submission polish remain. |

## Verification record

### Phase 1

- Django system check passed.
- PostgreSQL authentication and `SELECT 1` succeeded.
- Django REST Framework and restricted local CORS configuration were verified.
- Installed Python dependencies passed integrity checking.

### Phase 2

- Migration consistency check passed and `projects.0001_initial` was applied.
- A Project was created and retrieved through the Django ORM.
- The temporary verification record was removed.

### Phase 3

- Valid camelCase data passed and surrounding whitespace was removed.
- Missing or whitespace-only names, invalid choices, and invalid date ordering were rejected.
- Errors were returned against meaningful API field names.

### Phase 4

- Django system check passed with no issues.
- Migration consistency check reported no changes.
- All 10 automated API tests passed using an isolated PostgreSQL test database.
- Tests cover list, retrieve, create, update, delete, camelCase output, validation, persistence, required status codes, and missing-record `404` responses.
- Manual curl checks passed for list (`200`), retrieve (`200`), create (`201`), invalid data (`400`), invalid date ordering (`400`), update (`200`), missing record (`404`), and delete (`204`).
- Repeatable manual checks are documented in [docs/API_TESTING_GUIDE.md](docs/API_TESTING_GUIDE.md).

### Phase 5

- Added `python manage.py seed_projects` with six approved fictional Philippine-based client projects.
- The command creates missing seed records, synchronizes changed seed values, avoids duplicates, and preserves unrelated projects.
- First development-database run created six records; the second run created and updated none.
- The API returned `200` with all six seeded records.
- All 14 automated tests passed, including clean seeding, repeatability, synchronization, and unrelated-record preservation.
- Manual verification confirmed all six seed records, camelCase API output, temporary-record create/retrieve/update/delete behavior, invalid-date rejection, missing-record handling, and preservation of the six seed records after cleanup.

### Phase 6

- PostgreSQL database check and the live project collection endpoint passed (`200`).
- Project model and required GET, POST, PUT, and DELETE behavior are covered by passing automated and manual checks.
- Validation, missing-record `404` behavior, and required HTTP status codes are verified.
- Django system and database checks passed; the project migration is applied and no model changes are missing.
- All 14 tests passed using a clean isolated PostgreSQL test database.
- Python dependency integrity passed with no broken requirements.
- Seed repeatability passed with zero duplicate records created.
- `.env` and `backend/.venv/` are ignored, no secret environment file is tracked, and no hard-coded secret was found in tracked application files.
- Setup, seed, update, and API testing documentation was reviewed for the current backend state.
- Manual completion testing passed for database checks, migrations, dependencies, seed repeatability, CRUD, validation, status codes, cleanup, and repository hygiene.

### Phase 7

- Initialized the Vite React TypeScript frontend in `frontend/`.
- Added `components`, `pages`, `services`, and `types` source directories.
- Defined frontend Project, status, and priority types matching the backend's camelCase API contract.
- Added `frontend/.env.example` with the configurable `VITE_API_BASE_URL` setting.
- Replaced the Vite demo with a minimal Client Project Tracker application shell.
- Frontend linting and the production build passed successfully.

### Phase 8

- Added a reusable typed Project API client with functions for list, retrieve, create, update, and delete operations.
- Centralized JSON handling and user-friendly network, validation, and missing-record errors in `ApiError`.
- The foundation shell now verifies the API connection and displays the available project count without implementing the project-list UI.
- The live projects endpoint returned `200` with six seeded projects.
- CORS preflight checks passed for both `localhost:5173` and `127.0.0.1:5173`.
- Frontend linting and production build passed.

### Phase 9

- Added the Projects page, ProjectList, ProjectCard, StatusBadge, and PriorityBadge components.
- Projects are retrieved through the shared API service and displayed as responsive, readable cards.
- Loading, empty, and API-failure states are explicit and user-friendly; the failure state includes a retry action.
- Project cards display the required client name, project name, description, status, priority, start date, and due date.
- New Project, Edit, and Delete controls are visible but intentionally disabled until Phases 10–12 add their behavior.
- The implementation applies the documented CRAP principles for contrast, repetition, alignment, and proximity.
- Frontend linting and production build passed.

### Phase 10

- Made the New Project action functional with an accessible, responsive ProjectForm.
- Added frontend checks for required names/dates and invalid date ordering.
- The form preserves entered values after validation failures and displays field-specific frontend or backend errors.
- Valid submissions use the shared `createProject` API service, then add the persisted project to the visible list and display a success message.
- A valid end-to-end creation was persisted and retrieved through Django/PostgreSQL; the temporary verification record was removed.
- An invalid date range was rejected by the backend with `400`.
- Frontend linting and production build passed.

### Phases 11–12

- Edit actions now open the reusable ProjectForm prepopulated with the selected project's current values.
- Successful updates use the shared `updateProject` service, persist through Django/PostgreSQL, and replace the project immediately in the visible list.
- Delete actions open an explicit confirmation panel naming the selected project; deletion only occurs after confirmation.
- Successful deletions use the shared `deleteProject` service and remove the project from the visible list.
- Delete failures retain the confirmation choice and show a user-friendly error.
- End-to-end verification created a temporary record, persisted an update, deleted it with `204`, verified a `404` afterward, and removed the temporary record.
- Frontend linting and production build passed.

### Phase 13

- Required names, dates, and date ordering are checked before submission, with field-specific feedback.
- Client-side validation now moves keyboard focus to the first invalid field.
- Backend validation messages are mapped to their matching fields and entered form values remain intact after a failed save.
- Friendly errors cover unreachable API, missing projects, failed saves, and failed deletes; raw framework/network errors are not shown.
- Loading, empty, and retryable list-failure states remain explicit.
- Backend regression suite passed all 14 tests; live invalid-form and missing-project checks returned `400` and `404` respectively.
- Frontend linting and production build passed.

### Phase 14

- React frontend, Django REST backend, and PostgreSQL persistence are working together end to end.
- Project listing, creation, editing, and confirmed deletion are implemented through the shared API service layer.
- Frontend and backend validation, loading state, empty state, friendly error handling, and field feedback are present.
- All 14 backend tests passed using an isolated PostgreSQL test database.
- Django database checks, migration consistency, dependency integrity, and seed repeatability passed.
- Frontend linting and the TypeScript/Vite production build passed.
- The live projects endpoint returned `200` with seeded project data.

### Phase 15

- Automated regression checks passed for backend tests, database/migration/dependency checks, seed repeatability, frontend linting, and the production build.
- A live temporary-project cycle verified list, create, read persistence, update persistence, delete, post-delete `404`, invalid `400`, and missing-record `404` behavior.
- The temporary project was removed and the original project count was restored.
- Browser regression testing was manually confirmed for CRUD persistence, validation, backend-unavailable behavior, and recovery.

### Phase 16

- Root README now documents features, architecture, setup, API endpoints, validation, tests, limitations, and AI-assisted development.
- Supporting DevOps and technical documentation was updated for the active React frontend, Vite environment configuration, CORS origins, and full-stack workflow.
- The documentation index now includes the UI/UX design guide, and the default Vite README was replaced with project-specific frontend instructions.

### Phase 17

- Confirmed `.env`, virtual environments, `node_modules`, and build output are ignored and not tracked.
- Credential-pattern scans found no hard-coded secrets; configuration reads `DJANGO_SECRET_KEY` and database credentials from environment variables.
- Removed four unused Vite demonstration assets and replaced stale starter documentation.
- Documentation links, working-tree changes, and commit history were reviewed; `git diff --check` passes.

### Phase 18

- Added a responsive search control for client and project names.
- Search filters the projects already loaded in React, so results update immediately without extra API calls.
- Matching is case-insensitive and does not change create, edit, or delete behavior.
- A clear no-match state appears when the search has no results; the existing empty-project state remains distinct.
- Frontend linting and production build passed.

### Phases 19–20

- Added accessible Status and Priority select controls with All Statuses and All Priorities defaults.
- Search, status, and priority criteria combine predictably: displayed projects must meet every active criterion.
- Filters run against the existing loaded data and make no additional API calls.
- The no-match state now guides users to adjust their search or filters.
- The controls use responsive layout and retain existing create, edit, and delete behavior.
- Frontend linting and production build passed.

## Current limitations

- The required core application, documentation, and repository review are complete. Search, status/priority filters, and client-side sorting are implemented; the remaining bonus work begins with Phase 22.

## Update convention

After each phase, update this file with the completed phase, verification results, known limitations, and next phase. Add release-oriented changes to a conventional `CHANGELOG.md` once the project has meaningful released functionality.
