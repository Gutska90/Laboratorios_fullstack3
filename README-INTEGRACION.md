# Integración FrontEnd - BackEnd - Sistema de Biblioteca

Este documento describe la integración completa entre el FrontEnd Angular y el BackEnd Spring Boot para el sistema de gestión de libros.

## 📋 Estructura del Proyecto

```
fullstack3/
├── microservicio-libros/          # Microservicio generado desde arquetipo
│   ├── src/main/java/
│   │   └── com/biblioteca/microservicio/
│   │       ├── controller/        # BookController (CRUD completo)
│   │       ├── service/           # BookService
│   │       ├── repository/        # BookRepository
│   │       ├── entity/            # Book
│   │       ├── dto/               # DTOs (Request/Response)
│   │       └── strategy/          # Patrón Strategy para validaciones
│   └── Dockerfile
│
├── biblioteca-frontend/            # Frontend Angular
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── book-list/         # Lista de libros
│   │   │   └── book-form/         # Formulario crear/editar
│   │   ├── services/
│   │   │   └── book.service.ts    # Servicio HTTP
│   │   └── models/
│   │       └── book.model.ts      # Modelo Book
│   └── Dockerfile
│
├── biblioteca-arquetipo/           # Arquetipo Maven usado
└── docker-compose.yml              # Configuración Docker completa
```

## 🚀 CRUD Implementado

### BackEnd (Microservicio Spring Boot)

**Endpoints disponibles:**

- `GET /api/libros` - Obtener todos los libros
- `GET /api/libros/{id}` - Obtener un libro por ID
- `POST /api/libros` - Crear un nuevo libro
- `PUT /api/libros/{id}` - Actualizar un libro existente
- `DELETE /api/libros/{id}` - Eliminar un libro por ID

**Puerto:** 8084

**Base de Datos:** MySQL 8.0

**CORS:** Configurado para permitir comunicación desde el frontend (`@CrossOrigin(origins = "*")`)

### FrontEnd (Angular)

**Componentes:**
- `BookListComponent` - Lista todos los libros con opciones de editar/eliminar
- `BookFormComponent` - Formulario para crear/editar libros con validaciones

**Servicio:**
- `BookService` - Maneja todas las peticiones HTTP al backend

## 🔧 Instalación y Ejecución

### Opción 1: Ejecución Local (Desarrollo)

#### 1. Preparar Base de Datos MySQL

```bash
# Opción A: Con MySQL instalado localmente
mysql -u root -p < database-biblioteca-setup.sql

# Opción B: Con Docker
docker run --name mysql-biblioteca -e MYSQL_ROOT_PASSWORD=root123 -e MYSQL_DATABASE=biblioteca_db -p 3306:3306 -d mysql:8.0
docker exec -i mysql-biblioteca mysql -uroot -proot123 < database-biblioteca-setup.sql
```

#### 2. Compilar Microservicio

```bash
cd microservicio-libros
mvn clean package -DskipTests
mvn spring-boot:run
```

El microservicio estará disponible en: `http://localhost:8084`

#### 3. Ejecutar Frontend

```bash
cd biblioteca-frontend
npm install
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

### Opción 2: Docker Compose (Producción)

```bash
# Compilar el microservicio primero
cd microservicio-libros
mvn clean package -DskipTests
cd ..

# Construir y ejecutar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f microservicio-libros
docker-compose logs -f biblioteca-frontend
docker-compose logs -f mysql-db
```

**Servicios disponibles:**
- Frontend: `http://localhost:4201`
- Microservicio: `http://localhost:8084`
- MySQL DB: `localhost:3306`
  - Usuario: `root`
  - Password: `root123`
  - Base de datos: `biblioteca_db`

## 📝 Uso del Sistema

1. **Ver Libros:** Accede a `http://localhost:4200` (o `http://localhost:4201` en Docker)
2. **Crear Libro:** Click en "Nuevo Libro" y completa el formulario
3. **Editar Libro:** Click en "Editar" en cualquier libro de la lista
4. **Eliminar Libro:** Click en "Eliminar" y confirma la acción

## 🔍 Validaciones

### BackEnd
- Título: 1-200 caracteres, obligatorio
- Autor: 1-100 caracteres, obligatorio
- Año: Entre 1000 y 2025, obligatorio
- Género: 1-50 caracteres, obligatorio

### FrontEnd
- Validaciones en tiempo real
- Mensajes de error descriptivos
- Prevención de envío con datos inválidos

## 🐳 Docker

### Base de Datos MySQL

```yaml
mysql-db:
  image: mysql:8.0
  environment:
    - MYSQL_ROOT_PASSWORD=root123
    - MYSQL_DATABASE=biblioteca_db
  ports:
    - "3306:3306"
```

### Microservicio de Libros

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/microservicio-libros-1.0.0.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Frontend Angular

```dockerfile
# Multi-stage build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/biblioteca-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## 📊 Flujo de Datos

```
Frontend Angular (4200/4201)
    ↓ HTTP Request
BookService (book.service.ts)
    ↓ HTTP Client
Backend Spring Boot (8084)
    ↓ JPA/Hibernate
MySQL Database (3306)
    ↓ SQL
Tabla BOOKS
```

## ✅ Características Implementadas

- ✅ CRUD completo (GET, POST, PUT, DELETE)
- ✅ Validaciones en FrontEnd y BackEnd
- ✅ Manejo de errores
- ✅ Diseño responsive con Bootstrap
- ✅ CORS configurado
- ✅ Docker Compose para despliegue
- ✅ Comunicación FrontEnd-BackEnd funcionando
- ✅ Datos persistidos en MySQL Database
- ✅ Base de datos MySQL 8.0

## 🧪 Pruebas

### Con Postman

1. Importa la colección de Postman
2. Prueba cada endpoint:
   - GET todos los libros
   - GET libro por ID
   - POST crear libro
   - PUT actualizar libro
   - DELETE eliminar libro

### Desde el Frontend

1. Abre el navegador en `http://localhost:4200`
2. Verifica que se carguen los libros
3. Prueba crear, editar y eliminar libros
4. Verifica que los cambios se reflejen en la base de datos

### Conectarse a MySQL

```bash
# Desde terminal
mysql -h localhost -P 3306 -u root -proot123 biblioteca_db

# Desde Docker
docker exec -it mysql-biblioteca-db mysql -uroot -proot123 biblioteca_db

# Verificar datos
SELECT * FROM BOOKS;
```

## 📚 Patrones de Diseño

- **Strategy Pattern:** Validaciones flexibles en el backend
- **DTO Pattern:** Separación de entidades y objetos de transferencia
- **Repository Pattern:** Abstracción del acceso a datos
- **Service Pattern:** Lógica de negocio separada

## 🔗 Enlaces Útiles

- API Base: `http://localhost:8084/api/libros`
- Frontend: `http://localhost:4200` (desarrollo) o `http://localhost:4201` (Docker)
- MySQL: `localhost:3306`

## 🔄 Cambios Realizados

- ✅ Migrado de Oracle a MySQL 8.0
- ✅ Actualizado driver JDBC a MySQL Connector
- ✅ Configurado Hibernate para MySQL
- ✅ Actualizado script SQL para sintaxis MySQL
- ✅ Configurado Docker Compose con MySQL
- ✅ Actualizado variables de entorno

---

**Desarrollado como parte de la Actividad Formativa 4 - Integración FrontEnd-BackEnd con MySQL**
