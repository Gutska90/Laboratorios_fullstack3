package com.biblioteca.microservicio.controller;

import com.biblioteca.microservicio.dto.BookResponse;
import com.biblioteca.microservicio.dto.CreateBookRequest;
import com.biblioteca.microservicio.dto.UpdateBookRequest;
import com.biblioteca.microservicio.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para manejar las solicitudes HTTP relacionadas con los libros
 * Implementa el CRUD completo:
 * - GET: Obtener todos los libros
 * - GET: Obtener un libro por ID
 * - POST: Crear un nuevo libro
 * - PUT: Actualizar un libro existente
 * - DELETE: Eliminar un libro por ID
 */
@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "*")
public class BookController {
    
    private final BookService bookService;
    
    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }
    
    /**
     * GET: Obtener todos los libros
     * Endpoint: GET /api/libros
     */
    @GetMapping
    public ResponseEntity<List<BookResponse>> obtenerTodosLosLibros() {
        List<BookResponse> libros = bookService.obtenerTodosLosLibros();
        return ResponseEntity.ok(libros);
    }
    
    /**
     * GET: Obtener un libro por su ID
     * Endpoint: GET /api/libros/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> obtenerLibroPorId(@PathVariable Long id) {
        BookResponse libro = bookService.obtenerLibroPorId(id);
        return ResponseEntity.ok(libro);
    }
    
    /**
     * POST: Crear un nuevo libro
     * Endpoint: POST /api/libros
     */
    @PostMapping
    public ResponseEntity<BookResponse> crearLibro(@Valid @RequestBody CreateBookRequest request) {
        BookResponse nuevoLibro = bookService.crearLibro(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoLibro);
    }
    
    /**
     * PUT: Actualizar un libro existente
     * Endpoint: PUT /api/libros/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<BookResponse> actualizarLibro(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateBookRequest request) {
        BookResponse libroActualizado = bookService.actualizarLibro(id, request);
        return ResponseEntity.ok(libroActualizado);
    }
    
    /**
     * DELETE: Eliminar un libro por su ID
     * Endpoint: DELETE /api/libros/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        bookService.eliminarLibro(id);
        return ResponseEntity.noContent().build();
    }
}

