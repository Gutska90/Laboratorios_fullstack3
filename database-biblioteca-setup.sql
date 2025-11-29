-- Script SQL para crear la base de datos y tabla BOOKS en MySQL
-- Base de datos: MySQL

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS biblioteca_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE biblioteca_db;

-- Crear tabla BOOKS
CREATE TABLE IF NOT EXISTS BOOKS (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITULO VARCHAR(200) NOT NULL,
    AUTOR VARCHAR(100) NOT NULL,
    ANIO_PUBLICACION INT NOT NULL,
    GENERO VARCHAR(50) NOT NULL,
    INDEX idx_autor (AUTOR),
    INDEX idx_genero (GENERO),
    INDEX idx_anio (ANIO_PUBLICACION)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo
INSERT INTO BOOKS (TITULO, AUTOR, ANIO_PUBLICACION, GENERO) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 1967, 'Realismo mágico'),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 1605, 'Novela'),
('El Principito', 'Antoine de Saint-Exupéry', 1943, 'Fábula'),
('1984', 'George Orwell', 1949, 'Ciencia ficción'),
('Orgullo y prejuicio', 'Jane Austen', 1813, 'Romance');

-- Verificar datos insertados
SELECT * FROM BOOKS;
