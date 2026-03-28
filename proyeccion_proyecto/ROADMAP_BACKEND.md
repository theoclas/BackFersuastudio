# Roadmap Backend (API REST) - Proyección del Proyecto

Este documento detalla el trabajo requerido en el backend (NestJS + Prisma) para soportar las funcionalidades de la "Proyección Frontend" descrita en la carpeta del front. El objetivo final es un sistema de auto-gestión para que los artistas actualicen sus fechas y datos bajo autenticación.

## 1. Módulo de Autenticación (`AuthModule`)
- [x] **Estandarizar Login:** El controlador (`auth.controller.ts`) debe verificar credenciales contra la tabla `User` (hasheadas previamente, ej. bcrypt) y devolver un **JWT Token**.
- [x] **Estandarizar Guards:** Implementar `JwtAuthGuard` a nivel global (o por ruta) para proteger cualquier intento de editar/crear registros (`POST`, `PUT`, `DELETE`).
- [x] **Identidad en el Request:** Al validar el JWT, se debe inyectar el usuario completo en `req.user` para saber qué artista está intentando modificar.

## 2. Lógica de Permisos (RBAC y Relaciones)
Dado que el schema de Prisma ya tiene la relación de Muchos-a-Muchos (`User <-> Artist`):
- [x] **Validación de Relación:** En el servicio `EventsService` (al intentar borrar o agregar una fecha), se debe validar que el `ArtistId` pertenece a los artistas asignados a ese usuario (`req.user.artists.some(a => a.id === artistId)`). Esto evita que un DJ edite las fechas de otro.

## 3. Endpoints de Eventos/Fechas (`EventsModule`)
Actualmente existe la tabla `Event` relacionada al artista.
- [x] **`POST /events`**: Ruta para agregar una nueva fecha (req.body: { title, date, venue, city, artistId, ... }). Protegida por Auth Guard.
- [x] **`PUT /events/:id`**: Ruta para actualizar info (cambiar de ciudad, etc.).
- [x] **`DELETE /events/:id`**: Ruta para borrar/cancelar fechas.
- [x] **`GET /events/artist/:slug`**: (Pública) Ruta para retornar solo las fechas activas de un artista para mostrarlas en la landing.

## 4. Expansión del Modelado de Datos (Prisma)
El frontend actualmente agrupa varios "sub-artistas" bajo un "dúo" (ej: MacFly y Mike Bran individualizados dentro del perfíl conjunto).
- [ ] **(Sugerencia) Añadir Tabla `ArtistMember`:** Si se van a gestionar desde el Back, crear un modelo en Prisma similar a `ArtistMember` que enlace al `Artist` principal, para poder llenar sus nombres, rols, y descripciones individuales dinámicamente. 
- [x] **Galería Dinámica (`Photo`):** Construir los endpoints `POST /photos` para subir imágenes y retornar las URLs, actualizándolas en la base de datos (servidas estáticamente por NestJS).

## 5. Controladores para Rider/Specs
- [x] Endpoints para CRUD en las tablas `Spec` (hardware) y `Social` (links de redes y Spotify embeds) desde el futuro dashboard, para que no estén hardcodeadas en fallback de React.
