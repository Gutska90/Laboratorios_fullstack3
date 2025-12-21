package com.laboratorios.usuarios.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laboratorios.usuarios.dto.LoginRequest;
import com.laboratorios.usuarios.dto.LoginResponse;
import com.laboratorios.usuarios.dto.UsuarioResponse;
import com.laboratorios.usuarios.entity.Usuario;
import com.laboratorios.usuarios.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private LoginRequest loginRequest;
    private LoginResponse loginResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Password123!");

        UsuarioResponse usuarioResponse = new UsuarioResponse(
            1L,
            "test@example.com",
            "Juan",
            "Pérez",
            Usuario.Rol.PACIENTE,
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        loginResponse = new LoginResponse("jwt-token-here", usuarioResponse);
    }

    @Test
    void testLogin_Success() throws Exception {
        // Arrange
        when(authService.login(any(LoginRequest.class))).thenReturn(loginResponse);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").value("jwt-token-here"))
                .andExpect(jsonPath("$.usuario.email").value("test@example.com"));

        verify(authService, times(1)).login(any(LoginRequest.class));
    }
}

