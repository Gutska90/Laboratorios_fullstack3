package com.laboratorios.usuarios.service;

import com.laboratorios.usuarios.dto.LoginRequest;
import com.laboratorios.usuarios.dto.LoginResponse;
import com.laboratorios.usuarios.entity.Usuario;
import com.laboratorios.usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        // Configurar valores de JWT usando ReflectionTestUtils
        ReflectionTestUtils.setField(authService, "jwtSecret", 
            "laboratorios-secret-key-para-jwt-token-generacion-segura-2024");
        ReflectionTestUtils.setField(authService, "jwtExpiration", 86400000L);

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("test@example.com");
        usuario.setPassword("encodedPassword");
        usuario.setNombre("Juan");
        usuario.setApellido("Pérez");
        usuario.setRol(Usuario.Rol.PACIENTE);
        usuario.setActivo(true);
        usuario.setFechaCreacion(LocalDateTime.now());
        usuario.setFechaActualizacion(LocalDateTime.now());

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Password123!");
    }

    @Test
    void testLogin_Success() {
        // Arrange
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("Password123!", "encodedPassword")).thenReturn(true);

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertNotNull(response.getUsuario());
        assertEquals("test@example.com", response.getUsuario().getEmail());
        assertEquals("Juan", response.getUsuario().getNombre());
        verify(usuarioRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("Password123!", "encodedPassword");
    }

    @Test
    void testLogin_UserNotFound() {
        // Arrange
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(loginRequest);
        });
        assertTrue(exception.getMessage().contains("Email o contraseña incorrectos"));
        verify(usuarioRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void testLogin_InactiveUser() {
        // Arrange
        usuario.setActivo(false);
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(Optional.of(usuario));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(loginRequest);
        });
        assertTrue(exception.getMessage().contains("Usuario inactivo"));
        verify(usuarioRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void testLogin_WrongPassword() {
        // Arrange
        when(usuarioRepository.findByEmail("test@example.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("Password123!", "encodedPassword")).thenReturn(false);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.login(loginRequest);
        });
        assertTrue(exception.getMessage().contains("Email o contraseña incorrectos"));
        verify(usuarioRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("Password123!", "encodedPassword");
    }
}

