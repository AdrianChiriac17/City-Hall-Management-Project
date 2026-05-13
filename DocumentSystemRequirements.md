# Document Repository — Implementation Plan

Covers SRS requirements REQ-21 through REQ-30 and REQ-66 through REQ-70.

All authenticated users (Citizen, Employee, Department Manager, Forum Administrator,
System Administrator) own a personal document repository. Admins additionally have a
review queue where they can approve or reject uploaded documents.

---

## Route Map

| Route | Component | Guard |
|-------|-----------|-------|
| `/my-documents` | `MyDocumentsComponent` | `authGuard` |
| `/my-documents/create` | `UploadDocumentComponent` | `authGuard` |
| `/my-documents/:id` | `DocumentDetailComponent` | `authGuard` |
| `/admin/documents-approval` | `AdminDocumentApprovalComponent` | `roleGuard(System Administrator)` |
| `/admin/documents-approval/:id` | `AdminDocumentReviewComponent` | `roleGuard(System Administrator)` |

---

## Role Permissions

| Action | Any Auth User | System Administrator |
|--------|:-------------:|:--------------------:|
| Upload document | ✅ | ✅ |
| View own documents | ✅ | ✅ |
| Delete own document (Pending/Rejected only) | ✅ | ✅ |
| View all pending documents | ❌ | ✅ |
| Approve / Reject document | ❌ | ✅ |

---

## Backend Steps

### Step 1 — Extend the `Document` model

File: `backend/Models/Document.cs`

Replace the existing `OwnerUserId` FK with `CitizenProfileId`, and add the new
approval fields. Remove `OwnerUserId` and its `OwnerUser` navigation property.

```
CitizenProfileId  Guid            — FK to CitizenProfile (replaces OwnerUserId)
CitizenProfile    CitizenProfile? — navigation property
OriginalFileName  string          — the real filename before the GUID rename
Title             string          — user-supplied display name (required)
Description       string          — optional free-text description
ApprovalStatus    string          — "Pending" | "Approved" | "Rejected" (default "Pending")
ReviewedByUserId  Guid?           — FK to User (nullable) — the admin who reviewed
ReviewedAt        DateTime?       — when the review happened
RejectionReason   string?         — populated only when status is "Rejected"
ReviewedByUser    User?           — navigation property
```

Also add a navigation property on `CitizenProfile.cs`:
```
ICollection<Document> Documents
```

**SeedData note:** The admin seed (`admin@demo.local`) currently creates only a `User`
with no `CitizenProfile`. Update `SeedData.cs` to also create a `CitizenProfile` for
the admin user (minimal data is fine), so the admin can upload documents like everyone else.

### Step 2 — Update `CityHallDbContext`

File: `backend/Data/CityHallDbContext.cs`

Add Fluent API for the two relationships touching `Document`:
```
Document.CitizenProfile → Restrict delete behaviour
  (a CitizenProfile cannot be deleted while it still owns documents)
Document.ReviewedByUser → Restrict delete behaviour
  (an admin User cannot be deleted while they have reviewed documents)
```

Remove the old `Document.OwnerUser` Fluent API configuration if it exists.

### Step 3 — Add EF Core migration

```
dotnet ef migrations add AddDocumentApprovalFields
dotnet ef database update
```

Also ensure `wwwroot/uploads/documents/` is created at startup in `Program.cs`
(same pattern used for `wwwroot/uploads/forum/`).

### Step 4 — Create DTOs

Directory: `backend/DTOs/Documents/`

**`DocumentResponseDto`** (record)
```
Guid     Id
string   Title
string   Description
string   OriginalFileName
string   ApprovalStatus
string?  RejectionReason
string?  ReviewedByName
DateTime? ReviewedAt
long     FileSizeBytes
string   Url
DateTime UploadedAt
string   OwnerName          ← populated only in admin responses
```

**`UploadDocumentRequestDto`** (class with validation attributes)
```
[Required, StringLength(200)]  string Title
[StringLength(1000)]           string? Description
IFormFile                      File     ← validated in service layer
```

**`ReviewDocumentRequestDto`** (class with validation attributes)
```
[Required]  bool    IsApproved
[StringLength(1000)] string? RejectionReason   ← required when IsApproved = false
```

### Step 5 — Create Repository interface and implementation

**`backend/Repositories/IDocumentRepository.cs`**
```
Task<IEnumerable<Document>> GetByCitizenProfileAsync(Guid citizenProfileId, CancellationToken ct)
Task<Document?> GetByIdAsync(Guid id, CancellationToken ct)
Task<IEnumerable<Document>> GetPendingAsync(CancellationToken ct)
Task AddAsync(Document document, CancellationToken ct)
Task SaveChangesAsync(CancellationToken ct)
void Remove(Document document)
```

