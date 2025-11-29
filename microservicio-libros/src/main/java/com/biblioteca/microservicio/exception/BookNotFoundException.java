package com.biblioteca.microservicio.exception;

/**
 * Excepción personalizada para cuando no se encuentra un libro
 */
public class BookNotFoundException extends RuntimeException {
    
    public BookNotFoundException(String message) {
        super(message);
    }
    
    public static BookNotFoundException withId(Long id) {
        return new BookNotFoundException("Libro no encontrado con ID: " + id);
    }
}

