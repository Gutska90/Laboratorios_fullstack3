# Guion para Video de Presentación - Kaltura
## Actividad Sumativa 8: Presentando el desarrollo Full Stack Final

**Duración máxima**: 10 minutos  
**Herramienta**: Kaltura

---

## 📋 Estructura del Video (10 minutos)

### 1. Introducción (30 segundos)
- **Saludo y presentación**
  - "Buenos días/tardes, mi nombre es [Tu nombre]"
  - "En este video presentaré el desarrollo Full Stack Final para la Actividad Sumativa 8"
  - "El sistema desarrollado es una aplicación de Gestión de Laboratorios y Resultados de Análisis"

### 2. Arquitectura y Tecnologías (1 minuto)
- **Mostrar estructura del proyecto**
  - Abrir el explorador de archivos
  - Mostrar la estructura: Frontend Angular, 3 microservicios, arquetipo
  - **Tecnologías utilizadas**:
    - Frontend: Angular 18, Bootstrap 5.3.3, TypeScript
    - Backend: Spring Boot, Java 17
    - Base de datos: Oracle Cloud
    - Testing: Karma, Jasmine, SonarQube

### 3. Diseño Responsive (1 minuto)
- **Demostrar diseño adaptativo**
  - Abrir la aplicación en el navegador
  - Mostrar la página de login en 3 tamaños diferentes:
    1. **Móvil** (< 576px): Redimensionar ventana del navegador
    2. **Tablet** (576px - 991px): Tamaño medio
    3. **Desktop** (≥ 992px): Pantalla completa
  - Mencionar: "El diseño usa Bootstrap GRID de 12 columnas para adaptarse a diferentes dispositivos"

### 4. Funcionalidades del Frontend (2 minutos)
- **Páginas principales** (navegar y mostrar):
  1. **Inicio de sesión** (`/login`)
     - Mostrar formulario con validaciones
     - Mencionar validación de email
  
  2. **Registro de usuarios** (`/registro`)
     - Mostrar formulario completo
     - **Destacar validaciones de contraseña** (6 validaciones):
       - Longitud mínima: 8 caracteres
       - Longitud máxima: 50 caracteres
       - Al menos una mayúscula
       - Al menos una minúscula
       - Al menos un número
       - Al menos un carácter especial
     - Intentar registrar con contraseña inválida para mostrar validaciones
  
  3. **Recuperar contraseña** (`/recuperar-password`)
     - Mostrar formulario
  
  4. **Modificación de perfil** (`/perfil`)
     - Mostrar formulario de edición
     - Opción de cambiar contraseña
  
  5. **Dashboard** (`/dashboard`)
     - Mostrar estadísticas (si es ADMINISTRADOR)
     - Navegación a otras secciones
  
  6. **Gestión de Laboratorios** (`/laboratorios`)
     - Mostrar lista de laboratorios
     - Crear nuevo laboratorio (si es ADMINISTRADOR)
     - Mostrar validaciones del formulario
  
  7. **Gestión de Resultados** (`/resultados`)
     - Mostrar lista de resultados
     - Filtrar por rol (PACIENTE ve solo sus resultados)
     - Crear nuevo resultado

### 5. Roles y Privilegios (1 minuto)
- **Demostrar diferentes roles**:
  - **ADMINISTRADOR**: Acceso completo, puede gestionar laboratorios
  - **PACIENTE**: Solo ve sus propios resultados
  - **TECNICO_LABORATORIO**: Puede gestionar resultados
  - Mostrar cómo cambia la interfaz según el rol

### 6. Comunicación Frontend-Backend (1.5 minutos)
- **Mostrar comunicación con microservicios**:
  1. Abrir DevTools del navegador (F12) → pestaña Network
  2. Realizar una acción (ej: crear laboratorio)
  3. Mostrar la petición HTTP a `http://localhost:8082/api/laboratorios`
  4. Mostrar la respuesta JSON
  5. Mencionar los 3 microservicios:
     - Usuarios (puerto 8081)
     - Laboratorios (puerto 8082)
     - Resultados (puerto 8083)

### 7. Microservicios y Arquetipo (1.5 minutos)
- **Mostrar estructura de microservicios**:
  - Abrir carpeta `microservicio-usuarios`
  - Mostrar estructura: controller, service, repository, entity, dto
  - Mencionar: "Todos los microservicios siguen la misma estructura"
  
- **Mostrar arquetipo**:
  - Abrir carpeta `biblioteca-arquetipo`
  - Mencionar: "Este arquetipo permite generar nuevos microservicios con la estructura base"
  - Mostrar archivos principales del arquetipo

### 8. Base de Datos Oracle (30 segundos)
- **Mostrar script SQL**:
  - Abrir `database-laboratorios-setup.sql`
  - Mencionar: "Script para crear las tablas en Oracle Cloud"
  - Mostrar estructura de tablas (USUARIOS, LABORATORIOS, RESULTADOS)

