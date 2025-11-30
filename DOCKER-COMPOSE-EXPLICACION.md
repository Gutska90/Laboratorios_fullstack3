# 🐳 Docker Compose - Explicación y Verificación

## ¿Para qué sirve Docker Compose?

**Docker Compose** es una herramienta que permite definir y ejecutar aplicaciones Docker con múltiples contenedores de forma sencilla. En lugar de ejecutar cada contenedor manualmente, puedes definir todos los servicios en un archivo YAML y levantarlos con un solo comando.

### Ventajas:

1. **Orquestación**: Levanta múltiples servicios (BD, backend, frontend) con un comando
2. **Configuración centralizada**: Todo en un solo archivo (`docker-compose.yml`)
3. **Dependencias**: Define qué servicios dependen de otros
4. **Redes**: Crea una red interna para que los servicios se comuniquen
5. **Volúmenes**: Gestiona el almacenamiento persistente
6. **Variables de entorno**: Configura fácilmente cada servicio

## 📋 Servicios en este Proyecto

### 1. **mysql-db** (Base de Datos)
- **Imagen**: `mysql:8.0`
- **Puerto**: `3306`
- **Función**: Almacena los datos de los libros
- **Estado**: ✅ Funcionando

### 2. **microservicio-libros** (Backend)
- **Imagen**: Construida desde `Dockerfile`
- **Puerto**: `8084`
- **Función**: API REST para gestionar libros
- **Depende de**: `mysql-db`
- **Estado**: ✅ Funcionando

### 3. **biblioteca-frontend** (Frontend)
- **Imagen**: Construida desde `Dockerfile` (multi-stage)
- **Puerto**: `4201` (mapeado desde 80 interno)
- **Función**: Interfaz web Angular
- **Depende de**: `microservicio-libros`
- **Estado**: ⚠️ Requiere compilación

## 🔍 Cómo Verificar que Está Funcionando

### 1. Ver Estado de los Contenedores

```bash
docker-compose ps
```

**Salida esperada:**
```
NAME                  STATUS                        PORTS
mysql-biblioteca-db   Up X minutes (healthy)        0.0.0.0:3306->3306/tcp
ms-libros             Up X minutes                  0.0.0.0:8084->8084/tcp
```

### 2. Ver Logs de los Servicios

```bash
# Ver logs de MySQL
docker-compose logs mysql-db

# Ver logs del microservicio
docker-compose logs microservicio-libros

# Ver logs en tiempo real
docker-compose logs -f microservicio-libros
```

### 3. Probar el API

```bash
# Obtener todos los libros
curl http://localhost:8084/api/libros

# Obtener un libro por ID
curl http://localhost:8084/api/libros/1
```

### 4. Verificar Base de Datos

```bash
# Conectarse a MySQL
docker exec -it mysql-biblioteca-db mysql -uroot -proot123 biblioteca_db

# Ver tablas
SHOW TABLES;

# Ver datos
SELECT * FROM BOOKS;
```

### 5. Acceder al Frontend

```bash
# Abrir en navegador
open http://localhost:4201
# o
http://localhost:4201
```

## ✅ Estado Actual

### Servicios Funcionando:

- ✅ **MySQL**: Base de datos corriendo y saludable
- ✅ **Microservicio**: API REST funcionando en puerto 8084
- ⚠️ **Frontend**: Requiere compilación (npm install)

## 🚀 Comandos Útiles

### Iniciar Servicios

```bash
# Iniciar todos los servicios
docker-compose up -d

# Iniciar solo servicios específicos
docker-compose up -d mysql-db microservicio-libros

# Reconstruir e iniciar
docker-compose up -d --build
```

### Detener Servicios

```bash
# Detener todos
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Ver Logs

```bash
# Todos los servicios
docker-compose logs

# Servicio específico
docker-compose logs microservicio-libros

# Últimas 50 líneas
docker-compose logs --tail=50 microservicio-libros

# Seguir logs en tiempo real
docker-compose logs -f
```

### Verificar Salud

```bash
# Estado de contenedores
docker-compose ps

# Estadísticas de recursos
docker stats

# Inspeccionar contenedor
docker inspect ms-libros
```

## 🔧 Solución de Problemas

### Si un servicio no inicia:

1. **Ver logs del error:**
   ```bash
   docker-compose logs [nombre-servicio]
   ```

2. **Verificar dependencias:**
   ```bash
   docker-compose ps
   ```

3. **Reconstruir el servicio:**
   ```bash
   docker-compose up -d --build [nombre-servicio]
   ```

### Si el API no responde:

1. **Verificar que el contenedor esté corriendo:**
   ```bash
   docker-compose ps
   ```

2. **Verificar logs del microservicio:**
   ```bash
   docker-compose logs microservicio-libros
   ```

3. **Probar conectividad:**
   ```bash
   curl http://localhost:8084/api/libros
   ```

## 📊 Flujo de Comunicación

```
┌─────────────────┐
│   Navegador     │
│  localhost:4201 │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Frontend       │
│  (Nginx)        │
└────────┬────────┘
         │ Proxy /api
         ▼
┌─────────────────┐
│  Microservicio  │
│  localhost:8084 │
└────────┬────────┘
         │ JDBC
         ▼
┌─────────────────┐
│  MySQL          │
│  localhost:3306 │
└─────────────────┘
```

## ✅ Verificación Rápida

Ejecuta estos comandos para verificar que todo funciona:

```bash
# 1. Ver estado
docker-compose ps

# 2. Probar API
curl http://localhost:8084/api/libros

# 3. Ver logs del microservicio
docker-compose logs --tail=20 microservicio-libros

# 4. Verificar MySQL
docker exec -it mysql-biblioteca-db mysql -uroot -proot123 -e "SELECT COUNT(*) FROM biblioteca_db.BOOKS;"
```

---

**Estado actual:** ✅ MySQL y Microservicio funcionando correctamente

