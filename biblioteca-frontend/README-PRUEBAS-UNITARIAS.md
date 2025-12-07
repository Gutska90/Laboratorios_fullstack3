# Pruebas Unitarias - Biblioteca Frontend

## Actividad Formativa 5: Aplicando pruebas unitarias a nuestro desarrollo

Este documento describe la implementación de pruebas unitarias y la configuración de SonarQube para el Frontend de Angular.

## 📋 Requisitos Cumplidos

- ✅ Pruebas unitarias implementadas para todos los componentes y servicios
- ✅ Configuración de Karma y Jasmine para ejecutar pruebas
- ✅ Cobertura de código configurada (objetivo: 80%)
- ✅ Integración con SonarQube configurada
- ✅ Scripts npm para ejecutar pruebas y análisis

## 🧪 Estructura de Pruebas

### Archivos de Pruebas Creados

1. **`src/app/services/book.service.spec.ts`**
   - Pruebas para el servicio BookService
   - Cobertura de todos los métodos CRUD (GET, POST, PUT, DELETE)
   - Manejo de errores

2. **`src/app/components/book-list/book-list.component.spec.ts`**
   - Pruebas para el componente BookListComponent
   - Carga de libros
   - Eliminación de libros
   - Manejo de estados (loading, error)

3. **`src/app/components/book-form/book-form.component.spec.ts`**
   - Pruebas para el componente BookFormComponent
   - Validaciones de formulario
   - Creación y edición de libros
   - Navegación

4. **`src/app/app.component.spec.ts`**
   - Pruebas básicas para AppComponent

## 🚀 Ejecución de Pruebas

### Ejecutar pruebas con cobertura

```bash
npm test
```

O específicamente con cobertura:

```bash
npm run coverage
```

### Ejecutar pruebas en modo CI (sin interfaz gráfica)

```bash
npm run test:ci
```

### Ver reporte de cobertura

Después de ejecutar las pruebas, el reporte de cobertura se genera en:
- **HTML**: `coverage/biblioteca-frontend/index.html`
- **LCOV**: `coverage/lcov.info` (para SonarQube)

## 📊 Configuración de Cobertura

La configuración de cobertura está en `karma.conf.js`:

```javascript
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

### Umbrales de Cobertura

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

## 🔍 Integración con SonarQube

### Configuración

El archivo `sonar-project.properties` contiene la configuración para SonarQube:

```properties
sonar.projectKey=biblioteca-frontend
sonar.projectName=Biblioteca Frontend
sonar.sources=src
sonar.tests=src
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### Ejecutar análisis de SonarQube

**Requisito previo**: Tener SonarQube instalado y ejecutándose localmente o acceso a una instancia de SonarQube.

1. Generar reporte de cobertura:
   ```bash
   npm run coverage
   ```

2. Ejecutar análisis de SonarQube:
   ```bash
   npm run sonar
   ```

   O si tienes SonarQube en Docker:
   ```bash
   docker run --rm -v $(pwd):/usr/src -w /usr/src sonarsource/sonar-scanner-cli sonar-scanner
   ```

### Configuración de SonarQube Local (Docker)

Si necesitas ejecutar SonarQube localmente:

```bash
# Iniciar SonarQube con Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Acceder a http://localhost:9000
# Usuario por defecto: admin / admin
```

Luego actualiza `sonar-project.properties` con la URL de tu instancia:

```properties
sonar.host.url=http://localhost:9000
```

## 📁 Archivos de Configuración

### `karma.conf.js`
Configuración de Karma para ejecutar pruebas con Jasmine y generar reportes de cobertura.

### `tsconfig.spec.json`
Configuración de TypeScript para archivos de prueba.

### `sonar-project.properties`
Configuración de SonarQube para análisis de código y cobertura.

### `angular.json`
Configuración actualizada para incluir:
- Cobertura de código habilitada
- Configuración de Karma
- Exclusiones de archivos para cobertura

## ✅ Verificación de Cobertura

Para verificar que se cumple el 80% de cobertura:

1. Ejecuta las pruebas:
   ```bash
   npm run coverage
   ```

2. Abre el reporte HTML:
   ```bash
   open coverage/biblioteca-frontend/index.html
   ```

3. Verifica que todos los umbrales estén por encima del 80%:
   - Statements
   - Branches
   - Functions
   - Lines

## 🎯 Cobertura Esperada

### Servicios
- **BookService**: 100% de cobertura
  - getAllBooks()
  - getBookById()
  - createBook()
  - updateBook()
  - deleteBook()
  - Manejo de errores

### Componentes
- **BookListComponent**: >80% de cobertura
  - ngOnInit()
  - loadBooks()
  - deleteBook()
  - Manejo de estados

- **BookFormComponent**: >80% de cobertura
  - Inicialización de formulario
  - Validaciones
  - loadBook()
  - onSubmit() (crear y actualizar)
  - cancel()
  - markFormGroupTouched()

- **AppComponent**: 100% de cobertura
  - Inicialización
  - Propiedades

## 📝 Notas Importantes

1. **Exclusiones de Cobertura**: Los siguientes archivos están excluidos de la cobertura:
   - `main.ts`
   - `app.config.ts`
   - `app.routes.ts`
   - `*.spec.ts`
   - `models/**`

2. **Ejecución Local**: Todas las pruebas deben ejecutarse localmente antes de la entrega.

3. **SonarQube**: El análisis de SonarQube es opcional para la entrega, pero la configuración está lista.

## 🔧 Solución de Problemas

### Las pruebas no se ejecutan
- Verifica que todas las dependencias estén instaladas: `npm install`
- Verifica que Chrome esté instalado (o usa ChromeHeadless)

### Cobertura por debajo del 80%
- Revisa los archivos de prueba y asegúrate de cubrir todos los casos
- Verifica que no haya código muerto sin pruebas

### SonarQube no encuentra el reporte
- Asegúrate de ejecutar `npm run coverage` primero
- Verifica que el archivo `coverage/lcov.info` exista

## 📦 Entrega

Para la entrega, incluye:
- ✅ Todos los archivos `.spec.ts`
- ✅ `karma.conf.js`
- ✅ `sonar-project.properties`
- ✅ `tsconfig.spec.json`
- ✅ `package.json` actualizado
- ✅ Reporte de cobertura (opcional, pero recomendado)

## 📚 Referencias

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/latest/config/configuration-file.html)
- [SonarQube Documentation](https://docs.sonarqube.org/)

