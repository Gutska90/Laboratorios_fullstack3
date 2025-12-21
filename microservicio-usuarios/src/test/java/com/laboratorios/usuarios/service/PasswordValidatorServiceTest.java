package com.laboratorios.usuarios.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordValidatorServiceTest {

    private PasswordValidatorService passwordValidator;

    @BeforeEach
    void setUp() {
        passwordValidator = new PasswordValidatorService();
    }

    @Test
    void testValidatePassword_Success() {
        // Arrange
        String validPassword = "Password123!";

        // Act & Assert
        assertDoesNotThrow(() -> passwordValidator.validatePassword(validPassword));
    }

    @Test
    void testValidatePassword_Null() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword(null);
        });
        assertTrue(exception.getMessage().contains("no puede estar vacía"));
    }

    @Test
    void testValidatePassword_Empty() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword("");
        });
        assertTrue(exception.getMessage().contains("no puede estar vacía"));
    }

    @Test
    void testValidatePassword_TooShort() {
        // Arrange
        String shortPassword = "Pass1!";

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword(shortPassword);
        });
        assertTrue(exception.getMessage().contains("al menos 8 caracteres"));
    }

    @Test
    void testValidatePassword_TooLong() {
        // Arrange
        String longPassword = "A".repeat(51) + "b1!";

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword(longPassword);
        });
        assertTrue(exception.getMessage().contains("más de 50 caracteres"));
    }

    @Test
    void testValidatePassword_NoUppercase() {
        // Arrange
        String password = "password123!";

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword(password);
        });
        assertTrue(exception.getMessage().contains("mayúscula"));
    }

    @Test
    void testValidatePassword_NoLowercase() {
        // Arrange
        String password = "PASSWORD123!";

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword(password);
        });
        assertTrue(exception.getMessage().contains("minúscula"));
    }

    @Test
    void testValidatePassword_NoDigit() {
        // Arrange
        String password = "Password!";

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword(password);
        });
        assertTrue(exception.getMessage().contains("número"));
    }

    @Test
    void testValidatePassword_NoSpecialChar() {
        // Arrange
        String password = "Password123";

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            passwordValidator.validatePassword(password);
        });
        assertTrue(exception.getMessage().contains("carácter especial"));
    }

    @Test
    void testValidatePassword_MinLength() {
        // Arrange
        String password = "Pass123!"; // Exactly 8 characters

        // Act & Assert
        assertDoesNotThrow(() -> passwordValidator.validatePassword(password));
    }

    @Test
    void testValidatePassword_MaxLength() {
        // Arrange
        String password = "A".repeat(46) + "b1!"; // Exactly 50 characters

        // Act & Assert
        assertDoesNotThrow(() -> passwordValidator.validatePassword(password));
    }
}