**`backend/Repositories/DocumentRepository.cs`**
- Implements `IDocumentRepository`
- `GetByCitizenProfileAsync` → `WHERE CitizenProfileId = citizenProfileId ORDER BY UploadedAt DESC`
- `GetPendingAsync` → `WHERE ApprovalStatus = "Pending" ORDER BY UploadedAt ASC`, includes `CitizenProfile.User`
- `GetByIdAsync` → includes `CitizenProfile.User` and `ReviewedByUser`

### Step 6 — Create Service interface and implementation

**`backend/Services/IDocumentService.cs`**
```
Task<IEnumerable<DocumentResponseDto>> GetMyDocumentsAsync(Guid citizenProfileId, CancellationToken ct)
Task<DocumentResponseDto?> GetMyDocumentByIdAsync(Guid documentId, Guid citizenProfileId, CancellationToken ct)
Task<DocumentResponseDto> UploadDocumentAsync(Guid citizenProfileId, UploadDocumentRequestDto dto, HttpRequest request, CancellationToken ct)
Task<bool> DeleteDocumentAsync(Guid documentId, Guid citizenProfileId, CancellationToken ct)
Task<IEnumerable<DocumentResponseDto>> GetPendingDocumentsAsync(CancellationToken ct)
Task<DocumentResponseDto?> GetDocumentForReviewAsync(Guid documentId, CancellationToken ct)
Task<DocumentResponseDto?> ReviewDocumentAsync(Guid documentId, Guid reviewerUserId, ReviewDocumentRequestDto dto, CancellationToken ct)
```

Business rules enforced in the service layer:
- Only PDF, DOC, DOCX, PNG, JPG, JPEG accepted (validated by MIME + extension)
- Max file size: 10 MB
- File stored as `wwwroot/uploads/documents/{newGuid}{ext}`
- URL constructed from `Request.Scheme + Request.Host + StoragePath`
- `DeleteDocumentAsync` only succeeds if `ApprovalStatus` is `"Pending"` or `"Rejected"`
- `ReviewDocumentAsync` sets `RejectionReason = null` when approving
- `RejectionReason` is required when `IsApproved = false`

### Step 7 — Create `DocumentsController`

File: `backend/Controllers/DocumentsController.cs`
Route: `api/my-documents`
Authorization: `[Authorize]` on the class

Endpoints:
```
GET    api/my-documents           → IDocumentService.GetMyDocumentsAsync
GET    api/my-documents/{id}      → IDocumentService.GetMyDocumentByIdAsync (404 if not owner)
POST   api/my-documents           → IDocumentService.UploadDocumentAsync ([FromForm])
DELETE api/my-documents/{id}      → IDocumentService.DeleteDocumentAsync (404/403/400 as needed)
```

### Step 8 — Create `AdminDocumentsController`

File: `backend/Controllers/AdminDocumentsController.cs`
Route: `api/admin/documents`
Authorization: `[Authorize(Roles = "System Administrator")]` on the class

Endpoints:
```
GET    api/admin/documents/pending     → IDocumentService.GetPendingDocumentsAsync
GET    api/admin/documents/{id}        → IDocumentService.GetDocumentForReviewAsync
POST   api/admin/documents/{id}/review → IDocumentService.ReviewDocumentAsync
```

### Step 9 — Register dependencies in `Program.cs`

```csharp
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IDocumentService, DocumentService>();
```

Also add directory creation alongside the forum uploads block:
```csharp
Directory.CreateDirectory(Path.Combine(webRoot, "uploads", "documents"));
```

---

## Frontend Steps

Follow existing project patterns: standalone components, `@if`/`@for`, reactive forms,
`withCredentials: true` on all HTTP calls.

### Step 10 — Create `DocumentService`

File: `frontend/src/app/services/document.service.ts`

Interfaces:
```typescript
DocumentSummary { id, title, approvalStatus, fileSizeBytes, uploadedAt, originalFileName }
DocumentDetail  { ...DocumentSummary, description, rejectionReason, reviewedByName, reviewedAt, url, ownerName }
```

Methods:
```
getMyDocuments()                              → GET /api/my-documents
getMyDocument(id)                             → GET /api/my-documents/{id}
uploadDocument(formData: FormData)            → POST /api/my-documents
deleteDocument(id)                            → DELETE /api/my-documents/{id}
getPendingDocuments()                         → GET /api/admin/documents/pending
getDocumentForReview(id)                      → GET /api/admin/documents/{id}
reviewDocument(id, payload)                   → POST /api/admin/documents/{id}/review
```

### Step 11 — Add "My Documents" button to the Profile page

File: `frontend/src/app/pages/profile/profile.component.html`

Add a prominent "My Documents" button inside the profile page — for example as a
quick-action card below the read-only info section — that navigates to `/my-documents`.
This keeps the navbar uncluttered and positions the entry point logically next to the
user's personal information.

```html
<a routerLink="/my-documents" class="quick-action-btn">My Documents</a>
```

The profile component already imports `RouterLink`, so no additional imports are needed.

### Step 12 — Create `MyDocumentsComponent`

