# Guía para Despliegue en Producción (Hostinger) — Backend

Este documento detalla lo que necesito de ti (datos de tu servidor) y los pasos técnicos requeridos para que el **Backend de NestJS** funcione en el servidor de Hostinger.

## 1. Lo que necesito de tu Panel de Hostinger
Para configurar el `.env` definitivo, por favor crea y pásame estos datos (o llénalos en el `.env` del servidor):

*   **MySQL Database Name:** (Ej: `u12345_fersuadb`)
*   **MySQL User:** (Ej: `u12345_fersuauser`)
*   **MySQL Password:** (La que elijas al crear el usuario)
*   **MySQL Host:** (Casi siempre es `localhost` o `127.0.0.1` en Hostinger)
*   **Tu Dominio Final:** (Ej: `https://fersuastudio.com`) — *Esto es para configurar CORS.*

---

## 2. Lo que hace falta en el proyecto (Checklist Técnico)

### A. Construcción del Proyecto (Build)
NestJS no corre sobre archivos `.ts` en producción. Debes generar el código JavaScript:
1.  En tu terminal local dentro de `backend/`, corre: `npm run build`.
2.  Esto generará la carpeta `dist/`. **Esta es la carpeta vital que se sube al servidor.**

### B. Carpeta de Archivos (Uploads)
Como implementamos el uploader de fotos, Hostinger necesita que el proceso de Node.js tenga permiso para escribir archivos:
1.  Crea la carpeta `uploads/` y dentro `uploads/artists/` en la raíz de tu proyecto en el servidor.
2.  Asegúrate de cambiar los **Permisos de Carpeta** a `755` o `775` desde el Administrador de Archivos de Hostinger.

### C. Dependencias y Prisma
Al subir el código al servidor (usando FTP o Git), debes asegurarte de:
1.  Correr `npm install --production` para instalar las librerías necesarias.
2.  Correr `npx prisma generate` para sincronizar el cliente de la base de datos con tu esquema.
3.  Correr `npx prisma db push` (la primera vez) para crear las tablas físicas en la base de datos de Hostinger que creaste en el paso 1.

---

## 4. Estructura de Archivos Recomendada (Seguridad)
No mezcles el Backend con el Frontend en `public_html`. Sugiero este orden:

*   `/home/u12345/` (Raíz del usuario)
    *   `fersua-backend/`  <-- **Aquí va todo el backend (dist, .env, package.json, uploads)**
    *   `domains/fersuastudio.com/public_html/` <-- **Aquí solo van los archivos del dist del Frontend.**

---

## 5. El archivo `.env` de Producción
Crea un archivo `.env` en la raíz de la carpeta del backend en Hostinger con este formato:

```env
PORT=3000
DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_db"
JWT_SECRET="TU_CLAVE_SECRETA_ALEATORIA_Y_LARGA"

# ¡IMPORTANTE!: Cambia esta URL por la de tu dominio real en producción 
# para que el Dashboard funcione (ej: https://fersuastudio.com)
FRONTEND_URL="https://tu-dominio.com"
```

> **Importante:** Nunca compartas este archivo `.env` en repositorios públicos.
