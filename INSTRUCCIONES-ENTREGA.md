# Instrucciones para la Entrega - Actividad Sumativa 8

## 📋 Resumen de Entregables

### ✅ Completado
- ✅ Código fuente completo (Frontend + Backend)
- ✅ Pruebas unitarias (150/150 pasando)
- ✅ Cobertura de código (94.33% - supera el 80% requerido)
- ✅ Documentación completa
- ✅ Scripts de base de datos
- ✅ Arquetipo Maven
- ✅ Configuración de Karma y SonarQube

### ⏳ Pendiente (Tú debes hacerlo)
- ⏳ Grabar video de presentación (Kaltura, máximo 10 minutos)
- ⏳ Subir video a Kaltura
- ⏳ Crear archivo ZIP/RAR con todo el código
- ⏳ Subir ZIP al AVA
- ⏳ Compartir link de Git en el AVA
- ⏳ Compartir link del video en el AVA

---

## 🎬 Paso 1: Grabar el Video de Presentación

### Preparación
1. **Revisa el guion**: Lee `GUION-VIDEO-PRESENTACION.md` completamente
2. **Prepara el entorno**:
   - Inicia todos los microservicios (puertos 8081, 8082, 8083)
   - Inicia la aplicación Angular
   - Asegúrate de que la base de datos Oracle esté configurada
   - Crea usuarios de prueba para cada rol

3. **Prepara herramientas**:
   - Herramienta de grabación de pantalla (OBS, QuickTime, etc.)
   - Navegador con DevTools abierto
   - Terminal lista para ejecutar comandos

### Grabación
1. Sigue el guion paso a paso
2. Asegúrate de mostrar:
   - Diseño responsive (3 tamaños)
   - Todas las páginas principales
   - Validaciones de contraseña
   - Comunicación Frontend-Backend
   - Ejecución de pruebas unitarias
   - Reporte de cobertura
3. Mantén el video bajo 10 minutos

### Edición (opcional)
- Recorta pausas largas
- Asegúrate de que el audio sea claro
- Verifica que todo se vea bien

### Subida a Kaltura
1. Accede a Kaltura según las instrucciones del curso
2. Sube el video
3. Obtén el link del video
4. Verifica que el video sea accesible

---

## 📦 Paso 2: Crear el Archivo ZIP/RAR

### Opción A: Usando Terminal (macOS/Linux)

```bash
# Navegar al directorio del proyecto
cd /Users/user/fullstack3

# Crear ZIP excluyendo archivos no necesarios
zip -r Laboratorios-FullStack-AS8.zip \
  laboratorios-frontend/ \
  microservicio-usuarios/ \
  microservicio-laboratorios/ \
  microservicio-resultados/ \
  biblioteca-arquetipo/ \
  database-laboratorios-setup.sql \
  docker-compose.yml \
  README.md \
  ACTIVIDAD-SUMATIVA-8.md \
  RESUMEN-IMPLEMENTACION.md \
  OPTIMIZACIONES-REALIZADAS.md \
  GUION-VIDEO-PRESENTACION.md \
  CHECKLIST-ENTREGABLES.md \
  INSTRUCCIONES-ENTREGA.md \
  -x "*/node_modules/*" \
  -x "*/dist/*" \
  -x "*/.git/*" \
  -x "*/coverage/*" \
  -x "*/target/*" \
  -x "*/\.idea/*" \
  -x "*/.vscode/*"
```

### Opción B: Usando Interfaz Gráfica

1. **Selecciona las carpetas y archivos**:
   - `laboratorios-frontend/` (sin `node_modules`, `dist`, `coverage`)
   - `microservicio-usuarios/`
   - `microservicio-laboratorios/`
   - `microservicio-resultados/`
   - `biblioteca-arquetipo/`
   - `database-laboratorios-setup.sql`
   - `docker-compose.yml`
   - Todos los archivos `.md`

2. **Crea el ZIP**:
   - Click derecho → "Comprimir" (macOS)
   - O usar WinRAR/7-Zip (Windows)

