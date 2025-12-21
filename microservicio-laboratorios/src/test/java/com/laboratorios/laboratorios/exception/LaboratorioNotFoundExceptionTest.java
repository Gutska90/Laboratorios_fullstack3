package com.laboratorios.laboratorios.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LaboratorioNotFoundExceptionTest {

    @Test
    void testConstructorWithMessage() {
        // Arrange
        String message = "Laboratorio no encontrado";

        // Act
        LaboratorioNotFoundException exception = new LaboratorioNotFoundException(message);

        // Assert
        assertNotNull(exception);
        assertEquals(message, exception.getMessage());
    }

    @Test
    void testWithId() {
        // Arrange
        Long id = 456L;

        // Act
        LaboratorioNotFoundException exception = LaboratorioNotFoundException.withId(id);

        // Assert
        assertNotNull(exception);
        assertTrue(exception.getMessage().contains("Laboratorio no encontrado con ID: 456"));
    }
}

