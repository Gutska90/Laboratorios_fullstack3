package com.laboratorios.laboratorios.service;

import com.laboratorios.laboratorios.dto.LaboratorioRequest;
import com.laboratorios.laboratorios.dto.LaboratorioResponse;
import com.laboratorios.laboratorios.entity.Laboratorio;
import com.laboratorios.laboratorios.exception.LaboratorioNotFoundException;
import com.laboratorios.laboratorios.repository.LaboratorioRepository;
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
class LaboratorioServiceTest {

    @Mock
    private LaboratorioRepository laboratorioRepository;

    @InjectMocks
    private LaboratorioService laboratorioService;

    private Laboratorio laboratorio;
    private LaboratorioRequest laboratorioRequest;

    @BeforeEach
    void setUp() {
        laboratorio = new Laboratorio();
        laboratorio.setId(1L);
        laboratorio.setNombre("Laboratorio Clínico Central");
        laboratorio.setDireccion("Av. Principal 123");
        laboratorio.setTelefono("+56 9 1234 5678");
        laboratorio.setTipo("Clínico");
        laboratorio.setActivo(true);
        laboratorio.setFechaCreacion(LocalDateTime.now());
        laboratorio.setFechaActualizacion(LocalDateTime.now());

        laboratorioRequest = new LaboratorioRequest();
        laboratorioRequest.setNombre("Laboratorio Clínico Central");
        laboratorioRequest.setDireccion("Av. Principal 123");
        laboratorioRequest.setTelefono("+56 9 1234 5678");
        laboratorioRequest.setTipo("Clínico");
    }

    @Test
    void testObtenerTodosLosLaboratorios_Paginado() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Laboratorio> page = new PageImpl<>(Arrays.asList(laboratorio));
        when(laboratorioRepository.findAll(pageable)).thenReturn(page);

        // Act
        Page<LaboratorioResponse> result = laboratorioService.obtenerTodosLosLaboratorios(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Laboratorio Clínico Central", result.getContent().get(0).getNombre());
        verify(laboratorioRepository, times(1)).findAll(pageable);
    }

    @Test
    void testObtenerTodosLosLaboratorios_SinPaginacion() {
        // Arrange
        List<Laboratorio> laboratorios = Arrays.asList(laboratorio);
        when(laboratorioRepository.findAll()).thenReturn(laboratorios);

        // Act
        List<LaboratorioResponse> result = laboratorioService.obtenerTodosLosLaboratorios();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Laboratorio Clínico Central", result.get(0).getNombre());
        verify(laboratorioRepository, times(1)).findAll();
    }

    @Test
    void testObtenerLaboratoriosActivos_Paginado() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<Laboratorio> page = new PageImpl<>(Arrays.asList(laboratorio));
        when(laboratorioRepository.findByActivoTrue(pageable)).thenReturn(page);

        // Act
        Page<LaboratorioResponse> result = laboratorioService.obtenerLaboratoriosActivos(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertTrue(result.getContent().get(0).getActivo());
        verify(laboratorioRepository, times(1)).findByActivoTrue(pageable);
    }

    @Test
    void testObtenerLaboratoriosActivos_SinPaginacion() {
        // Arrange
        List<Laboratorio> laboratorios = Arrays.asList(laboratorio);
        when(laboratorioRepository.findByActivoTrue()).thenReturn(laboratorios);

        // Act
        List<LaboratorioResponse> result = laboratorioService.obtenerLaboratoriosActivos();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getActivo());
        verify(laboratorioRepository, times(1)).findByActivoTrue();
    }

    @Test
    void testObtenerTodosLosLaboratorios_EmptyList() {
        // Arrange
        when(laboratorioRepository.findAll()).thenReturn(java.util.Collections.emptyList());

        // Act
        List<LaboratorioResponse> result = laboratorioService.obtenerTodosLosLaboratorios();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(laboratorioRepository, times(1)).findAll();
    }

    @Test
    void testObtenerLaboratoriosActivos_EmptyList() {
        // Arrange
        when(laboratorioRepository.findByActivoTrue()).thenReturn(java.util.Collections.emptyList());

        // Act
        List<LaboratorioResponse> result = laboratorioService.obtenerLaboratoriosActivos();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(laboratorioRepository, times(1)).findByActivoTrue();
    }

    @Test
    void testObtenerLaboratorioPorId_Success() {
        // Arrange
        when(laboratorioRepository.findById(1L)).thenReturn(Optional.of(laboratorio));

        // Act
        LaboratorioResponse result = laboratorioService.obtenerLaboratorioPorId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Laboratorio Clínico Central", result.getNombre());
        verify(laboratorioRepository, times(1)).findById(1L);
    }

    @Test
    void testObtenerLaboratorioPorId_NotFound() {
        // Arrange
        when(laboratorioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(LaboratorioNotFoundException.class, () -> {
            laboratorioService.obtenerLaboratorioPorId(999L);
        });
        verify(laboratorioRepository, times(1)).findById(999L);
    }

    @Test
    void testCrearLaboratorio_Success() {
        // Arrange
        when(laboratorioRepository.save(any(Laboratorio.class))).thenReturn(laboratorio);

        // Act
        LaboratorioResponse result = laboratorioService.crearLaboratorio(laboratorioRequest);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Laboratorio Clínico Central", result.getNombre());
        assertTrue(result.getActivo());
        verify(laboratorioRepository, times(1)).save(any(Laboratorio.class));
    }

    @Test
    void testActualizarLaboratorio_Success() {
        // Arrange
        LaboratorioRequest updateRequest = new LaboratorioRequest();
        updateRequest.setNombre("Laboratorio Actualizado");
        updateRequest.setDireccion("Nueva Dirección 456");
        updateRequest.setTelefono("+56 9 9876 5432");
        updateRequest.setTipo("Especializado");

        when(laboratorioRepository.findById(1L)).thenReturn(Optional.of(laboratorio));
        when(laboratorioRepository.save(any(Laboratorio.class))).thenReturn(laboratorio);

        // Act
        LaboratorioResponse result = laboratorioService.actualizarLaboratorio(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(laboratorioRepository, times(1)).findById(1L);
        verify(laboratorioRepository, times(1)).save(any(Laboratorio.class));
    }

    @Test
    void testActualizarLaboratorio_NotFound() {
        // Arrange
        when(laboratorioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(LaboratorioNotFoundException.class, () -> {
            laboratorioService.actualizarLaboratorio(999L, laboratorioRequest);
        });
        verify(laboratorioRepository, times(1)).findById(999L);
        verify(laboratorioRepository, never()).save(any(Laboratorio.class));
    }

    @Test
    void testEliminarLaboratorio_Success() {
        // Arrange
        when(laboratorioRepository.existsById(1L)).thenReturn(true);
        doNothing().when(laboratorioRepository).deleteById(1L);

        // Act
        laboratorioService.eliminarLaboratorio(1L);

        // Assert
        verify(laboratorioRepository, times(1)).existsById(1L);
        verify(laboratorioRepository, times(1)).deleteById(1L);
    }

    @Test
    void testEliminarLaboratorio_NotFound() {
        // Arrange
        when(laboratorioRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(LaboratorioNotFoundException.class, () -> {
            laboratorioService.eliminarLaboratorio(999L);
        });
        verify(laboratorioRepository, times(1)).existsById(999L);
        verify(laboratorioRepository, never()).deleteById(anyLong());
    }
}

