import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  password = '';

  message = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {

    this.message = '';
    this.errorMessage = '';

    // Email validation
    if (!this.email.trim()) {
      this.errorMessage = 'Email is required.';
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage =
        'Please enter a valid email address.';
      return;
    }

    // Password validation
    if (!this.password) {
      this.errorMessage = 'Password is required.';
      return;
    }

    const credentials = {
      email: this.email.trim(),
      password: this.password
    };

    this.authService.login(credentials).subscribe({

      next: (response: any) => {

        console.log('Login response:', response);

        // Save all login data directly
        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'userId',
          response.userId.toString()
        );

        localStorage.setItem(
          'name',
          response.name
        );

        localStorage.setItem(
          'role',
          response.role
        );

        console.log('Login successful');

        this.message = 'Login successful';
        this.errorMessage = '';

        // Redirect based on role
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/books']);
        }
      },

      error: (err: any) => {

        console.error(
          'Login error:',
          err
        );

        this.errorMessage =
          err.error?.message ||
          'Invalid email or password';

        this.message = '';
      }

    });
  }
}