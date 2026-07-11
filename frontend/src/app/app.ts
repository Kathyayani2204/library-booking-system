import { Component, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  isLoggedIn = signal(false);
  userName = signal('');
  userRole = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Load authentication information when app starts
    this.updateLoginStatus();

    // Update authentication information after navigation completes
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateLoginStatus();
      });
  }

  updateLoginStatus(): void {
    const loggedIn = this.authService.isLoggedIn();
    const name = this.authService.getName() || '';
    const role = this.authService.getRole() || '';

    this.isLoggedIn.set(loggedIn);
    this.userName.set(name);
    this.userRole.set(
      role.trim().toUpperCase()
    );

    console.log('Logged in:', this.isLoggedIn());
    console.log('Name:', this.userName());
    console.log('Role:', this.userRole());
  }

  logout(): void {
    this.authService.logout();

    this.updateLoginStatus();

    this.router.navigate(['/login']);
  }
}