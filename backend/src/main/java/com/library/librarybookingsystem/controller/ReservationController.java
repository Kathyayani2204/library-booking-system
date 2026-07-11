package com.library.librarybookingsystem.controller;

import com.library.librarybookingsystem.dto.ReservationRequest;
import com.library.librarybookingsystem.entity.Reservation;
import com.library.librarybookingsystem.service.ReservationService;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // Reserve a book
    @PostMapping("/api/reservations")
public Reservation reserve(
        @Valid @RequestBody ReservationRequest request
) {
    return reservationService.reserveBook(request);
}

    // Get reservations of a user
    @GetMapping("/api/users/{id}/reservations")
    public List<Reservation> userReservations(
            @PathVariable Long id
    ) {
        return reservationService
                .getUserReservations(id);
    }

    // Admin - Get all reservations
    @GetMapping("/api/admin/reservations")
    public List<Reservation> allReservations() {
        return reservationService
                .getAllReservations();
    }

    // Return a book
    @PutMapping("/api/reservations/{id}/return")
    public Reservation returnBook(
            @PathVariable Long id
    ) {
        return reservationService
                .returnBook(id);
    }
}