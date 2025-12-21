package com.laboratorios.resultados.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.laboratorios.resultados.dto.ResultadoRequest;
import com.laboratorios.resultados.dto.ResultadoResponse;
import com.laboratorios.resultados.service.ResultadoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
class ResultadoControllerTest {

    @Mock
    private ResultadoService resultadoService;

    @InjectMocks
    private ResultadoController resultadoController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private ResultadoResponse resultadoResponse;
    private ResultadoRequest resultadoRequest;

    @BeforeEach
    void setUp() {
        PageableHandlerMethodArgumentResolver pageableResolver = new PageableHandlerMethodArgumentResolver();
        pageableResolver.setFallbackPageable(org.springframework.data.domain.PageRequest.of(0, 10));
        mockMvc = MockMvcBuilders.standaloneSetup(resultadoController)
                .setCustomArgumentResolvers(pageableResolver)
                .build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        resultadoResponse = new ResultadoResponse(
            1L,
            1L,
            1L,
            "Hemograma Completo",
            "Valores normales",
            "Sin observaciones",
            LocalDateTime.now(),
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        resultadoRequest = new ResultadoRequest();
        resultadoRequest.setPacienteId(1L);
        resultadoRequest.setLaboratorioId(1L);
        resultadoRequest.setTipoAnalisis("Hemograma Completo");
        resultadoRequest.setResultado("Valores normales");
        resultadoRequest.setObservaciones("Sin observaciones");
        resultadoRequest.setFechaAnalisis(LocalDateTime.now());
    }

    @Test
    void testObtenerTodosLosResultados() throws Exception {
        // Arrange
        Page<ResultadoResponse> page = new PageImpl<>(Arrays.asList(resultadoResponse), org.springframework.data.domain.PageRequest.of(0, 10), 1);
        when(resultadoService.obtenerTodosLosResultados(any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/resultados")
                .param("page", "0")
                .param("size", "10")
                .param("sort", "fechaAnalisis"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].tipoAnalisis").value("Hemograma Completo"));

        verify(resultadoService, times(1)).obtenerTodosLosResultados(any(org.springframework.data.domain.Pageable.class));
    }

    @Test
    void testObtenerTodosLosResultadosSinPaginacion() throws Exception {
        // Arrange
        List<ResultadoResponse> resultados = Arrays.asList(resultadoResponse);
        when(resultadoService.obtenerTodosLosResultados()).thenReturn(resultados);

        // Act & Assert
        mockMvc.perform(get("/api/resultados/all"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1L));

        verify(resultadoService, times(1)).obtenerTodosLosResultados();
    }

    @Test
    void testObtenerResultadoPorId() throws Exception {
        // Arrange
        when(resultadoService.obtenerResultadoPorId(1L)).thenReturn(resultadoResponse);

        // Act & Assert
        mockMvc.perform(get("/api/resultados/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.tipoAnalisis").value("Hemograma Completo"));

        verify(resultadoService, times(1)).obtenerResultadoPorId(1L);
    }

    @Test
    void testObtenerResultadosPorPaciente() throws Exception {
        // Arrange
        Page<ResultadoResponse> page = new PageImpl<>(Arrays.asList(resultadoResponse), org.springframework.data.domain.PageRequest.of(0, 10), 1);
        when(resultadoService.obtenerResultadosPorPaciente(eq(1L), any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/resultados/paciente/1")
                .param("page", "0")
                .param("size", "10")
                .param("sort", "fechaAnalisis"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].pacienteId").value(1L));

        verify(resultadoService, times(1)).obtenerResultadosPorPaciente(eq(1L), any(org.springframework.data.domain.Pageable.class));
    }

    @Test
    void testObtenerResultadosPorLaboratorio() throws Exception {
        // Arrange
        Page<ResultadoResponse> page = new PageImpl<>(Arrays.asList(resultadoResponse), org.springframework.data.domain.PageRequest.of(0, 10), 1);
        when(resultadoService.obtenerResultadosPorLaboratorio(eq(1L), any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        // Act & Assert
        mockMvc.perform(get("/api/resultados/laboratorio/1")
                .param("page", "0")
                .param("size", "10")
                .param("sort", "fechaAnalisis"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].laboratorioId").value(1L));

        verify(resultadoService, times(1)).obtenerResultadosPorLaboratorio(eq(1L), any(org.springframework.data.domain.Pageable.class));
    }

    @Test
    void testCrearResultado() throws Exception {
        // Arrange
        when(resultadoService.crearResultado(any(ResultadoRequest.class))).thenReturn(resultadoResponse);

        // Act & Assert
        mockMvc.perform(post("/api/resultados")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resultadoRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.tipoAnalisis").value("Hemograma Completo"));

        verify(resultadoService, times(1)).crearResultado(any(ResultadoRequest.class));
    }

    @Test
    void testActualizarResultado() throws Exception {
        // Arrange
        when(resultadoService.actualizarResultado(eq(1L), any(ResultadoRequest.class))).thenReturn(resultadoResponse);

        // Act & Assert
        mockMvc.perform(put("/api/resultados/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(resultadoRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L));

        verify(resultadoService, times(1)).actualizarResultado(eq(1L), any(ResultadoRequest.class));
    }

    @Test
    void testEliminarResultado() throws Exception {
        // Arrange
        doNothing().when(resultadoService).eliminarResultado(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/resultados/1"))
                .andExpect(status().isNoContent());

        verify(resultadoService, times(1)).eliminarResultado(1L);
    }
}

