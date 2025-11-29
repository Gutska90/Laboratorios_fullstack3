package com.biblioteca.microservicio.mapper;

import com.biblioteca.microservicio.dto.BookResponse;
import com.biblioteca.microservicio.dto.CreateBookRequest;
import com.biblioteca.microservicio.dto.UpdateBookRequest;
import com.biblioteca.microservicio.entity.Book;
import org.springframework.stereotype.Component;

/**
 * Mapper para convertir entre entidades Book y DTOs
 * Implementa el patrón Mapper
 */
@Component
public class BookMapper {
    
    /**
     * Convierte CreateBookRequest a entidad Book
     */
    public Book toEntity(CreateBookRequest request) {
        Book book = new Book();
        book.setTitulo(request.getTitulo());
        book.setAutor(request.getAutor());
        book.setAnioPublicacion(request.getAnioPublicacion());
        book.setGenero(request.getGenero());
        return book;
    }
    
    /**
     * Convierte UpdateBookRequest a entidad Book (manteniendo ID)
     */
    public Book toEntity(UpdateBookRequest request, Book existingBook) {
        Book book = new Book();
        book.setId(existingBook.getId());
        book.setTitulo(request.getTitulo());
        book.setAutor(request.getAutor());
        book.setAnioPublicacion(request.getAnioPublicacion());
        book.setGenero(request.getGenero());
        return book;
    }
    
    /**
     * Convierte entidad Book a BookResponse
     */
    public BookResponse toResponse(Book book) {
        BookResponse response = new BookResponse();
        response.setId(book.getId());
        response.setTitulo(book.getTitulo());
        response.setAutor(book.getAutor());
        response.setAnioPublicacion(book.getAnioPublicacion());
        response.setGenero(book.getGenero());
        return response;
    }
}

