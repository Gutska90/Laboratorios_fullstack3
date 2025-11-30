package com.biblioteca.microservicio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

/**
 * Entidad Book que representa un libro en la biblioteca
 */
@Entity
@Table(name = "books")
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    
    @NotBlank(message = "El título es obligatorio")
    @Size(min = 1, max = 200, message = "El título debe tener entre 1 y 200 caracteres")
    @Column(name = "TITULO", nullable = false, length = 200)
    private String titulo;
    
    @NotBlank(message = "El autor es obligatorio")
    @Size(min = 1, max = 100, message = "El autor debe tener entre 1 y 100 caracteres")
    @Column(name = "AUTOR", nullable = false, length = 100)
    private String autor;
    
    @NotNull(message = "El año de publicación es obligatorio")
    @Min(value = 1000, message = "El año debe ser mayor a 1000")
    @Max(value = 2025, message = "El año debe ser menor o igual a 2025")
    @Column(name = "ANIO_PUBLICACION", nullable = false)
    private Integer anioPublicacion;
    
    @NotBlank(message = "El género es obligatorio")
    @Size(min = 1, max = 50, message = "El género debe tener entre 1 y 50 caracteres")
    @Column(name = "GENERO", nullable = false, length = 50)
    private String genero;
    
    // Constructor por defecto
    public Book() {
    }
    
    // Constructor con parámetros
    public Book(String titulo, String autor, Integer anioPublicacion, String genero) {
        this.titulo = titulo;
        this.autor = autor;
        this.anioPublicacion = anioPublicacion;
        this.genero = genero;
    }
    
    // Getters y Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitulo() {
        return titulo;
    }
    
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }
    
    public String getAutor() {
        return autor;
    }
    
    public void setAutor(String autor) {
        this.autor = autor;
    }
    
    public Integer getAnioPublicacion() {
        return anioPublicacion;
    }
    
    public void setAnioPublicacion(Integer anioPublicacion) {
        this.anioPublicacion = anioPublicacion;
    }
    
    public String getGenero() {
        return genero;
    }
    
    public void setGenero(String genero) {
        this.genero = genero;
    }
    
    @Override
    public String toString() {
        return "Book{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", autor='" + autor + '\'' +
                ", anioPublicacion=" + anioPublicacion +
                ", genero='" + genero + '\'' +
                '}';
    }
}


