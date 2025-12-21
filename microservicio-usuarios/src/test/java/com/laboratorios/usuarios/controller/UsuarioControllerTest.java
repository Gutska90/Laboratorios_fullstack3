package com.laboratorios.usuarios.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laboratorios.usuarios.dto.UsuarioRequest;
import com.laboratorios.usuarios.dto.UsuarioResponse;
import com.laboratorios.usuarios.entity.Usuario;
import com.laboratorios.usuarios.service.UsuarioService;
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
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private UsuarioResponse usuarioResponse;
    private UsuarioRequest usuarioRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(usuarioController).build();
        objectMapper = new ObjectMapper();

        usuarioResponse = new UsuarioResponse(
            1L,
            "test@example.com",
            "Juan",
            "Pérez",
            Usuario.Rol.PACIENTE,
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        usuarioRequest = new UsuarioRequest();
        usuarioRequest.setEmail("test@example.com");
        usuarioRequest.setPassword("Password123!");
        usuarioRequest.setNombre("Juan");
        usuarioRequest.setApellido("Pérez");
        usuarioRequest.setRol(Usuario.Rol.PACIENTE);
    }

    @Test
    void testObtenerTodosLosUsuarios() throws Exception {
        // Arrange
        UsuarioResponse usuario2 = new UsuarioResponse(
            2L,
            "test2@example.com",
            "María",
            "González",
            Usuario.Rol.ADMINISTRADOR,
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
        );
        List<UsuarioResponse> usuarios = Arrays.asList(usuarioResponse, usuario2);
        when(usuarioService.obtenerTodosLosUsuarios()).thenReturn(usuarios);

        // Act & Assert
        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].email").value("test@example.com"))
                .andExpect(jsonPath("$[1].id").value(2L));

        verify(usuarioService, times(1)).obtenerTodosLosUsuarios();
    }

    @Test
    void testObtenerUsuarioPorId() throws Exception {
        // Arrange
        when(usuarioService.obtenerUsuarioPorId(1L)).thenReturn(usuarioResponse);

        // Act & Assert
        mockMvc.perform(get("/api/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.nombre").value("Juan"));

        verify(usuarioService, times(1)).obtenerUsuarioPorId(1L);
    }

    @Test
    void testCrearUsuario() throws Exception {
        // Arrange
        when(usuarioService.crearUsuario(any(UsuarioRequest.class))).thenReturn(usuarioResponse);

        // Act & Assert
        mockMvc.perform(post("/api/usuarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(usuarioService, times(1)).crearUsuario(any(UsuarioRequest.class));
    }

    @Test
    void testActualizarUsuario() throws Exception {
        // Arrange
        when(usuarioService.actualizarUsuario(eq(1L), any(UsuarioRequest.class))).thenReturn(usuarioResponse);

        // Act & Assert
        mockMvc.perform(put("/api/usuarios/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(usuarioRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L));

        verify(usuarioService, times(1)).actualizarUsuario(eq(1L), any(UsuarioRequest.class));
    }

    @Test
    void testEliminarUsuario() throws Exception {
        // Arrange
        doNothing().when(usuarioService).eliminarUsuario(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/usuarios/1"))
                .andExpect(status().isNoContent());

        verify(usuarioService, times(1)).eliminarUsuario(1L);
    }
}

