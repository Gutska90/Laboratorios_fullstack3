package com.laboratorios.laboratorios.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laboratorios.laboratorios.dto.LaboratorioRequest;
import com.laboratorios.laboratorios.dto.LaboratorioResponse;
import com.laboratorios.laboratorios.service.LaboratorioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
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
class LaboratorioControllerTest {

    @Mock
    private LaboratorioService laboratorioService;

    @InjectMocks
    private LaboratorioController laboratorioController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private LaboratorioResponse laboratorioResponse;
    private LaboratorioRequest laboratorioRequest;

    @BeforeEach
    void setUp() {
        PageableHandlerMethodArgumentResolver pageableResolver = new PageableHandlerMethodArgumentResolver();
        pageableResolver.setFallbackPageable(org.springframework.data.domain.PageRequest.of(0, 10));
        mockMvc = MockMvcBuilders.standaloneSetup(laboratorioController)
                .setCustomArgumentResolvers(pageableResolver)
                .build();
        objectMapper = new ObjectMapper();

        laboratorioResponse = new LaboratorioResponse(
            1L,
            "Laboratorio Clínico Central",
            "Av. Principal 123",
            "+56 9 1234 5678",
            "Clínico",
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        laboratorioRequest = new LaboratorioRequest();
        laboratorioRequest.setNombre("Laboratorio Clínico Central");
        laboratorioRequest.setDireccion("Av. Principal 123");
        laboratorioRequest.setTelefono("+56 9 1234 5678");
        laboratorioRequest.setTipo("Clínico");
    }

    @Test
    void testObtenerTodosLosLaboratorios() throws Exception {
        // Arrange
        Page<LaboratorioResponse> page = new PageImpl<>(Arrays.asList(laboratorioResponse), PageRequest.of(0, 10), 1);
        when(laboratorioService.obtenerTodosLosLaboratorios(any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/laboratorios")
                .param("page", "0")
                .param("size", "10")
                .param("sort", "nombre"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].nombre").value("Laboratorio Clínico Central"));

        verify(laboratorioService, times(1)).obtenerTodosLosLaboratorios(any(org.springframework.data.domain.Pageable.class));
    }

    @Test
    void testObtenerTodosLosLaboratoriosSinPaginacion() throws Exception {
        // Arrange
        List<LaboratorioResponse> laboratorios = Arrays.asList(laboratorioResponse);
        when(laboratorioService.obtenerTodosLosLaboratorios()).thenReturn(laboratorios);

        // Act & Assert
        mockMvc.perform(get("/api/laboratorios/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1L));

        verify(laboratorioService, times(1)).obtenerTodosLosLaboratorios();
    }

    @Test
    void testObtenerLaboratoriosActivos() throws Exception {
        // Arrange
        Page<LaboratorioResponse> page = new PageImpl<>(Arrays.asList(laboratorioResponse), PageRequest.of(0, 10), 1);
        when(laboratorioService.obtenerLaboratoriosActivos(any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/laboratorios/activos")
                .param("page", "0")
                .param("size", "10")
                .param("sort", "nombre"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].activo").value(true));

        verify(laboratorioService, times(1)).obtenerLaboratoriosActivos(any(org.springframework.data.domain.Pageable.class));
    }

    @Test
    void testObtenerLaboratorioPorId() throws Exception {
        // Arrange
        when(laboratorioService.obtenerLaboratorioPorId(1L)).thenReturn(laboratorioResponse);

        // Act & Assert
        mockMvc.perform(get("/api/laboratorios/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Laboratorio Clínico Central"));

        verify(laboratorioService, times(1)).obtenerLaboratorioPorId(1L);
    }

    @Test
    void testCrearLaboratorio() throws Exception {
        // Arrange
        when(laboratorioService.crearLaboratorio(any(LaboratorioRequest.class))).thenReturn(laboratorioResponse);

        // Act & Assert
        mockMvc.perform(post("/api/laboratorios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(laboratorioRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Laboratorio Clínico Central"));

        verify(laboratorioService, times(1)).crearLaboratorio(any(LaboratorioRequest.class));
    }

    @Test
    void testActualizarLaboratorio() throws Exception {
        // Arrange
        when(laboratorioService.actualizarLaboratorio(eq(1L), any(LaboratorioRequest.class))).thenReturn(laboratorioResponse);

        // Act & Assert
        mockMvc.perform(put("/api/laboratorios/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(laboratorioRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L));

        verify(laboratorioService, times(1)).actualizarLaboratorio(eq(1L), any(LaboratorioRequest.class));
    }

    @Test
    void testEliminarLaboratorio() throws Exception {
        // Arrange
        doNothing().when(laboratorioService).eliminarLaboratorio(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/laboratorios/1"))
                .andExpect(status().isNoContent());

        verify(laboratorioService, times(1)).eliminarLaboratorio(1L);
    }
}

