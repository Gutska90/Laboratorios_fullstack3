package com.biblioteca.microservicio.repository;

import com.biblioteca.microservicio.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio para realizar operaciones CRUD sobre la entidad Book
 * Implementa el patrón Repository
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    /**
     * Verifica si existe un libro con el mismo título y autor
     * @param titulo El título del libro
     * @param autor El autor del libro
     * @return true si existe, false en caso contrario
     */
    boolean existsByTituloAndAutor(String titulo, String autor);
}

