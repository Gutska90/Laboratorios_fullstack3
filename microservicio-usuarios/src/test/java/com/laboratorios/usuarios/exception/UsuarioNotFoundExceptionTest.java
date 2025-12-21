package com.laboratorios.usuarios.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UsuarioNotFoundExceptionTest {

    @Test
    void testConstructorWithMessage() {
        // Arrange
        String message = "Usuario no encontrado";

        // Act
        UsuarioNotFoundException exception = new UsuarioNotFoundException(message);

        // Assert
        assertNotNull(exception);
        assertEquals(message, exception.getMessage());
    }

    @Test
    void testWithId() {
        // Arrange
        Long id = 123L;

        // Act
        UsuarioNotFoundException exception = UsuarioNotFoundException.withId(id);

        // Assert
        assertNotNull(exception);
        assertTrue(exception.getMessage().contains("Usuario no encontrado con ID: 123"));
    }
}

