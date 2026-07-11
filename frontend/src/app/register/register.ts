import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  password = '';

  message = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {

    this.message = '';
    this.errorMessage = '';

    // Name validation
    if (this.name.trim().length < 2) {
      this.errorMessage =
        'Name must contain at least 2 characters.';
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {
      this.errorMessage =
        'Please enter a valid email address.';
      return;
    }

    // Password validation
    if (this.password.length < 6) {
      this.errorMessage =
        'Password must contain at least 6 characters.';
      return;
    }

    const user = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.authService
      .register(user)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Register response:',
            response
          );

          this.message =
            'Registration successful! Redirecting to login...';

          this.errorMessage = '';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },

        error: (err: any) => {

          console.error(
            'Registration error:',
            err
          );

          let errorMessage =
            'Registration failed.';

          if (err.error) {

            // Backend returned an object
            if (typeof err.error === 'object') {

              errorMessage =
                err.error.message ||
                'Registration failed.';

            }

            // Backend returned JSON as a string
            else if (typeof err.error === 'string') {

              try {

                const parsedError =
                  JSON.parse(err.error);

                errorMessage =
                  parsedError.message ||
                  'Registration failed.';

              } catch {

                errorMessage =
                  err.error;
              }
            }
          }

          this.errorMessage =
            errorMessage;
        }

      });
  }
}