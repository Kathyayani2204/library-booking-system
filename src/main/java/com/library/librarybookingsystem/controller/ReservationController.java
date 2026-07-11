package com.library.librarybookingsystem.controller;

import com.library.librarybookingsystem.dto.ReservationRequest;
import com.library.librarybookingsystem.entity.Reservation;
import com.library.librarybookingsystem.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/api/reservations")
    public Reservation reserve(@RequestBody ReservationRequest request) {
        return reservationService.reserveBook(request);
    }

    @GetMapping("/api/users/{id}/reservations")
    public List<Reservation> userReservations(@PathVariable Long id) {
        return reservationService.getUserReservations(id);
    }

    @GetMapping("/api/admin/reservations")
    public List<Reservation> allReservations() {
        return reservationService.getAllReservations();
    }
}