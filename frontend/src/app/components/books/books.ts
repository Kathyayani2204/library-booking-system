import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookService } from '../../services/book.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './books.html',
  styleUrl: './books.css'
})
export class Books implements OnInit {

  books = signal<any[]>([]);

  keyword = '';

  message = '';
  errorMessage = '';

  constructor(
    private bookService: BookService,
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {

    this.bookService.getBooks().subscribe({

      next: (data: any[]) => {

        console.log('Books received:', data);

        this.books.set(data);

        console.log(
          'Books count:',
          this.books().length
        );
      },

      error: (err: any) => {

        console.error(
          'Error loading books:',
          err
        );

        this.errorMessage =
          'Unable to load books.';
      }

    });
  }

  searchBooks(): void {

    const searchKeyword =
      this.keyword.trim();

    if (!searchKeyword) {
      this.loadBooks();
      return;
    }

    this.message = '';
    this.errorMessage = '';

    this.bookService
      .searchBooks(searchKeyword)
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'Search results:',
            data
          );

          this.books.set(data);
        },

        error: (err: any) => {

          console.error(
            'Search error:',
            err
          );

          this.errorMessage =
            'Unable to search books.';
        }

      });
  }

  clearSearch(): void {

    this.keyword = '';
    this.message = '';
    this.errorMessage = '';

    this.loadBooks();
  }

  reserveBook(bookId: number): void {

    this.message = '';
    this.errorMessage = '';

    if (!this.authService.isLoggedIn()) {

      this.errorMessage =
        'Please login before reserving a book.';

      return;
    }

    const userIdString =
      localStorage.getItem('userId');

    if (!userIdString) {

      this.errorMessage =
        'User information not found. Please login again.';

      return;
    }

    const userId =
      Number(userIdString);

    this.reservationService
      .reserveBook(userId, bookId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Reservation successful:',
            response
          );

          this.message =
            'Book reserved successfully!';

          this.errorMessage = '';

          this.loadBooks();
        },

        error: (err: any) => {

          console.error(
            'Reservation error:',
            err
          );

          let errorMessage =
            'Unable to reserve book.';

          if (err.error) {

            if (
              typeof err.error === 'object'
            ) {

              errorMessage =
                err.error.message ||
                'Unable to reserve book.';

            } else if (
              typeof err.error === 'string'
            ) {

              try {

                const parsedError =
                  JSON.parse(err.error);

                errorMessage =
                  parsedError.message ||
                  'Unable to reserve book.';

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