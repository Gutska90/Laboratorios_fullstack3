package com.biblioteca.microservicio.strategy;

import com.biblioteca.microservicio.entity.Book;
import org.springframework.stereotype.Component;

/**
 * Estrategia de validación para el título del libro
 * Implementa el patrón Strategy
 */
@Component
public class TituloValidationStrategy implements ValidationStrategy {
    
    private static final int MIN_LENGTH = 1;
    private static final int MAX_LENGTH = 200;
    
    @Override
    public boolean validate(Book book) {
        if (book.getTitulo() == null || book.getTitulo().trim().isEmpty()) {
            return false;
        }
        return book.getTitulo().length() >= MIN_LENGTH && book.getTitulo().length() <= MAX_LENGTH;
    }
    
    @Override
    public String getErrorMessage() {
        return "El título debe tener entre " + MIN_LENGTH + " y " + MAX_LENGTH + " caracteres";
    }
}

