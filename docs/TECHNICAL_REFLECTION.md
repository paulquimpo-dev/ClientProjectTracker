# Technical Reflection

This guide prepares concise, truthful explanations of the Client Project Tracker's implemented design and tradeoffs.

## Why React and TypeScript?

React makes the interactive project list, forms, filters, sort controls, and modal workflows easier to organize into focused components. TypeScript gives the frontend explicit project, status, priority, API-error, and authentication types, which helps catch mismatches before runtime.

## Why Django REST Framework?

Django REST Framework provides a structured REST API on top of Django's mature authentication, validation, ORM, and security features. Serializers map the external camelCase API contract to the database model while keeping validation in one authoritative backend layer.

## Why PostgreSQL?

Projects are structured, related business records that need reliable persistence, constraints, and predictable querying. PostgreSQL is a production-ready relational database and is a natural fit for Django's ORM.

## Why use a frontend service layer?

React components call `projectService` and `authService`, not `fetch` directly. The shared API client centralizes the environment-configured API base URL, cookies, CSRF handling, JSON parsing, and friendly error mapping. This keeps UI components focused on interaction and state.

## How is validation handled?

The form performs immediate checks for required client/project names and valid date order. Django REST Framework serializers are authoritative: they trim required text, enforce model choices for status and priority, require dates, and reject a due date earlier than the start date. Backend field errors are returned to the relevant frontend form controls.

## Why validate on both frontend and backend?

Frontend validation provides fast feedback and avoids a needless request. Backend validation protects data integrity because clients can bypass the UI and call the API directly. The backend therefore remains the final decision-maker.

## How are API errors handled?

The API client maps status codes to safe user-facing messages. Forms display server field errors, the list provides loading, empty, and failure states, and session expiry returns the user to sign-in. Django returns JSON only and uses a custom CSRF failure response so framework diagnostics are not exposed to the browser.

## How is authentication secured?

The project uses Django's built-in user model, password hashing, and server-managed sessions. React does not store passwords or reusable access tokens. The browser sends an `HttpOnly`, `SameSite=Lax` session cookie; CSRF protection applies to state-changing requests; CORS and CSRF origins are explicit; and five failed sign-in attempts for the same IP/username are throttled for 15 minutes.

## What tradeoffs were made?

Search, status filtering, priority filtering, and sorting operate on the loaded list in the frontend. That is simple and responsive for the assessment's small dataset. Authentication is intentionally a single shared project-manager session, not a full role- or organization-based authorization system. Docker and deployment were intentionally omitted because they were optional and the project prioritized a secure, tested core application.

## What would improve with more time?

- Add server-side pagination, filtering, and sorting when the project count grows beyond a small working list.
- Add user registration, password reset, role-based permissions, and per-user/project access rules if the application becomes multi-user.
- Add deployment infrastructure, monitoring, a production cache for shared throttling, and CI automation.
- Perform the deferred fresh-clone test from Phase 28 before external submission.

## Why were the implemented bonuses prioritized?

Search, filtering, and sorting help project managers find work quickly. Authentication protects project data. Automated tests protect required CRUD and security behavior during later changes. These bonuses improve the application's daily usability and reliability without distracting from the core requirements.

## How was AI used?

OpenAI Codex assisted with planning against the blueprint, code scaffolding, code and documentation review, debugging, UI/UX refinement, and verification guidance. The developer reviewed the resulting implementation, made the project decisions, tested the workflows, and remains responsible for the final submission.

## Which decisions were personally reviewed?

The developer reviewed the API contract, PostgreSQL configuration, validation rules, authentication flow, security settings, test results, user-facing error behavior, visual branding, UI/UX refinements, and final documentation. The developer also performed manual browser testing throughout the project.

## Submission status

A fresh-clone verification remains recommended before external submission. The final step is a concise submission review against the required functionality, documentation, and repository checks.
