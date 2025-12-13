# Estado de la Aplicación - Ejecución

## ✅ Aplicación Ejecutándose

### Frontend Angular
- **Estado**: ✅ Corriendo
- **URL**: http://localhost:4200
- **Puerto**: 4200
- **Comando**: `npm start` (con `--open` para abrir automáticamente)

### Microservicios Backend

#### 1. Microservicio de Usuarios
- **Estado**: ✅ Corriendo
- **URL**: http://localhost:8081
- **Puerto**: 8081
- **Endpoint de prueba**: http://localhost:8081/api/usuarios
- **Base de datos**: H2 (en memoria)

#### 2. Microservicio de Laboratorios
- **Estado**: ✅ Corriendo
- **URL**: http://localhost:8082
- **Puerto**: 8082
- **Endpoint de prueba**: http://localhost:8082/api/laboratorios
- **Base de datos**: H2 (en memoria)
- **Nota**: Requiere autenticación (403 sin token es normal)

#### 3. Microservicio de Resultados
- **Estado**: ✅ Corriendo
- **URL**: http://localhost:8083
- **Puerto**: 8083
- **Endpoint de prueba**: http://localhost:8083/api/resultados
- **Base de datos**: H2 (en memoria)
- **Nota**: Requiere autenticación (403 sin token es normal)

---

## 🌐 Acceso a la Aplicación

### Frontend
**URL Principal**: http://localhost:4200

La aplicación debería haberse abierto automáticamente en tu navegador. Si no se abrió, puedes acceder manualmente a:
```
http://localhost:4200
```

### Páginas Disponibles
- **Login**: http://localhost:4200/login
- **Registro**: http://localhost:4200/registro
- **Recuperar Contraseña**: http://localhost:4200/recuperar-password
- **Dashboard**: http://localhost:4200/dashboard (requiere login)
- **Perfil**: http://localhost:4200/perfil (requiere login)
- **Laboratorios**: http://localhost:4200/laboratorios (requiere login)
- **Resultados**: http://localhost:4200/resultados (requiere login)

---

## 🔧 Comandos para Ejecutar Manualmente

### Iniciar Frontend
```bash
cd laboratorios-frontend
npm start
# O para abrir automáticamente:
npm start -- --open
```

### Iniciar Microservicios

#### Microservicio de Usuarios
```bash
cd microservicio-usuarios
mvn spring-boot:run
```

#### Microservicio de Laboratorios
```bash
cd microservicio-laboratorios
mvn spring-boot:run
```

#### Microservicio de Resultados
```bash
cd microservicio-resultados
mvn spring-boot:run
```

### Iniciar Todo con Docker (Alternativa)
```bash
docker-compose up -d
```

---

## ✅ Verificación de Funcionamiento

### 1. Verificar Frontend
- Abre http://localhost:4200 en tu navegador
- Deberías ver la página de login
- La página debe ser responsive (prueba redimensionar la ventana)

### 2. Verificar Microservicios
- **Usuarios**: http://localhost:8081/api/usuarios (debe devolver `[]` o lista de usuarios)
- **Laboratorios**: http://localhost:8082/api/laboratorios (puede requerir autenticación)
- **Resultados**: http://localhost:8083/api/resultados (puede requerir autenticación)

### 3. Probar Funcionalidad
1. **Registrar un usuario**:
   - Ve a http://localhost:4200/registro
   - Completa el formulario
   - Verifica las validaciones de contraseña (6 validaciones)

2. **Iniciar sesión**:
   - Ve a http://localhost:4200/login
   - Usa las credenciales del usuario registrado

3. **Navegar por la aplicación**:
   - Dashboard
   - Gestión de Laboratorios (si eres ADMINISTRADOR)
   - Gestión de Resultados
   - Perfil

---

## 🐛 Solución de Problemas

### El frontend no se abre
```bash
# Verificar que el puerto 4200 esté libre
lsof -ti:4200

# Si hay un proceso, detenerlo:
kill -9 $(lsof -ti:4200)

# Reiniciar el frontend
cd laboratorios-frontend
npm start -- --open
```

### Los microservicios no responden
```bash
# Verificar que los puertos estén libres
lsof -ti:8081,8082,8083

# Reiniciar los microservicios
cd microservicio-usuarios && mvn spring-boot:run &
cd microservicio-laboratorios && mvn spring-boot:run &
cd microservicio-resultados && mvn spring-boot:run &
```

### Error de conexión con el backend
- Verifica que los microservicios estén corriendo
- Verifica las URLs en los servicios de Angular
- Revisa la consola del navegador (F12) para ver errores

---

## 📝 Notas

1. **Base de Datos**: Los microservicios están configurados para usar H2 (en memoria) por defecto. Los datos se pierden al reiniciar.

2. **Autenticación**: Algunos endpoints requieren autenticación JWT. Debes iniciar sesión primero.

3. **Puertos**:
   - Frontend: 4200
   - Usuarios: 8081
   - Laboratorios: 8082
   - Resultados: 8083

4. **Hot Reload**: El frontend tiene hot reload activado. Los cambios se reflejan automáticamente.

---

**Última actualización**: Diciembre 2025
