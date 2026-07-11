import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReservationService
} from '../../services/reservation.service';

import {
  AuthService
} from '../../services/auth.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css'
})
export class MyReservations implements OnInit {

  reservations = signal<any[]>([]);

  message = signal('');
  errorMessage = signal('');

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  // Load reservations
  loadReservations(): void {

    const userId =
      this.authService.getUserId();

    if (userId === null) {

      this.errorMessage.set(
        'Please login to view your reservations.'
      );

      return;
    }

    this.reservationService
      .getUserReservations(userId)
      .subscribe({

        next: (data: any[]) => {

          console.log(
            'My reservations:',
            data
          );

          this.reservations.set(data);

          this.errorMessage.set('');
        },

        error: (err: any) => {

          console.error(
            'Error loading reservations:',
            err
          );

          this.errorMessage.set(
            'Unable to load reservations.'
          );
        }

      });
  }

  // Return book
  returnBook(
    reservationId: number
  ): void {

    const confirmed = confirm(
      'Are you sure you want to return this book?'
    );

    if (!confirmed) {
      return;
    }

    this.reservationService
      .returnBook(reservationId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Book returned successfully:',
            response
          );

          this.message.set(
            'Book returned successfully!'
          );

          this.errorMessage.set('');

          // Refresh reservations
          this.loadReservations();
        },

        error: (err: any) => {

          console.error(
            'Return book error:',
            err
          );

          this.errorMessage.set(
            'Unable to return the book.'
          );

          this.message.set('');
        }

      });
  }
}