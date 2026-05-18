import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForumComponent } from './pages/forum/forum.component';
import { CreateThreadComponent } from './pages/forum/create-thread/create-thread.component';
import { ThreadDetailComponent } from './pages/forum/thread-detail/thread-detail.component';
import { AdminComponent } from './pages/admin/admin.component';
import { MyDocumentsComponent } from './pages/my-documents/my-documents.component';
import { UploadDocumentComponent } from './pages/my-documents/upload-document/upload-document.component';
import { DocumentDetailComponent } from './pages/my-documents/document-detail/document-detail.component';
import { DocumentApprovalComponent } from './pages/admin/document-approval/document-approval.component';
import { DocumentReviewComponent } from './pages/admin/document-review/document-review.component';
import { MyRequestsComponent } from './pages/my-requests/my-requests.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    redirectTo: ''
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'forum',
    component: ForumComponent,
    canActivate: [authGuard]
  },
  {
    path: 'forum/new',
    component: CreateThreadComponent,
    canActivate: [authGuard]
  },
  {
    path: 'forum/thread/:id',
    component: ThreadDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard(['System Administrator'])]
  },
  {
    path: 'my-documents',
    component: MyDocumentsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-documents/create',
    component: UploadDocumentComponent,
    canActivate: [authGuard]
  },
  {
    path: 'my-documents/:id',
    component: DocumentDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/documents-approval',
    component: DocumentApprovalComponent,
    canActivate: [roleGuard(['System Administrator'])]
  },
  {
    path: 'admin/documents-approval/:id',
    component: DocumentReviewComponent,
    canActivate: [roleGuard(['System Administrator'])]
  },
  {
    path: 'my-requests',
    component: MyRequestsComponent,
    canActivate: [roleGuard(['Citizen'])]
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [roleGuard(['Employee', 'Department Manager', 'System Administrator'])]
  },
  {
    path: 'announcements',
    component: AnnouncementsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard(['Employee', 'Department Manager', 'System Administrator'])]
  },

  // Placeholder routes pentru paginile informative.
  {
    path: 'about-us',
    component: HomeComponent
  },
  {
    path: 'privacy-policy',
    component: HomeComponent
  },
  {
    path: 'terms-and-conditions',
    component: HomeComponent
  },

  {
    path: '**',
    redirectTo: ''
  }
];
