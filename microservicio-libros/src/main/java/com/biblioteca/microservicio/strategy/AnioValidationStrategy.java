package com.biblioteca.microservicio.strategy;

import com.biblioteca.microservicio.entity.Book;
import org.springframework.stereotype.Component;

/**
 * Estrategia de validación para el año de publicación
 * Implementa el patrón Strategy
 */
@Component
public class AnioValidationStrategy implements ValidationStrategy {
    
    private static final int MIN_YEAR = 1000;
    private static final int MAX_YEAR = 2025;
    
    @Override
    public boolean validate(Book book) {
        if (book.getAnioPublicacion() == null) {
            return false;
        }
        int anio = book.getAnioPublicacion();
        return anio >= MIN_YEAR && anio <= MAX_YEAR;
    }
    
    @Override
    public String getErrorMessage() {
        return "El año de publicación debe estar entre " + MIN_YEAR + " y " + MAX_YEAR;
    }
}

