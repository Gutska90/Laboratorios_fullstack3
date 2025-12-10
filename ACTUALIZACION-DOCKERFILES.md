# ✅ Actualización de Dockerfiles

## 📋 Cambios Realizados

### 1. Microservicios (Usuarios, Laboratorios, Resultados)

#### Mejoras Implementadas:
- ✅ **Multi-stage build**: Reduce el tamaño de la imagen final
- ✅ **Imagen base moderna**: Cambiado de `openjdk:17-jdk-slim` a `eclipse-temurin:17-jre-alpine`
- ✅ **Seguridad**: Usuario no-root para ejecutar la aplicación
- ✅ **Optimización**: Build separado del runtime
- ✅ **Caché de dependencias**: Descarga de dependencias en etapa separada

#### Estructura:
```dockerfile
# Stage 1: Build con Maven
FROM maven:3.9-eclipse-temurin-17 AS build
# Compila el proyecto

# Stage 2: Runtime con JRE mínimo
FROM eclipse-temurin:17-jre-alpine
# Solo incluye lo necesario para ejecutar
```

### 2. Frontend Laboratorios (NUEVO)

#### Creado:
- ✅ **Dockerfile**: Multi-stage build con Node.js 20 y Nginx
- ✅ **nginx.conf**: Configuración con proxies para los 3 microservicios
- ✅ **Servicio en docker-compose.yml**: Agregado `laboratorios-frontend`

#### Características:
- Build con Node.js 20 Alpine
- Servido con Nginx Alpine (imagen pequeña)
- Proxies configurados para:
  - `/api/usuarios` → microservicio-usuarios:8081
  - `/api/laboratorios` → microservicio-laboratorios:8082
  - `/api/resultados` → microservicio-resultados:8083
  - `/api/auth` → microservicio-usuarios:8081
- Soporte para SPA (Single Page Application)
- Compresión Gzip
- Cache de assets estáticos

### 3. Docker Compose

#### Agregado:
- ✅ Servicio `laboratorios-frontend` en puerto 4200
- ✅ Dependencias correctas (usuarios, laboratorios, resultados)
- ✅ Red compartida `lab-network`

### 4. .dockerignore

#### Creado:
- ✅ Archivo `.dockerignore` en la raíz
- ✅ Excluye archivos innecesarios (node_modules, target, logs, etc.)
- ✅ Reduce el tamaño del contexto de build

## 🚀 Cómo Usar

### Build y ejecutar todo:
```bash
docker-compose up --build
```

### Solo los servicios de laboratorios:
```bash
docker-compose up oracle-db microservicio-usuarios microservicio-laboratorios microservicio-resultados laboratorios-frontend
```

### Build individual:
```bash
# Microservicio
cd microservicio-usuarios
docker build -t ms-usuarios:latest .

# Frontend
cd laboratorios-frontend
docker build -t laboratorios-frontend:latest .
```

## 📊 Beneficios

1. **Tamaño reducido**: Imágenes más pequeñas (Alpine Linux)
2. **Seguridad**: Usuario no-root en microservicios
3. **Performance**: Multi-stage build optimiza el proceso
4. **Mantenibilidad**: Código más claro y organizado
5. **Producción-ready**: Configuraciones adecuadas para producción

## ✅ Verificación

### Verificar que todo funciona:
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f laboratorios-frontend

# Verificar que el frontend responde
curl http://localhost:4200

# Verificar APIs
curl http://localhost:8081/api/usuarios
curl http://localhost:8082/api/laboratorios
curl http://localhost:8083/api/resultados
```

## 📝 Notas

- Los microservicios ahora se construyen dentro de Docker (no requieren JAR pre-compilado)
- El frontend se construye con Node.js 20 (más moderno que Node 18)
- Nginx está configurado para manejar el routing de Angular (SPA)
- Los proxies permiten que el frontend acceda a los microservicios sin problemas de CORS

---

**Estado**: ✅ **DOCKERFILES ACTUALIZADOS Y COMPLETOS**

