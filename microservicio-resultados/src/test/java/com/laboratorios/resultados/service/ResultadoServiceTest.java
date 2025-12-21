package com.laboratorios.resultados.service;

import com.laboratorios.resultados.dto.ResultadoRequest;
import com.laboratorios.resultados.dto.ResultadoResponse;
import com.laboratorios.resultados.entity.ResultadoAnalisis;
import com.laboratorios.resultados.exception.ResultadoNotFoundException;
import com.laboratorios.resultados.repository.ResultadoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResultadoServiceTest {

    @Mock
    private ResultadoRepository resultadoRepository;

    @InjectMocks
    private ResultadoService resultadoService;

    private ResultadoAnalisis resultado;
    private ResultadoRequest resultadoRequest;

    @BeforeEach
    void setUp() {
        resultado = new ResultadoAnalisis();
        resultado.setId(1L);
        resultado.setPacienteId(1L);
        resultado.setLaboratorioId(1L);
        resultado.setTipoAnalisis("Hemograma Completo");
        resultado.setResultado("Valores normales");
        resultado.setObservaciones("Sin observaciones");
        resultado.setFechaAnalisis(LocalDateTime.now());
        resultado.setFechaCreacion(LocalDateTime.now());
        resultado.setFechaActualizacion(LocalDateTime.now());

        resultadoRequest = new ResultadoRequest();
        resultadoRequest.setPacienteId(1L);
        resultadoRequest.setLaboratorioId(1L);
        resultadoRequest.setTipoAnalisis("Hemograma Completo");
        resultadoRequest.setResultado("Valores normales");
        resultadoRequest.setObservaciones("Sin observaciones");
        resultadoRequest.setFechaAnalisis(LocalDateTime.now());
    }

    @Test
    void testObtenerTodosLosResultados_Paginado() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<ResultadoAnalisis> page = new PageImpl<>(Arrays.asList(resultado));
        when(resultadoRepository.findAll(pageable)).thenReturn(page);

        // Act
        Page<ResultadoResponse> result = resultadoService.obtenerTodosLosResultados(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Hemograma Completo", result.getContent().get(0).getTipoAnalisis());
        verify(resultadoRepository, times(1)).findAll(pageable);
    }

    @Test
    void testObtenerTodosLosResultados_SinPaginacion() {
        // Arrange
        List<ResultadoAnalisis> resultados = Arrays.asList(resultado);
        when(resultadoRepository.findAll()).thenReturn(resultados);

        // Act
        List<ResultadoResponse> result = resultadoService.obtenerTodosLosResultados();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(resultadoRepository, times(1)).findAll();
    }

    @Test
    void testObtenerResultadoPorId_Success() {
        // Arrange
        when(resultadoRepository.findById(1L)).thenReturn(Optional.of(resultado));

        // Act
        ResultadoResponse result = resultadoService.obtenerResultadoPorId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Hemograma Completo", result.getTipoAnalisis());
        verify(resultadoRepository, times(1)).findById(1L);
    }

    @Test
    void testObtenerResultadoPorId_NotFound() {
        // Arrange
        when(resultadoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResultadoNotFoundException.class, () -> {
            resultadoService.obtenerResultadoPorId(999L);
        });
        verify(resultadoRepository, times(1)).findById(999L);
    }

    @Test
    void testObtenerResultadosPorPaciente_Paginado() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<ResultadoAnalisis> page = new PageImpl<>(Arrays.asList(resultado));
        when(resultadoRepository.findByPacienteId(1L, pageable)).thenReturn(page);

        // Act
        Page<ResultadoResponse> result = resultadoService.obtenerResultadosPorPaciente(1L, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(1L, result.getContent().get(0).getPacienteId());
        verify(resultadoRepository, times(1)).findByPacienteId(1L, pageable);
    }

    @Test
    void testObtenerResultadosPorPaciente_SinPaginacion() {
        // Arrange
        List<ResultadoAnalisis> resultados = Arrays.asList(resultado);
        when(resultadoRepository.findByPacienteId(1L)).thenReturn(resultados);

        // Act
        List<ResultadoResponse> result = resultadoService.obtenerResultadosPorPaciente(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getPacienteId());
        verify(resultadoRepository, times(1)).findByPacienteId(1L);
    }

    @Test
    void testObtenerResultadosPorLaboratorio_Paginado() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<ResultadoAnalisis> page = new PageImpl<>(Arrays.asList(resultado));
        when(resultadoRepository.findByLaboratorioId(1L, pageable)).thenReturn(page);

        // Act
        Page<ResultadoResponse> result = resultadoService.obtenerResultadosPorLaboratorio(1L, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(1L, result.getContent().get(0).getLaboratorioId());
        verify(resultadoRepository, times(1)).findByLaboratorioId(1L, pageable);
    }

    @Test
    void testObtenerResultadosPorLaboratorio_SinPaginacion() {
        // Arrange
        List<ResultadoAnalisis> resultados = Arrays.asList(resultado);
        when(resultadoRepository.findByLaboratorioId(1L)).thenReturn(resultados);

        // Act
        List<ResultadoResponse> result = resultadoService.obtenerResultadosPorLaboratorio(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getLaboratorioId());
        verify(resultadoRepository, times(1)).findByLaboratorioId(1L);
    }

    @Test
    void testCrearResultado_Success() {
        // Arrange
        when(resultadoRepository.save(any(ResultadoAnalisis.class))).thenReturn(resultado);

        // Act
        ResultadoResponse result = resultadoService.crearResultado(resultadoRequest);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Hemograma Completo", result.getTipoAnalisis());
        verify(resultadoRepository, times(1)).save(any(ResultadoAnalisis.class));
    }

    @Test
    void testCrearResultado_WithoutFechaAnalisis() {
        // Arrange
        resultadoRequest.setFechaAnalisis(null);
        when(resultadoRepository.save(any(ResultadoAnalisis.class))).thenReturn(resultado);

        // Act
        ResultadoResponse result = resultadoService.crearResultado(resultadoRequest);

        // Assert
        assertNotNull(result);
        verify(resultadoRepository, times(1)).save(any(ResultadoAnalisis.class));
    }

    @Test
    void testActualizarResultado_Success() {
        // Arrange
        ResultadoRequest updateRequest = new ResultadoRequest();
        updateRequest.setPacienteId(2L);
        updateRequest.setLaboratorioId(2L);
        updateRequest.setTipoAnalisis("Análisis Actualizado");
        updateRequest.setResultado("Nuevo resultado");
        updateRequest.setObservaciones("Nuevas observaciones");
        updateRequest.setFechaAnalisis(LocalDateTime.now());

        when(resultadoRepository.findById(1L)).thenReturn(Optional.of(resultado));
        when(resultadoRepository.save(any(ResultadoAnalisis.class))).thenReturn(resultado);

        // Act
        ResultadoResponse result = resultadoService.actualizarResultado(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(resultadoRepository, times(1)).findById(1L);
        verify(resultadoRepository, times(1)).save(any(ResultadoAnalisis.class));
    }

    @Test
    void testActualizarResultado_WithoutFechaAnalisis() {
        // Arrange
        ResultadoRequest updateRequest = new ResultadoRequest();
        updateRequest.setPacienteId(2L);
        updateRequest.setLaboratorioId(2L);
        updateRequest.setTipoAnalisis("Análisis Actualizado");
        updateRequest.setResultado("Nuevo resultado");
        updateRequest.setObservaciones("Nuevas observaciones");
        updateRequest.setFechaAnalisis(null); // Sin fecha

        when(resultadoRepository.findById(1L)).thenReturn(Optional.of(resultado));
        when(resultadoRepository.save(any(ResultadoAnalisis.class))).thenReturn(resultado);

        // Act
        ResultadoResponse result = resultadoService.actualizarResultado(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(resultadoRepository, times(1)).findById(1L);
        verify(resultadoRepository, times(1)).save(any(ResultadoAnalisis.class));
    }

    @Test
    void testActualizarResultado_NotFound() {
        // Arrange
        when(resultadoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResultadoNotFoundException.class, () -> {
            resultadoService.actualizarResultado(999L, resultadoRequest);
        });
        verify(resultadoRepository, times(1)).findById(999L);
        verify(resultadoRepository, never()).save(any(ResultadoAnalisis.class));
    }

    @Test
    void testEliminarResultado_Success() {
        // Arrange
        when(resultadoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(resultadoRepository).deleteById(1L);

        // Act
        resultadoService.eliminarResultado(1L);

        // Assert
        verify(resultadoRepository, times(1)).existsById(1L);
        verify(resultadoRepository, times(1)).deleteById(1L);
    }

    @Test
    void testEliminarResultado_NotFound() {
        // Arrange
        when(resultadoRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResultadoNotFoundException.class, () -> {
            resultadoService.eliminarResultado(999L);
        });
        verify(resultadoRepository, times(1)).existsById(999L);
        verify(resultadoRepository, never()).deleteById(anyLong());
    }
}

