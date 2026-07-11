import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookService } from '../../services/book.service';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  books = signal<any[]>([]);
  reservations = signal<any[]>([]);

  message = signal('');
  errorMessage = signal('');

  title = '';
  author = '';
  isbn = '';
  available = true;

  editingBookId: number | null = null;

  constructor(
    private bookService: BookService,
    private reservationService: ReservationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    if (this.authService.getRole() !== 'ADMIN') {
      this.errorMessage.set(
        'Access denied. Admin only.'
      );
      return;
    }

    this.loadBooks();
    this.loadReservations();
  }

  loadBooks(): void {

    this.bookService.getBooks().subscribe({

      next: (data: any[]) => {
        this.books.set(data);
      },

      error: (err: any) => {
        console.error(err);
        this.errorMessage.set(
          'Unable to load books.'
        );
      }

    });
  }

  loadReservations(): void {

    this.reservationService
      .getAllReservations()
      .subscribe({

        next: (data: any[]) => {
          this.reservations.set(data);
        },

        error: (err: any) => {
          console.error(err);
          this.errorMessage.set(
            'Unable to load reservations.'
          );
        }

      });
  }

  saveBook(): void {

    const book = {
      title: this.title,
      author: this.author,
      isbn: this.isbn,
      available: this.available
    };

    if (this.editingBookId === null) {

      this.bookService
        .addBook(book)
        .subscribe({

          next: () => {
            this.message.set(
              'Book added successfully!'
            );

            this.errorMessage.set('');

            this.resetForm();
            this.loadBooks();
          },

          error: (err: any) => {
            console.error(err);

            this.errorMessage.set(
              'Unable to add book.'
            );
          }

        });

    } else {

      this.bookService
        .updateBook(
          this.editingBookId,
          book
        )
        .subscribe({

          next: () => {

            this.message.set(
              'Book updated successfully!'
            );

            this.errorMessage.set('');

            this.resetForm();
            this.loadBooks();
          },

          error: (err: any) => {
            console.error(err);

            this.errorMessage.set(
              'Unable to update book.'
            );
          }

        });
    }
  }

  editBook(book: any): void {

    this.editingBookId = book.id;

    this.title = book.title;
    this.author = book.author;
    this.isbn = book.isbn;
    this.available = book.available;
  }

  deleteBook(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this book?'
    );

    if (!confirmed) {
      return;
    }

    this.bookService
      .deleteBook(id)
      .subscribe({

        next: () => {

          this.message.set(
            'Book deleted successfully!'
          );

          this.errorMessage.set('');

          this.loadBooks();
        },

        error: (err: any) => {
          console.error(err);

          this.errorMessage.set(
            'Unable to delete book.'
          );
        }

      });
  }

  resetForm(): void {

    this.editingBookId = null;

    this.title = '';
    this.author = '';
    this.isbn = '';
    this.available = true;
  }
}