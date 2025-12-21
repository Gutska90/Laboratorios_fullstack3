package com.laboratorios.resultados.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ResultadoNotFoundExceptionTest {

    @Test
    void testConstructorWithMessage() {
        // Arrange
        String message = "Resultado no encontrado";

        // Act
        ResultadoNotFoundException exception = new ResultadoNotFoundException(message);

        // Assert
        assertNotNull(exception);
        assertEquals(message, exception.getMessage());
    }

    @Test
    void testWithId() {
        // Arrange
        Long id = 789L;

        // Act
        ResultadoNotFoundException exception = ResultadoNotFoundException.withId(id);

        // Assert
        assertNotNull(exception);
        assertTrue(exception.getMessage().contains("Resultado no encontrado con ID: 789"));
    }
}

