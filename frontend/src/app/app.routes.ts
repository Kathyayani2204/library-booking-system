import { Routes } from '@angular/router';

import { Login } from './login/login';
import { Register } from './register/register';

import { Books } from './components/books/books';

import {
  MyReservations
} from './components/my-reservations/my-reservations';

import {
  AdminDashboard
} from './components/admin-dashboard/admin-dashboard';

import {
  authGuard
} from './guards/auth.guard';

import {
  adminGuard
} from './guards/admin.guard';

export const routes: Routes = [

  // Default page
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },

  // Public
  {
    path: 'books',
    component: Books
  },

  // Public
  {
    path: 'login',
    component: Login
  },

  // Public
  {
    path: 'register',
    component: Register
  },

  // Logged-in users only
  {
    path: 'my-reservations',
    component: MyReservations,
    canActivate: [authGuard]
  },

  // ADMIN only
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard]
  },

  // Unknown URL
  {
    path: '**',
    redirectTo: 'books'
  }

];