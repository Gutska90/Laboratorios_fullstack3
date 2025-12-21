package com.laboratorios.usuarios.service;

import com.laboratorios.usuarios.dto.UsuarioRequest;
import com.laboratorios.usuarios.dto.UsuarioResponse;
import com.laboratorios.usuarios.entity.Usuario;
import com.laboratorios.usuarios.exception.UsuarioNotFoundException;
import com.laboratorios.usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordValidatorService passwordValidator;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private UsuarioRequest usuarioRequest;

    @BeforeEach
    void setUp() {
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

        usuarioRequest = new UsuarioRequest();
        usuarioRequest.setEmail("test@example.com");
        usuarioRequest.setPassword("Password123!");
        usuarioRequest.setNombre("Juan");
        usuarioRequest.setApellido("Pérez");
        usuarioRequest.setRol(Usuario.Rol.PACIENTE);
    }

    @Test
    void testObtenerTodosLosUsuarios() {
        // Arrange
        Usuario usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setEmail("test2@example.com");
        usuario2.setNombre("María");
        usuario2.setApellido("González");
        usuario2.setRol(Usuario.Rol.ADMINISTRADOR);
        usuario2.setActivo(true);

        List<Usuario> usuarios = Arrays.asList(usuario, usuario2);
        when(usuarioRepository.findAll()).thenReturn(usuarios);

        // Act
        List<UsuarioResponse> result = usuarioService.obtenerTodosLosUsuarios();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("test@example.com", result.get(0).getEmail());
        assertEquals("test2@example.com", result.get(1).getEmail());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void testObtenerUsuarioPorId_Success() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act
        UsuarioResponse result = usuarioService.obtenerUsuarioPorId(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Juan", result.getNombre());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void testObtenerUsuarioPorId_NotFound() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsuarioNotFoundException.class, () -> {
            usuarioService.obtenerUsuarioPorId(999L);
        });
        verify(usuarioRepository, times(1)).findById(999L);
    }

    @Test
    void testCrearUsuario_Success() {
        // Arrange
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        doNothing().when(passwordValidator).validatePassword(anyString());

        // Act
        UsuarioResponse result = usuarioService.crearUsuario(usuarioRequest);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("test@example.com", result.getEmail());
        verify(usuarioRepository, times(1)).existsByEmail("test@example.com");
        verify(passwordValidator, times(1)).validatePassword("Password123!");
        verify(passwordEncoder, times(1)).encode("Password123!");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testCrearUsuario_EmailExists() {
        // Arrange
        when(usuarioRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.crearUsuario(usuarioRequest);
        });
        assertTrue(exception.getMessage().contains("Ya existe un usuario con el email"));
        verify(usuarioRepository, times(1)).existsByEmail("test@example.com");
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void testActualizarUsuario_Success() {
        // Arrange
        UsuarioRequest updateRequest = new UsuarioRequest();
        updateRequest.setEmail("updated@example.com");
        updateRequest.setPassword("NewPassword123!");
        updateRequest.setNombre("Juan Updated");
        updateRequest.setApellido("Pérez Updated");
        updateRequest.setRol(Usuario.Rol.ADMINISTRADOR);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByEmail("updated@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        doNothing().when(passwordValidator).validatePassword(anyString());

        // Act
        UsuarioResponse result = usuarioService.actualizarUsuario(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, times(1)).existsByEmail("updated@example.com");
        verify(passwordValidator, times(1)).validatePassword("NewPassword123!");
        verify(passwordEncoder, times(1)).encode("NewPassword123!");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testActualizarUsuario_NotFound() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsuarioNotFoundException.class, () -> {
            usuarioService.actualizarUsuario(999L, usuarioRequest);
        });
        verify(usuarioRepository, times(1)).findById(999L);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void testActualizarUsuario_EmailExists() {
        // Arrange
        UsuarioRequest updateRequest = new UsuarioRequest();
        updateRequest.setEmail("existing@example.com");
        updateRequest.setNombre("Juan");
        updateRequest.setApellido("Pérez");
        updateRequest.setRol(Usuario.Rol.PACIENTE);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.actualizarUsuario(1L, updateRequest);
        });
        assertTrue(exception.getMessage().contains("Ya existe un usuario con el email"));
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void testActualizarUsuario_WithoutPassword() {
        // Arrange
        UsuarioRequest updateRequest = new UsuarioRequest();
        updateRequest.setEmail("test@example.com");
        updateRequest.setPassword(null);
        updateRequest.setNombre("Juan Updated");
        updateRequest.setApellido("Pérez");
        updateRequest.setRol(Usuario.Rol.PACIENTE);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        UsuarioResponse result = usuarioService.actualizarUsuario(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, never()).existsByEmail(anyString()); // Email no cambió, no se valida
        verify(passwordValidator, never()).validatePassword(anyString());
        verify(passwordEncoder, never()).encode(anyString());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testActualizarUsuario_WithEmptyPassword() {
        // Arrange
        UsuarioRequest updateRequest = new UsuarioRequest();
        updateRequest.setEmail("test@example.com");
        updateRequest.setPassword(""); // Password vacío
        updateRequest.setNombre("Juan Updated");
        updateRequest.setApellido("Pérez");
        updateRequest.setRol(Usuario.Rol.PACIENTE);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        // Act
        UsuarioResponse result = usuarioService.actualizarUsuario(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository, times(1)).findById(1L);
        verify(passwordValidator, never()).validatePassword(anyString()); // Password vacío, no se valida
        verify(passwordEncoder, never()).encode(anyString());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testActualizarUsuario_SameEmail() {
        // Arrange
        UsuarioRequest updateRequest = new UsuarioRequest();
        updateRequest.setEmail("test@example.com"); // Mismo email
        updateRequest.setPassword("NewPassword123!");
        updateRequest.setNombre("Juan Updated");
        updateRequest.setApellido("Pérez");
        updateRequest.setRol(Usuario.Rol.PACIENTE);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);
        doNothing().when(passwordValidator).validatePassword(anyString());

        // Act
        UsuarioResponse result = usuarioService.actualizarUsuario(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, never()).existsByEmail(anyString()); // Email no cambió, no se valida duplicado
        verify(passwordValidator, times(1)).validatePassword("NewPassword123!");
        verify(passwordEncoder, times(1)).encode("NewPassword123!");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testEliminarUsuario_Success() {
        // Arrange
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        doNothing().when(usuarioRepository).deleteById(1L);

        // Act
        usuarioService.eliminarUsuario(1L);

        // Assert
        verify(usuarioRepository, times(1)).existsById(1L);
        verify(usuarioRepository, times(1)).deleteById(1L);
    }

    @Test
    void testEliminarUsuario_NotFound() {
        // Arrange
        when(usuarioRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        assertThrows(UsuarioNotFoundException.class, () -> {
            usuarioService.eliminarUsuario(999L);
        });
        verify(usuarioRepository, times(1)).existsById(999L);
        verify(usuarioRepository, never()).deleteById(anyLong());
    }
}

