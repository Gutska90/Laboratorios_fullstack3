package com.laboratorios.resultados.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void testHandleResultadoNotFoundException() {
        // Arrange
        ResultadoNotFoundException ex = ResultadoNotFoundException.withId(999L);

        // Act
        ResponseEntity<Map<String, String>> response = exceptionHandler.handleResultadoNotFoundException(ex);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Resultado no encontrado con ID: 999", response.getBody().get("mensaje"));
        assertEquals("RESULTADO_NO_ENCONTRADO", response.getBody().get("codigo"));
    }

    @Test
    void testHandleIllegalArgumentException() {
        // Arrange
        IllegalArgumentException ex = new IllegalArgumentException("Paciente inválido");

        // Act
        ResponseEntity<Map<String, String>> response = exceptionHandler.handleIllegalArgumentException(ex);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Paciente inválido", response.getBody().get("mensaje"));
        assertEquals("ARGUMENTO_INVALIDO", response.getBody().get("codigo"));
    }

    @Test
    void testHandleValidationExceptions() {
        // Arrange
        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError1 = new FieldError("resultado", "pacienteId", "El ID del paciente es obligatorio");
        FieldError fieldError2 = new FieldError("resultado", "tipoAnalisis", "El tipo de análisis es obligatorio");
        
        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(java.util.Arrays.asList(fieldError1, fieldError2));

        // Act
        ResponseEntity<Map<String, String>> response = exceptionHandler.handleValidationExceptions(ex);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("El ID del paciente es obligatorio", response.getBody().get("pacienteId"));
        assertEquals("El tipo de análisis es obligatorio", response.getBody().get("tipoAnalisis"));
        assertEquals("VALIDACION_FALLIDA", response.getBody().get("codigo"));
    }

    @Test
    void testHandleGenericException() {
        // Arrange
        Exception ex = new RuntimeException("Error inesperado");

        // Act
        ResponseEntity<Map<String, String>> response = exceptionHandler.handleGenericException(ex);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().get("mensaje").contains("Error interno del servidor"));
        assertEquals("ERROR_INTERNO", response.getBody().get("codigo"));
    }
}

