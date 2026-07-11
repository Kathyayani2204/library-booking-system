import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Get all books
  getBooks(): Observable<any[]> {

    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(
        tap(data =>
          console.log('API Response:', data)
        )
      );
  }

  // Get one book
  getBook(id: number): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  // Search books
  searchBooks(keyword: string): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/search`,
      {
        params: {
          keyword: keyword
        }
      }
    );
  }

  // Admin - Add book
  addBook(book: any): Observable<any> {

    return this.http.post(
      this.apiUrl,
      book,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Admin - Update book
  updateBook(
    id: number,
    book: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      book,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Admin - Delete book
  deleteBook(id: number): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders(),
        responseType: 'text'
      }
    );
  }
}