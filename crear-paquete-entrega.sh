#!/bin/bash

echo "📦 Creando paquete de entrega..."

# Nombre del archivo
ZIP_NAME="ENTREGA-ACTIVIDAD-FORMATIVA-4.zip"

# Eliminar ZIP anterior si existe
rm -f "$ZIP_NAME"

# Crear ZIP con los archivos necesarios
zip -r "$ZIP_NAME" \
  microservicio-libros/ \
  biblioteca-frontend/ \
  biblioteca-arquetipo/ \
  database-biblioteca-setup.sql \
  docker-compose.yml \
  README-INTEGRACION.md \
  VERIFICACION-FRONTEND-BACKEND.md \
  INSTRUCCIONES-ENTREGA.md \
  RESUMEN-ENTREGA.md \
  -x "*/node_modules/*" \
     "*/target/*" \
     "*/dist/*" \
     "*/.git/*" \
     "*/.*" \
     "*.log" \
     "*.jar" \
     "*.class"

echo ""
echo "✅ Paquete creado: $ZIP_NAME"
echo ""
echo "📊 Tamaño del archivo:"
ls -lh "$ZIP_NAME" | awk '{print $5}'
echo ""
echo "📋 Contenido del ZIP:"
unzip -l "$ZIP_NAME" | tail -1
