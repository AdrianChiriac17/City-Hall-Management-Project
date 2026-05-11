import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

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