### 9. Pruebas Unitarias y Cobertura (2 minutos)
- **Ejecutar pruebas unitarias**:
  1. Abrir terminal
  2. Navegar a `laboratorios-frontend`
  3. Ejecutar: `npm test -- --code-coverage --watch=false --browsers=ChromeHeadless`
  4. Esperar a que termine (mostrar en pantalla)
  5. **Mostrar resultados**:
     - "150 pruebas ejecutadas, todas pasando"
     - Mostrar cobertura:
       - Statements: 94.33%
       - Branches: 86.25%
       - Functions: 87.94%
       - Lines: 94.92%
     - Mencionar: "Todas las métricas superan el 80% requerido"

- **Mostrar reporte de cobertura**:
  - Abrir `coverage/laboratorios-frontend/index.html` en el navegador
  - Mostrar el reporte HTML con detalles de cobertura por archivo
  - Navegar por algunos archivos para mostrar la cobertura

- **Mencionar SonarQube** (opcional):
  - "También está configurado SonarQube para análisis de calidad de código"
  - Mostrar archivo `sonar-project.properties`

### 10. Patrones de Diseño (30 segundos)
- **Mencionar patrones implementados**:
  - Arquitectura de componentes standalone (Angular)
  - Servicios inyectables para lógica de negocio
  - Guards para protección de rutas
  - Validators personalizados reutilizables

### 11. Cierre (30 segundos)
- **Resumen final**:
  - "He presentado el desarrollo Full Stack completo"
  - "Incluye Frontend responsive, 3 microservicios, pruebas unitarias con 94% de cobertura"
  - "Todo el código está en el repositorio Git: [URL]"
  - "Gracias por su atención"

---

## 🎬 Tips para la Grabación

### Antes de Grabar:
1. **Preparar el entorno**:
   - Tener todos los microservicios corriendo (puertos 8081, 8082, 8083)
   - Tener la aplicación Angular corriendo
   - Tener la base de datos Oracle configurada
   - Tener datos de prueba cargados

2. **Preparar navegador**:
   - Limpiar caché
   - Tener DevTools abierto
   - Tener una cuenta de cada rol creada (ADMINISTRADOR, PACIENTE, TECNICO_LABORATORIO)

3. **Preparar terminal**:
   - Tener la terminal lista en el directorio correcto
   - Tener los comandos listos para copiar/pegar

### Durante la Grabación:
1. **Hablar claro y pausado**
2. **Mostrar acciones en tiempo real** (no solo hablar sobre ellas)
3. **Resaltar puntos clave** con el cursor o zoom
4. **Mantener el ritmo** (10 minutos es suficiente si te preparas)
5. **Si cometes un error**, pausa y corrige, luego continúa

### Después de Grabar:
1. **Revisar el video** completo
2. **Verificar que se muestren todos los puntos requeridos**
3. **Asegurar que la calidad de audio y video sea buena**
4. **Subir a Kaltura** según las instrucciones del curso

---

## ✅ Checklist de Contenido del Video

- [ ] Introducción y presentación
- [ ] Arquitectura y tecnologías mostradas
- [ ] Diseño responsive en 3 tamaños (móvil, tablet, desktop)
- [ ] Todas las páginas principales mostradas:
  - [ ] Inicio de sesión
  - [ ] Registro de usuarios
  - [ ] Recuperar contraseña
  - [ ] Modificación de perfil
  - [ ] Dashboard
  - [ ] Gestión de laboratorios
  - [ ] Gestión de resultados
- [ ] Validaciones de contraseña mostradas (6 validaciones)
- [ ] Diferentes roles y privilegios demostrados
- [ ] Comunicación Frontend-Backend mostrada (Network tab)
- [ ] Microservicios mostrados (estructura)
- [ ] Arquetipo mostrado
- [ ] Script de base de datos mostrado
- [ ] Pruebas unitarias ejecutadas en tiempo real
- [ ] Cobertura de código mostrada (>= 80%)
- [ ] Reporte de cobertura HTML mostrado
- [ ] Patrones de diseño mencionados
- [ ] Cierre y resumen

---

## 📝 Notas Adicionales

1. **Tiempo aproximado por sección**:
   - Introducción: 30s
   - Arquitectura: 1m
   - Diseño responsive: 1m
   - Funcionalidades: 2m
   - Roles: 1m
   - Comunicación: 1.5m
   - Microservicios: 1.5m
   - BD: 30s
   - Pruebas: 2m
   - Patrones: 30s
   - Cierre: 30s
   - **Total**: ~10 minutos

2. **Si te quedas corto de tiempo**, prioriza:
   - Pruebas unitarias y cobertura (obligatorio)
   - Diseño responsive (obligatorio)
   - Funcionalidades principales (obligatorio)

3. **Si te sobra tiempo**, puedes agregar:
   - Más detalles sobre validaciones
   - Mostrar más endpoints de los microservicios
   - Explicar más sobre el arquetipo

---

**¡Buena suerte con tu presentación!** 🎥
