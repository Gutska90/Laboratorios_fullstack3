package com.biblioteca.microservicio.strategy;

import com.biblioteca.microservicio.entity.Book;

/**
 * Interfaz Strategy para validaciones de libros
 * Patrón de diseño Strategy implementado para diferentes tipos de validación
 */
public interface ValidationStrategy {
    
    /**
     * Valida un libro según la estrategia específica
     * @param book El libro a validar
     * @return true si la validación pasa, false en caso contrario
     * @throws IllegalArgumentException si la validación falla
     */
    boolean validate(Book book);
    
    /**
     * Obtiene el mensaje de error si la validación falla
     * @return Mensaje de error descriptivo
     */
    String getErrorMessage();
}

