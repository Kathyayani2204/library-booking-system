package com.library.librarybookingsystem.service;

import com.library.librarybookingsystem.entity.Book;
import com.library.librarybookingsystem.repository.BookRepository;
import com.library.librarybookingsystem.repository.ReservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private BookService bookService;

    private Book book;

    @BeforeEach
    void setUp() {
        book = new Book();
        book.setId(1L);
        book.setTitle("Clean Code");
        book.setAuthor("Robert Martin");
        book.setIsbn("54321");
        book.setAvailable(true);
    }

    @Test
    void getAllBooks_shouldReturnListFromRepository() {
        when(bookRepository.findAll()).thenReturn(List.of(book));

        List<Book> result = bookService.getAllBooks();

        assertEquals(1, result.size());
        assertEquals("Clean Code", result.get(0).getTitle());
        verify(bookRepository, times(1)).findAll();
    }

    @Test
    void getBookById_shouldReturnBook_whenExists() {
        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));

        Book result = bookService.getBookById(1L);

        assertEquals("Clean Code", result.getTitle());
    }

    @Test
    void getBookById_shouldThrow_whenNotFound() {
        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> bookService.getBookById(99L));

        assertEquals("Book not found", exception.getMessage());
    }

    @Test
    void addBook_shouldSaveAndReturnBook() {
        when(bookRepository.save(book)).thenReturn(book);

        Book result = bookService.addBook(book);

        assertEquals(book, result);
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void updateBook_shouldUpdateFieldsAndSave() {
        Book updated = new Book();
        updated.setTitle("Clean Code (2nd Edition)");
        updated.setAuthor("Robert Martin");
        updated.setIsbn("54321");
        updated.setAvailable(true);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(book));
        when(bookRepository.save(any(Book.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Book result = bookService.updateBook(1L, updated);

        assertEquals("Clean Code (2nd Edition)", result.getTitle());
        verify(bookRepository, times(1)).save(book);
    }

    @Test
    void deleteBook_shouldSucceed_whenNoActiveReservations() {
        when(reservationRepository.existsByBookId(1L)).thenReturn(false);

        bookService.deleteBook(1L);

        verify(bookRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteBook_shouldThrow_whenActiveReservationsExist() {
        when(reservationRepository.existsByBookId(1L)).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> bookService.deleteBook(1L));

        assertEquals("Cannot delete a book with active reservations", exception.getMessage());
        verify(bookRepository, never()).deleteById(anyLong());
    }
}