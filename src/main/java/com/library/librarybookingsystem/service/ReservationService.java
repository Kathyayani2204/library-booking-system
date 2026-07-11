package com.library.librarybookingsystem.service;

import com.library.librarybookingsystem.dto.ReservationRequest;
import com.library.librarybookingsystem.entity.*;
import com.library.librarybookingsystem.repository.*;
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

    public Reservation reserveBook(ReservationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (!book.isAvailable()) {
            throw new RuntimeException("Book is not available");
        }

        book.setAvailable(false);
        bookRepository.save(book);

        Reservation reservation = Reservation.builder()
                .user(user)
                .book(book)
                .issueDate(LocalDate.now())
                .returnDate(LocalDate.now().plusDays(14))
                .status(ReservationStatus.ACTIVE)
                .build();

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getUserReservations(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}