3. **Verifica el contenido**:
   - Abre el ZIP y verifica que contenga todo
   - El tamaño debería ser razonable (< 50MB)

### Verificación del ZIP
```bash
# Ver contenido del ZIP
unzip -l Laboratorios-FullStack-AS8.zip | head -50

# Ver tamaño
ls -lh Laboratorios-FullStack-AS8.zip
```

---

## 📤 Paso 3: Subir al AVA

### 1. Subir el ZIP
- Accede al AVA del curso
- Ve a la sección de la Actividad Sumativa 8
- Sube el archivo `Laboratorios-FullStack-AS8.zip`
- Verifica que se suba correctamente

### 2. Compartir Link de Git
- En el mismo lugar del AVA, comparte el link:
  ```
  https://github.com/Gutska90/Laboratorios_fullstack3
  ```
- Asegúrate de que el repositorio sea público o comparte acceso

### 3. Compartir Link del Video
- Comparte el link del video de Kaltura
- Verifica que el video sea accesible

### 4. Comentarios Adicionales (opcional)
Puedes agregar:
```
Proyecto: Gestión de Laboratorios y Resultados de Análisis

Características destacadas:
- 150 pruebas unitarias (100% de aprobación)
- Cobertura de código: 94.33% (supera el 80% requerido)
- Diseño responsive para 3 tamaños de pantalla
- 6 validaciones de contraseña (más de las 4 requeridas)
- 3 microservicios completos con Spring Boot
- Arquetipo Maven para generación de microservicios

Tecnologías:
- Frontend: Angular 18, Bootstrap 5.3.3
- Backend: Spring Boot, Java 17
- Base de datos: Oracle Cloud
- Testing: Karma, Jasmine, SonarQube

Link de Git: https://github.com/Gutska90/Laboratorios_fullstack3
Link del video: [Link de Kaltura]
```

---

## ✅ Checklist Final de Entrega

Antes de entregar, verifica:

### Código
- [ ] El ZIP contiene todo el código necesario
- [ ] El código compila sin errores
- [ ] Las pruebas pasan (150/150)
- [ ] La aplicación funciona correctamente

### Documentación
- [ ] README.md está completo
- [ ] Todos los documentos están incluidos
- [ ] Las instrucciones son claras

### Video
- [ ] Video grabado (máximo 10 minutos)
- [ ] Video subido a Kaltura
- [ ] Link del video disponible
- [ ] Video muestra todos los puntos requeridos

### Git
- [ ] Código subido a Git
- [ ] Link del repositorio disponible
- [ ] Repositorio accesible

### Entrega
- [ ] ZIP creado y verificado
- [ ] ZIP subido al AVA
- [ ] Link de Git compartido en el AVA
- [ ] Link del video compartido en el AVA
- [ ] Todo está completo y listo

---

## 🆘 Solución de Problemas

### El ZIP es muy grande
- Excluye `node_modules/` (se instala con `npm install`)
- Excluye `dist/` (se genera al compilar)
- Excluye `coverage/` (se genera al ejecutar pruebas)
- Excluye `target/` de Maven (se genera al compilar)

### El video no se sube a Kaltura
- Verifica el tamaño del video (debe ser < límite de Kaltura)
- Verifica la conexión a internet
- Intenta comprimir el video si es necesario
- Contacta al profesor si persiste el problema

### Las pruebas no pasan
- Ejecuta `npm test` en `laboratorios-frontend`
- Verifica que todas las dependencias estén instaladas
- Revisa los errores en la consola

### El código no compila
- Verifica que todas las dependencias estén instaladas
- Ejecuta `npm install` en el frontend
- Ejecuta `mvn clean install` en los microservicios

---

## 📞 Contacto

Si tienes dudas:
1. Revisa la documentación del proyecto
2. Consulta con el profesor
3. Revisa los archivos de ayuda:
   - `GUION-VIDEO-PRESENTACION.md`
   - `CHECKLIST-ENTREGABLES.md`
   - `RESUMEN-IMPLEMENTACION.md`

---

**¡Éxito con tu entrega!** 🎉
