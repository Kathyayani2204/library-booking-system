package com.library.librarybookingsystem.service;

import com.library.librarybookingsystem.dto.ReservationRequest;
import com.library.librarybookingsystem.entity.*;
import com.library.librarybookingsystem.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private ReservationService reservationService;

    private User user;
    private Book book;
    private ReservationRequest request;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@test.com");

        book = new Book();
        book.setId(1L);
        book.setTitle("Clean Code");
        book.setAvailable(true);

        request = new ReservationRequest();
        request.setUserId(1L);
        request.setBookId(1L);
    }

    @Test
    void reserveBook_shouldSucceed_whenBookIsAvailable() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Reservation result = reservationService.reserveBook(request);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertEquals(book, result.getBook());
        assertEquals(ReservationStatus.ACTIVE, result.getStatus());
        assertFalse(book.isAvailable(), "Book should be marked unavailable after reservation");

        verify(bookRepository, times(1)).save(book);
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }

    @Test
    void reserveBook_shouldThrow_whenBookIsNotAvailable() {
        book.setAvailable(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> reservationService.reserveBook(request));

        assertEquals("Book is not available", exception.getMessage());
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    void reserveBook_shouldThrow_whenUserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> reservationService.reserveBook(request));

        assertEquals("User not found", exception.getMessage());
        verifyNoInteractions(bookRepository, reservationRepository);
    }

    @Test
    void reserveBook_shouldThrow_whenBookNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bookRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> reservationService.reserveBook(request));

        assertEquals("Book not found", exception.getMessage());
        verify(reservationRepository, never()).save(any(Reservation.class));
    }

    @Test
    void getUserReservations_shouldReturnListFromRepository() {
        when(reservationRepository.findByUserId(1L)).thenReturn(java.util.List.of());

        var result = reservationService.getUserReservations(1L);

        assertNotNull(result);
        verify(reservationRepository, times(1)).findByUserId(1L);
    }
}