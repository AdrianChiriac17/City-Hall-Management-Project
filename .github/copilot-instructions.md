# Project Coding Guidelines

These instructions apply to the whole repository. Follow them when editing code in this project.

## General

- Keep changes scoped to the requested feature or bug fix.
- Prefer existing project patterns over introducing new libraries or architecture.
- Do not edit generated folders such as `frontend/node_modules`, `frontend/dist`, `backend/bin`, or `backend/obj`.
- Use ASCII text unless the surrounding file already uses other characters for a clear reason.
- After meaningful frontend changes, run `npm run build` from `frontend`.
- After meaningful backend changes, run `dotnet build "City Hall Management Project.slnx"` from `backend`.

## Frontend

- This app uses Angular standalone components. Add dependencies through the component `imports` array only when the template actually uses them.
- Prefer Angular built-in control flow: use `@if`, `@else`, `@for`, and `@switch` instead of `*ngIf`, `*ngFor`, or `ngSwitch`.
- Prefer typed reactive forms for form-heavy UI. Keep validation messages close to the component logic.
- Use services for API calls and shared state. Components should call services rather than duplicating HTTP logic.
- Auth API calls that rely on the ASP.NET Identity cookie must use `withCredentials: true`.
- Keep local development API URLs on `localhost`, not `127.0.0.1`, so browser cookie behavior matches the backend CORS origin.
- Avoid manual `ChangeDetectorRef.detectChanges()` unless there is a specific Angular lifecycle reason.
- For initial auth checks in layout components, avoid mutating bound state during the first change detection pass. Prefer deferring with `afterNextRender()` or using a route/app initialization pattern.

## Backend

- This backend uses ASP.NET Core controllers, Entity Framework Core, SQL Server, and ASP.NET Identity.
- Keep API routes under `/api/...` and return DTOs or intentionally shaped anonymous objects, not EF entities with navigation graphs.
- Preserve cookie-based auth unless a task explicitly changes the auth model.
- Keep Identity cookie settings aligned with the current frontend setup:
  - `HttpOnly = true`
  - `SameSite = Lax`
  - `SecurePolicy = SameAsRequest`
  - CORS allows `http://localhost:4200` with credentials
- Prefer async EF Core and Identity APIs.
- Put request/response contracts in `backend/DTOs` rather than binding frontend payloads directly to entity models.
- Keep seed-data changes in the existing seeding flow.

## Style

- Use clear, boring names over clever abbreviations.
- Add comments only when they explain non-obvious behavior or project-specific constraints.
- Do not refactor unrelated files while fixing a focused issue.
