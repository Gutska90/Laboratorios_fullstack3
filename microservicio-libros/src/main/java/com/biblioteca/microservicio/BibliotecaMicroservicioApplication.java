package com.biblioteca.microservicio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación Spring Boot
 * Microservicio para gestionar libros en una biblioteca
 * 
 * Incluye:
 * - CRUD completo de libros
 * - Patrón Strategy para validaciones
 * - Patrón DTO para transferencia de datos
 * - Patrón Mapper para conversión de objetos
 * - Patrón Repository para acceso a datos
 */
@SpringBootApplication
public class BibliotecaMicroservicioApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(BibliotecaMicroservicioApplication.class, args);
        System.out.println("==============================================");
        System.out.println("🚀 Microservicio Biblioteca iniciado correctamente");
        System.out.println("📡 Puerto: 8084");
        System.out.println("🌐 API Base URL: http://localhost:8084/api/libros");
        System.out.println("📊 Endpoints disponibles:");
        System.out.println("   - GET /api/libros (obtener todos)");
        System.out.println("   - GET /api/libros/{id} (obtener por ID)");
        System.out.println("   - POST /api/libros (crear nuevo)");
        System.out.println("   - PUT /api/libros/{id} (actualizar)");
        System.out.println("   - DELETE /api/libros/{id} (eliminar)");
        System.out.println("==============================================");
    }
}


