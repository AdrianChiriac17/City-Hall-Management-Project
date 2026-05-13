# Agent Coding Guidelines

These instructions apply to the whole repository. Follow them when editing any code in this project.

---

## General Conventions

- Keep changes scoped to the requested feature or bug fix. Do not refactor unrelated files.
- Prefer existing project patterns over introducing new libraries or architecture.
- Do not edit generated folders: `frontend/node_modules`, `frontend/dist`, `backend/bin`, `backend/obj`.
- Use clear, boring names over clever abbreviations.
- Add comments only when they explain non-obvious behavior or project-specific constraints.
- After meaningful frontend changes, run `npm run build` from `frontend/`.
- After meaningful backend changes, run `dotnet build "City Hall Management Project.slnx"` from `backend/`.

---

## Frontend Guidelines (Angular)

### Framework & Styling

- Use Angular (latest stable version).
- Use Tailwind CSS as the primary styling framework for new components.
- Existing components use custom CSS — do not rewrite them to Tailwind unless explicitly asked.
- Focus on clean, modern, responsive UI design.

### Folder Structure

```
src/app/
  core/
    models/       ← shared TypeScript interfaces and DTOs
    services/     ← HTTP services and shared state
    guards/       ← route guards
    interceptors/ ← HTTP interceptors
  features/       ← feature modules/pages
  shared/         ← reusable UI components
```

### Component Structure

- Use separate files for every component: `.ts`, `.html`, `.css` (or `.scss`).
- Do not use inline templates or inline styles except for trivial one-off components.
- This project uses **standalone components**. Add dependencies only through the component `imports` array, and only when the template actually uses them.

### Angular Control Flow

- Always use modern Angular control flow syntax:
  - `@if` / `@else` instead of `*ngIf`
  - `@for` instead of `*ngFor` — always include `track`
  - `@switch` instead of `ngSwitch`

### Reactivity

- Prefer Angular Signals for local and shared state in new code:
  - `signal()`, `computed()`, `effect()`
  - `input()`, `output()`, `model()` for component I/O
- Existing code uses `BehaviorSubject` — do not rewrite it unless explicitly asked.
- Avoid manual `ChangeDetectorRef.detectChanges()` unless there is a specific Angular lifecycle reason.
- For initial auth checks in layout components, defer with `afterNextRender()` to avoid mutating bound state during the first change detection pass.

### HTTP & API

- Centralize all HTTP calls in services. Components must never call `HttpClient` directly.
- Use Angular interceptors for cross-cutting concerns such as auth token injection.
- All auth API calls that rely on the ASP.NET Identity cookie must use `withCredentials: true`.
- Keep local development API URLs on `localhost`, not `127.0.0.1`, so browser cookie behavior matches the backend CORS origin.

### State Management

- Keep business logic in services, not components.
- Use Angular Signals for application state in new code.

### Template Philosophy

- Keep templates declarative and free of complex logic.
- Move reusable UI into shared components.
- TypeScript files should focus on presentation logic only.

---

## Backend Guidelines (.NET)

### Platform

- Use .NET 10 and ASP.NET Core Web API.
- Do not use Minimal APIs — use Controllers with attribute routing.

### Architecture

Use a classical layered architecture:

```
Controllers/   ← thin HTTP layer; no business logic, no EF calls
Services/      ← business logic; orchestrates repositories and helpers
Repositories/  ← all EF Core data access; no business logic
Models/        ← EF Core entity classes
DTOs/          ← request and response contracts
Mappings/      ← extension methods that map between models and DTOs
Helpers/       ← stateless utility classes
```

### DTO Naming Convention

**Request DTOs** — data coming *in* from the frontend:

```
{Action}{Entity}RequestDto
```

Examples: `RegisterUserRequestDto`, `CreateForumThreadRequestDto`, `UpdateRequestStatusRequestDto`

- Use `class` types so validation attributes work correctly.

**Response DTOs** — data going *out* to the frontend:

```
{Entity}ResponseDto
```

or when action-specific:

```
{Action}{Entity}ResponseDto
```

Examples: `UserProfileResponseDto`, `ForumThreadResponseDto`, `LoginUserResponseDto`

- Use `record` types for immutability and conciseness.

Never expose EF entity models directly to API consumers.

### Controllers

- Controllers receive HTTP requests, call services, and return DTOs with appropriate HTTP status codes.
- No business logic and no EF calls inside controllers.
- Use classic constructor dependency injection with `private readonly` fields.
- Apply `[ApiController]` so DTO validation attributes automatically produce `400 Bad Request` responses.
- Use explicit lowercase routes: `[Route("api/forum")]`, `[Route("api/auth")]`.
- Keep API routes under `/api/...`.

### Services

- Services contain business logic and orchestrate repositories and helpers.
- Services must not execute EF Core calls directly — delegate to repositories.
- Async methods should accept `CancellationToken cancellationToken = default` and pass it downstream.
- Auth-specific normalization (trimming, capitalizing names) belongs in the service layer.

### Repositories

- All EF Core queries live in repositories. No raw SQL in controllers or services.
- Depend on interfaces rather than concrete implementations.
- Register via ASP.NET Core's built-in DI container.

### Models

- Use GUID primary keys for main entities.
- Add EF Core navigation properties where needed.
- Store mutable timestamps as `DateTime UpdatedAt`.

### Mappings

- Keep mapping code in focused extension files under `Mappings/`, one file per feature area (e.g., `ForumMappingExtensions.cs`, `AuthMappingExtensions.cs`).
- Mapping methods must not contain security-sensitive business logic.

### Authentication

- Use ASP.NET Core Identity with Role-Based Access Control (`RoleManager`, `UserManager`).
- Preserve cookie-based authentication unless a task explicitly changes the auth model.
- Maintain these Identity cookie settings:
  - `HttpOnly = true`
  - `SameSite = Lax`
  - `SecurePolicy = SameAsRequest`
  - CORS allows `http://localhost:4200` with credentials.

### Data Access (EF Core)

- Use Entity Framework Core for all database operations. No hardcoded SQL.
- Apply lazy loading by default. Add `.Include()` / `.ThenInclude()` only when a specific query explicitly requires eager loading.
- Prefer async EF Core APIs (`ToListAsync`, `FirstOrDefaultAsync`, `SaveChangesAsync`, etc.).

### Dependency Injection

- Register repositories and services in `Program.cs` (or a single extension file if registrations become noisy).
- Depend on interfaces, not concrete types.

### API Documentation

- Use OpenAPI generation.
- Use Scalar UI for interactive API exploration.

### Error Handling

- Return appropriate HTTP status codes consistently.
- Use uniform API error response shapes.
- Display user-friendly error messages without exposing internal implementation details.

### Configuration & Secrets

- Store secrets and environment-specific settings in configuration files and environment variables.
- Never hardcode secrets in source files.

### Seed Data

- Keep seed-data additions inside the existing seeding flow (`SeedData.cs`).

### Testing

- Write unit tests for services and business logic only when explicitly requested.
- Mock repository dependencies in unit tests.

---

## General Engineering Principles

| Principle | Guideline |
|-----------|-----------|
| Separation of concerns | Controllers orchestrate. Services hold logic. Repositories access data. |
| Naming | Descriptive names; avoid non-standard abbreviations. |
| Consistency | Follow existing patterns before introducing new ones. |
| Readability | Small, focused methods over clever one-liners. |
| Security | Validate all external input. Never trust client-provided sensitive values. |
| Source control | Commit only necessary source files. Exclude build outputs, secrets, and temp files. |

When multiple valid approaches exist, prefer the solution that is — in order: **Simple → Maintainable → Consistent → Secure → Professional**.