Route: `/my-documents`
Files: `frontend/src/app/pages/my-documents/my-documents.component.{ts,html,css}`

Behaviour:
- On init: calls `DocumentService.getMyDocuments()`
- Shows skeleton cards while loading
- Renders a card per document showing: Title, ApprovalStatus badge
  (green = Approved, amber = Pending, red = Rejected), file size, upload date
- Each card is clickable → navigates to `/my-documents/{id}`
- Empty state with an "Upload your first document" call-to-action
- Fixed "Upload New Document" button at the bottom of the list

Approval status badge colours:
```
Pending  → amber  (#f59e0b background)
Approved → green  (#00c6a2 background)
Rejected → red    (#e74c3c background)
```

### Step 13 — Create `UploadDocumentComponent`

Route: `/my-documents/create`
Files: `frontend/src/app/pages/my-documents/upload-document/upload-document.component.{ts,html,css}`

Form fields:
```
Title        text input   required, max 200 chars
Description  textarea     optional, max 1000 chars
File         file input   required, accept PDF/DOC/DOCX/PNG/JPG
```

Behaviour:
- Client-side file validation: MIME type + size ≤ 10 MB before submitting
- On submit: builds `FormData`, calls `DocumentService.uploadDocument()`
- On success: navigate to `/my-documents`
- Cancel button → navigate to `/my-documents`
- Shows filename + size preview after file is selected

### Step 14 — Create `DocumentDetailComponent`

Route: `/my-documents/:id`
Files: `frontend/src/app/pages/my-documents/document-detail/document-detail.component.{ts,html,css}`

Behaviour:
- On init: calls `DocumentService.getMyDocument(id)`
- Shows: Title, Description, ApprovalStatus badge, file info, upload date
- If `Approved`: shows a "Download" link (`[href]="doc.url"` with `target="_blank"`)
- If `Rejected`: shows the rejection reason in a red notice box
- If `Pending` or `Rejected`: shows a red "Delete Document" button with a confirm dialog
- Back link → `/my-documents`

### Step 15 — Create `AdminDocumentApprovalComponent`

Route: `/admin/documents-approval`
Files: `frontend/src/app/pages/admin/document-approval/document-approval.component.{ts,html,css}`

Behaviour:
- On init: calls `DocumentService.getPendingDocuments()`
- Shows a table/list: Owner name, Document title, Upload date, "Review" button
- "Review" button → navigates to `/admin/documents-approval/{id}`
- Empty state: "No documents awaiting review"
- Skeleton loading state

### Step 16 — Create `AdminDocumentReviewComponent`

Route: `/admin/documents-approval/:id`
Files: `frontend/src/app/pages/admin/document-review/document-review.component.{ts,html,css}`

Behaviour:
- On init: calls `DocumentService.getDocumentForReview(id)`
- Shows full document detail: owner name, title, description, file info, download link
- Two action buttons: green "Approve" and red "Reject"
- Clicking "Reject" reveals a required textarea for the rejection reason
- On submit: calls `DocumentService.reviewDocument()`, on success navigate back to `/admin/documents-approval`
- Cancel/back link → `/admin/documents-approval`

### Step 17 — Update `app.routes.ts`

Add the following routes:
```typescript
{ path: 'my-documents',                      component: MyDocumentsComponent,             canActivate: [authGuard] },
{ path: 'my-documents/create',               component: UploadDocumentComponent,          canActivate: [authGuard] },
{ path: 'my-documents/:id',                  component: DocumentDetailComponent,          canActivate: [authGuard] },
{ path: 'admin/documents-approval',          component: AdminDocumentApprovalComponent,   canActivate: [roleGuard(['System Administrator'])] },
{ path: 'admin/documents-approval/:id',      component: AdminDocumentReviewComponent,     canActivate: [roleGuard(['System Administrator'])] },
```

Note: `/my-documents/create` must be declared **before** `/my-documents/:id` so Angular
does not treat the literal string "create" as a dynamic segment.

---

## Key Technical Decisions

**Why `CitizenProfileId` instead of `OwnerUserId`?**
Every user is a citizen first. Admins and employees will each have their own
`CitizenProfile` (the admin seed is updated to create one). Future work separates
the citizen-facing profile page from role-specific admin/employee profile pages, but
the document repository is always accessed through the citizen identity. Using
`CitizenProfileId` makes that relationship explicit and keeps the citizen's data
self-contained under their `CitizenProfile`.

**Why store files in `wwwroot/uploads/documents/`?**
Consistent with the existing forum attachment pattern. `UseStaticFiles()` already
serves this root. No additional middleware needed.

**Delete restriction — Pending/Rejected only**
An Approved document may be linked to a citizen request (`RequestDocument`). Allowing
deletion of approved documents could break that link. Only Pending and Rejected
documents (never attached) are safe to delete without a cascade concern.

**Migration order**
Run the migration before wiring up `Program.cs` upload-directory creation, otherwise
the first app boot may try to create a directory before the DB schema is ready.
