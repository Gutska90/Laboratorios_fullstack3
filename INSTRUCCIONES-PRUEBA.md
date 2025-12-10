# 🧪 Instrucciones para Probar la Aplicación

## ✅ Estado Actual

Todos los servicios están ejecutándose correctamente:

- ✅ **Microservicio Usuarios**: http://localhost:8081
- ✅ **Microservicio Laboratorios**: http://localhost:8082  
- ✅ **Microservicio Resultados**: http://localhost:8083
- ✅ **Frontend Angular**: http://localhost:4200

## 🚀 Pasos para Probar

### 1. Abrir la Aplicación
El navegador debería abrirse automáticamente en: **http://localhost:4200**

Si no se abre, accede manualmente a esa URL.

### 2. Registrar un Usuario Nuevo
1. Haz clic en "Registrarse" o ve a `/registro`
2. Completa el formulario con:
   - **Email**: test@example.com
   - **Nombre**: Test
   - **Apellido**: User
   - **Rol**: Selecciona ADMINISTRADOR, PACIENTE o TECNICO_LABORATORIO
   - **Contraseña**: Debe cumplir con las 6 validaciones:
     - Mínimo 8 caracteres
     - Máximo 50 caracteres
     - Al menos una mayúscula
     - Al menos una minúscula
     - Al menos un número
     - Al menos un carácter especial (!@#$%^&*)
   - **Confirmar Contraseña**: Debe coincidir
3. Haz clic en "Registrarse"

### 3. Iniciar Sesión
1. Usa las credenciales que acabas de crear
2. Haz clic en "Iniciar Sesión"
3. Deberías ser redirigido al Dashboard

### 4. Verificar Dashboard
- Debe mostrar información del usuario
- Debe mostrar estadísticas (usuarios, laboratorios, resultados)
- Debe tener navegación a otras secciones

### 5. Gestionar Laboratorios
1. Ve a "Laboratorios" en el menú
2. **Crear**: Haz clic en "Agregar Laboratorio"
   - Completa el formulario
   - Verifica validaciones
3. **Editar**: Haz clic en "Editar" en un laboratorio
   - Modifica los datos
   - Guarda los cambios
4. **Eliminar**: Haz clic en "Eliminar" en un laboratorio
   - Confirma la eliminación

### 6. Gestionar Resultados
1. Ve a "Resultados" en el menú
2. **Crear**: Haz clic en "Agregar Resultado"
   - Completa el formulario
   - Selecciona paciente y laboratorio
   - Verifica validaciones
3. **Editar**: Haz clic en "Editar" en un resultado
4. **Eliminar**: Haz clic en "Eliminar" en un resultado

### 7. Modificar Perfil
1. Ve a "Perfil" en el menú
2. Modifica tus datos
3. Opcionalmente cambia la contraseña
4. Guarda los cambios

### 8. Verificar Responsive Design
1. Cambia el tamaño de la ventana del navegador
2. Verifica que se adapte a:
   - **Móvil** (< 576px)
   - **Tablet** (576px - 991px)
   - **Desktop** (>= 992px)

### 9. Verificar Validaciones
- Intenta enviar formularios vacíos
- Intenta usar contraseñas inválidas
- Intenta usar emails inválidos
- Verifica que aparezcan mensajes de error

## 🔍 Verificar en la Consola del Navegador

1. Abre las **Herramientas de Desarrollador** (F12)
2. Ve a la pestaña **Console**
3. Verifica que **NO haya errores** en rojo
4. Verifica que las peticiones HTTP se realicen correctamente:
   - Ve a la pestaña **Network**
   - Realiza acciones en la aplicación
   - Verifica que las peticiones a `/api/usuarios`, `/api/laboratorios`, `/api/resultados` sean exitosas (código 200)

## ✅ Checklist de Verificación

- [ ] Frontend carga correctamente
- [ ] Puedo registrar un usuario
- [ ] Puedo iniciar sesión
- [ ] Dashboard muestra información
- [ ] Puedo crear laboratorios
- [ ] Puedo editar laboratorios
- [ ] Puedo eliminar laboratorios
- [ ] Puedo crear resultados
- [ ] Puedo editar resultados
- [ ] Puedo eliminar resultados
- [ ] Puedo modificar mi perfil
- [ ] Las validaciones funcionan
- [ ] El diseño es responsive
- [ ] No hay errores en la consola
- [ ] Las peticiones HTTP son exitosas

## 🛑 Detener los Servicios

Cuando termines de probar, puedes detener los servicios con:

```bash
pkill -f 'spring-boot:run'
pkill -f 'ng serve'
```

O simplemente cierra las terminales donde están ejecutándose.

---

**¡Listo para probar!** 🚀

