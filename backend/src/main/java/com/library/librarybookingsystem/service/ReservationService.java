package com.library.librarybookingsystem.service;

import com.library.librarybookingsystem.dto.ReservationRequest;
import com.library.librarybookingsystem.entity.Book;
import com.library.librarybookingsystem.entity.Reservation;
import com.library.librarybookingsystem.entity.ReservationStatus;
import com.library.librarybookingsystem.entity.User;
import com.library.librarybookingsystem.repository.BookRepository;
import com.library.librarybookingsystem.repository.ReservationRepository;
import com.library.librarybookingsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // Reserve a book
    public Reservation reserveBook(ReservationRequest request) {

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Book book = bookRepository
                .findById(request.getBookId())
                .orElseThrow(() ->
                        new RuntimeException("Book not found")
                );

        if (!book.isAvailable()) {
            throw new RuntimeException(
                    "Book is not available"
            );
        }

        // Make book unavailable
        book.setAvailable(false);
        bookRepository.save(book);

        Reservation reservation =
                Reservation.builder()
                        .user(user)
                        .book(book)
                        .issueDate(LocalDate.now())
                        .returnDate(
                                LocalDate.now().plusDays(14)
                        )
                        .status(
                                ReservationStatus.ACTIVE
                        )
                        .build();

        return reservationRepository
                .save(reservation);
    }

    // Get reservations of a user
    public List<Reservation> getUserReservations(
            Long userId
    ) {
        return reservationRepository
                .findByUserId(userId);
    }

    // Admin - Get all reservations
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // Return a book
    public Reservation returnBook(
            Long reservationId
    ) {

        Reservation reservation =
                reservationRepository
                        .findById(reservationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Reservation not found"
                                )
                        );

        // Check if already returned
        if (reservation.getStatus()
                == ReservationStatus.RETURNED) {

            throw new RuntimeException(
                    "Book has already been returned"
            );
        }

        // Change reservation status
        reservation.setStatus(
                ReservationStatus.RETURNED
        );

        // Make book available again
        Book book = reservation.getBook();

        book.setAvailable(true);

        bookRepository.save(book);

        // Save updated reservation
        return reservationRepository
                .save(reservation);
    }
}