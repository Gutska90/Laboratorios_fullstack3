# Instrucciones para Ejecutar Pruebas Unitarias

## Actividad Formativa 5: Aplicando pruebas unitarias a nuestro desarrollo

## 📋 Requisitos Previos

1. Node.js y npm instalados
2. Dependencias del proyecto instaladas: `npm install`
3. Chrome o ChromeHeadless instalado (para ejecutar pruebas)

## 🚀 Ejecución de Pruebas

### 1. Instalar dependencias (si no están instaladas)

```bash
cd biblioteca-frontend
npm install
```

### 2. Ejecutar pruebas con cobertura

```bash
npm test
```

Este comando:
- Ejecuta todas las pruebas unitarias
- Genera reporte de cobertura
- Abre un navegador para ver los resultados

### 3. Ejecutar pruebas en modo CI (sin interfaz gráfica)

```bash
npm run test:ci
```

Este comando:
- Ejecuta pruebas sin abrir navegador
- Genera reporte de cobertura
- Útil para CI/CD

### 4. Generar solo reporte de cobertura

```bash
npm run coverage
```

## 📊 Verificar Cobertura

### Ver reporte HTML

Después de ejecutar las pruebas, abre el reporte de cobertura:

```bash
# En macOS
open coverage/biblioteca-frontend/index.html

# En Linux
xdg-open coverage/biblioteca-frontend/index.html

# En Windows
start coverage/biblioteca-frontend/index.html
```

### Verificar umbrales

El reporte mostrará:
- **Statements**: Porcentaje de declaraciones ejecutadas
- **Branches**: Porcentaje de ramas cubiertas
- **Functions**: Porcentaje de funciones ejecutadas
- **Lines**: Porcentaje de líneas ejecutadas

**Objetivo**: Al menos 80% en cada categoría

## 🔍 Análisis con SonarQube

### Opción 1: SonarQube Local (Docker)

1. Iniciar SonarQube:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

2. Acceder a http://localhost:9000
   - Usuario: `admin`
   - Contraseña: `admin` (cambiar en primer inicio)

3. Generar reporte de cobertura:
```bash
npm run coverage
```

4. Ejecutar análisis:
```bash
npm run sonar
```

O con Docker:
```bash
docker run --rm -v $(pwd):/usr/src -w /usr/src sonarsource/sonar-scanner-cli sonar-scanner
```

### Opción 2: SonarQube Cloud

1. Crear cuenta en https://sonarcloud.io
2. Crear un proyecto
3. Actualizar `sonar-project.properties` con:
   - `sonar.host.url=https://sonarcloud.io`
   - `sonar.login=tu-token`
4. Ejecutar análisis:
```bash
npm run sonar
```

## 📁 Estructura de Pruebas

```
biblioteca-frontend/
├── src/
│   └── app/
│       ├── app.component.spec.ts
│       ├── components/
│       │   ├── book-form/
│       │   │   └── book-form.component.spec.ts
│       │   └── book-list/
│       │       └── book-list.component.spec.ts
│       └── services/
│           └── book.service.spec.ts
├── karma.conf.js
├── sonar-project.properties
├── tsconfig.spec.json
└── coverage/
    └── biblioteca-frontend/
        └── index.html (generado después de ejecutar pruebas)
```

## ✅ Verificación de Cobertura Esperada

### BookService
- ✅ getAllBooks() - 100%
- ✅ getBookById() - 100%
- ✅ createBook() - 100%
- ✅ updateBook() - 100%
- ✅ deleteBook() - 100%
- ✅ Manejo de errores - 100%

### BookListComponent
- ✅ ngOnInit() - 100%
- ✅ loadBooks() - >80%
- ✅ deleteBook() - >80%
- ✅ Manejo de estados - >80%

### BookFormComponent
- ✅ Inicialización de formulario - 100%
- ✅ Validaciones - >80%
- ✅ loadBook() - >80%
- ✅ onSubmit() (crear) - >80%
- ✅ onSubmit() (actualizar) - >80%
- ✅ cancel() - 100%
- ✅ markFormGroupTouched() - 100%

### AppComponent
- ✅ Inicialización - 100%

## 🐛 Solución de Problemas

### Error: "Chrome not found"
Instala Chrome o usa ChromeHeadless:
```bash
npm run test:ci
```

### Error: "Cannot find module"
Reinstala dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cobertura por debajo del 80%
1. Revisa los archivos `.spec.ts`
2. Asegúrate de cubrir todos los casos de uso
3. Verifica que no haya código muerto

### SonarQube no encuentra el reporte
1. Ejecuta `npm run coverage` primero
2. Verifica que `coverage/lcov.info` exista
3. Revisa la ruta en `sonar-project.properties`

## 📝 Notas Importantes

1. **Ejecución Local**: Todas las pruebas deben ejecutarse localmente
2. **Cobertura Mínima**: 80% en todas las categorías
3. **Archivos Excluidos**: 
   - `main.ts`
   - `app.config.ts`
   - `app.routes.ts`
   - `*.spec.ts`
   - `models/**`

## 📦 Entrega

Para la entrega, asegúrate de incluir:
- ✅ Todos los archivos `.spec.ts`
- ✅ `karma.conf.js`
- ✅ `sonar-project.properties`
- ✅ `tsconfig.spec.json`
- ✅ `package.json` actualizado
- ✅ Reporte de cobertura (opcional pero recomendado)
- ✅ Este archivo de instrucciones

