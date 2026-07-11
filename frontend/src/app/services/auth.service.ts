import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  // Register user
  register(
    user: {
      name: string;
      email: string;
      password: string;
    }
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/register`,
      user,
      {
        responseType: 'text'
      }
    );
  }

  // Login user
  login(
    credentials: {
      email: string;
      password: string;
    }
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      credentials
    );
  }

  // Check if user is logged in
  isLoggedIn(): boolean {

    return !!localStorage.getItem(
      'token'
    );
  }

  // Get JWT token
  getToken(): string | null {

    return localStorage.getItem(
      'token'
    );
  }

  // Get user ID
  getUserId(): number | null {

    const userId =
      localStorage.getItem(
        'userId'
      );

    if (!userId) {
      return null;
    }

    return Number(userId);
  }

  // Get user name
  getName(): string | null {

    return localStorage.getItem(
      'name'
    );
  }

  // Get user role
  getRole(): string | null {

    return localStorage.getItem(
      'role'
    );
  }

  // Logout
  logout(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'userId'
    );

    localStorage.removeItem(
      'name'
    );

    localStorage.removeItem(
      'role'
    );
  }
}