package com.biblioteca.microservicio.strategy;

import com.biblioteca.microservicio.entity.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Contexto que utiliza las estrategias de validación
 * Implementa el patrón Strategy para validar libros
 */
@Component
public class BookValidationContext {
    
    private final List<ValidationStrategy> validationStrategies;
    
    @Autowired
    public BookValidationContext(List<ValidationStrategy> validationStrategies) {
        this.validationStrategies = validationStrategies;
    }
    
    /**
     * Valida un libro usando todas las estrategias disponibles
     * @param book El libro a validar
     * @throws IllegalArgumentException si alguna validación falla
     */
    public void validate(Book book) {
        for (ValidationStrategy strategy : validationStrategies) {
            if (!strategy.validate(book)) {
                throw new IllegalArgumentException(strategy.getErrorMessage());
            }
        }
    }
}

