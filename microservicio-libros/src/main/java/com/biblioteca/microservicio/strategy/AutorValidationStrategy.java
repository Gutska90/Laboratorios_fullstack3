package com.biblioteca.microservicio.strategy;

import com.biblioteca.microservicio.entity.Book;
import org.springframework.stereotype.Component;

/**
 * Estrategia de validación para el autor del libro
 * Implementa el patrón Strategy
 */
@Component
public class AutorValidationStrategy implements ValidationStrategy {
    
    private static final int MIN_LENGTH = 1;
    private static final int MAX_LENGTH = 100;
    
    @Override
    public boolean validate(Book book) {
        if (book.getAutor() == null || book.getAutor().trim().isEmpty()) {
            return false;
        }
        return book.getAutor().length() >= MIN_LENGTH && book.getAutor().length() <= MAX_LENGTH;
    }
    
    @Override
    public String getErrorMessage() {
        return "El autor debe tener entre " + MIN_LENGTH + " y " + MAX_LENGTH + " caracteres";
    }
}

