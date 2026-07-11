package com.library.librarybookingsystem.service;

import com.library.librarybookingsystem.entity.Book;
import com.library.librarybookingsystem.repository.BookRepository;
import com.library.librarybookingsystem.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final ReservationRepository reservationRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updated) {
        Book book = getBookById(id);
        book.setTitle(updated.getTitle());
        book.setAuthor(updated.getAuthor());
        book.setIsbn(updated.getIsbn());
        book.setAvailable(updated.isAvailable());
        return bookRepository.save(book);
    }

    public List<Book> searchBooks(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, keyword);
    }

    public void deleteBook(Long id) {
        boolean hasReservations = reservationRepository.existsByBookId(id);
        if (hasReservations) {
            throw new RuntimeException("Cannot delete a book with active reservations");
        }
        bookRepository.deleteById(id);
    }
}