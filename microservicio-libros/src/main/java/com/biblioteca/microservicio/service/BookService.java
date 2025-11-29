package com.biblioteca.microservicio.service;

import com.biblioteca.microservicio.dto.BookResponse;
import com.biblioteca.microservicio.dto.CreateBookRequest;
import com.biblioteca.microservicio.dto.UpdateBookRequest;
import com.biblioteca.microservicio.entity.Book;
import com.biblioteca.microservicio.exception.BookNotFoundException;
import com.biblioteca.microservicio.mapper.BookMapper;
import com.biblioteca.microservicio.repository.BookRepository;
import com.biblioteca.microservicio.strategy.BookValidationContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio que contiene la lógica de negocio para gestionar libros
 * Utiliza el patrón Strategy para validaciones
 */
@Service
@Transactional
public class BookService {
    
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final BookValidationContext validationContext;
    
    @Autowired
    public BookService(BookRepository bookRepository, BookMapper bookMapper, 
                      BookValidationContext validationContext) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper;
        this.validationContext = validationContext;
    }
    
    /**
     * Obtener todos los libros
     */
    @Transactional(readOnly = true)
    public List<BookResponse> obtenerTodosLosLibros() {
        return bookRepository.findAll()
                .stream()
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener un libro por su ID
     */
    @Transactional(readOnly = true)
    public BookResponse obtenerLibroPorId(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> BookNotFoundException.withId(id));
        return bookMapper.toResponse(book);
    }
    
    /**
     * Crear un nuevo libro
     */
    public BookResponse crearLibro(CreateBookRequest request) {
        // Verificar si ya existe un libro con el mismo título y autor
        if (bookRepository.existsByTituloAndAutor(request.getTitulo(), request.getAutor())) {
            throw new IllegalArgumentException("Ya existe un libro con el mismo título y autor");
        }
        
        Book book = bookMapper.toEntity(request);
        
        // Validar usando el patrón Strategy
        validationContext.validate(book);
        
        Book savedBook = bookRepository.save(book);
        return bookMapper.toResponse(savedBook);
    }
    
    /**
     * Actualizar un libro existente
     */
    public BookResponse actualizarLibro(Long id, UpdateBookRequest request) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> BookNotFoundException.withId(id));
        
        // Verificar si el nuevo título y autor ya existen en otro libro
        if (!existingBook.getTitulo().equals(request.getTitulo()) || 
            !existingBook.getAutor().equals(request.getAutor())) {
            if (bookRepository.existsByTituloAndAutor(request.getTitulo(), request.getAutor())) {
                throw new IllegalArgumentException("Ya existe otro libro con el mismo título y autor");
            }
        }
        
        Book updatedBook = bookMapper.toEntity(request, existingBook);
        
        // Validar usando el patrón Strategy
        validationContext.validate(updatedBook);
        
        Book savedBook = bookRepository.save(updatedBook);
        return bookMapper.toResponse(savedBook);
    }
    
    /**
     * Eliminar un libro por su ID
     */
    public void eliminarLibro(Long id) {
        if (!bookRepository.existsById(id)) {
            throw BookNotFoundException.withId(id);
        }
        bookRepository.deleteById(id);
    }
}

