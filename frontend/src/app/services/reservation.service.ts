import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Reserve a book
  reserveBook(
    userId: number,
    bookId: number
  ): Observable<any> {

    const request = {
      userId,
      bookId
    };

    return this.http.post(
      `${this.apiUrl}/reservations`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // Get logged-in user's reservations
  getUserReservations(
    userId: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/users/${userId}/reservations`,
      { headers: this.getHeaders() }
    );
  }

  // Admin - Get all reservations
  getAllReservations(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/admin/reservations`,
      { headers: this.getHeaders() }
    );
  }

  // Return a book
  returnBook(
    reservationId: number
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/reservations/${reservationId}/return`,
      {},
      { headers: this.getHeaders() }
    );
  }
}