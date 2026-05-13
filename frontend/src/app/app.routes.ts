import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ForumComponent } from './pages/forum/forum.component';
import { CreateThreadComponent } from './pages/forum/create-thread/create-thread.component';
import { ThreadDetailComponent } from './pages/forum/thread-detail/thread-detail.component';
import { authGuard } from './guards/auth.guard';

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
