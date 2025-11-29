package com.biblioteca.microservicio.dto;

/**
 * DTO para respuesta de libro con información completa
 */
public class BookResponse {
    
    private Long id;
    private String titulo;
    private String autor;
    private Integer anioPublicacion;
    private String genero;
    
    // Constructor por defecto
    public BookResponse() {
    }
    
    // Constructor con parámetros
    public BookResponse(Long id, String titulo, String autor, Integer anioPublicacion, String genero) {
        this.id = id;
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
}

