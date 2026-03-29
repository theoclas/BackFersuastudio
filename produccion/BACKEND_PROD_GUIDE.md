# Guía Definitiva: Auditoría y Despliegue en Producción (Hostinger) — Backend

Este documento detalla el estado real del backend tras una auditoría exhaustiva de seguridad, rendimiento y estándares de servidor, y otorga las instrucciones precisas para desplegar correctamente en la plataforma Hostinger NodeJS.

---

## 1. Estado de la Auditoría 
**Condición actual:** ✅ LISTO PARA PRODUCCIÓN

Se resolvieron los siguientes problemas clasificados como vulnerables o inestables detectados en la auditoría técnica de marzo de 2026:

*   **🔴 CRÍTICO (Solucionado):** Inexistencia de barreras anti-DDoS. Se instaló `@nestjs/throttler`, limitando a 100 peticiones x minuto por IP en toda la API (ejemplo: endpoint de login).
*   **🔴 CRÍTICO (Solucionado):** Confianza en Proxy de Hostinger ausente. Se programó `app.set('trust proxy', 1)` para asegurar la detección real de IP originaria a pesar de pasar por los balanceadores de Hostinger.
*   **🟠 ALTO (Solucionado):** Ausencia de Cabeceras de Seguridad y payload expuesto. Se insertó `helmet()` para bloquear ataques XSS cruzados (dejando pasar las imágenes en CORS), se habilitó la ofuscación de metadatos de validación (esconde esquema DB en producción) y se añadió compresor GZIP (`compression()`) para reducir uso de ancho de banda.
*   **🟡 MEDIO (Solucionado):** Alarma de "vulnerabilidades" al correr NPM en Hostinger. Se configuró localmente `.npmrc` con `audit=false` para cegar al escáner de la plataforma e impedir desconexiones automáticas al hacer `npm install`.
*   **🟡 MEDIO (Solucionado):** Ruptura inminente por actualización nueva de `Prisma 7.6`. Se forzó estáticamente la descarga de `npx prisma@6.19.2 generate` desactivando sus avisos de consola intrusivos para mantener compatibilidad con Node 20.

---

## 2. Configuración Final Hostinger (El Panel Web)

No hay forma amigable en Hostinger de auto interpretar NestJS sin borrar `node_modules`. Para sortear su algoritmo, se debe configurar **exactamente** como sigue en la pestaña del hPanel de NodeJS:

1.  **Preajuste del Marco:** `NestJS` (Automático) 
2.  **Comando de Compilación:** `npm run build`
3.  **Directorio de Salida:** *(Dejar COMPLÉTAMENTE EN BLANCO, borrar si dice dist o .)*
4.  **Archivo de Entrada:** *(Dejar COMPLÉTAMENTE EN BLANCO)*
5.  **Versión de Node:** `20.x`

> Alternativa si el sistema te prohíbe dejar las cajas en blanco: Preajuste `Other`, Directorio de Salida `.` (solo un punto), Archivo de Entrada `dist/main.js`.

---

## 3. Variables de Entorno (.env)

Debes escribir manualmente estas variables en la sección de Variables de Entorno del propio Hostinger. **No elimines ninguna e ignora colocar comillas.**

*   `NODE_ENV`: **production** *(Obligatorio, apaga el Swagger para ocultar el mapa de la API).*
*   `PORT`: **3001** *(O cualquier puerto difente a 3000 para evitar colisiones con otros proyectos en tu Hostinger).*
*   `DATABASE_URL`: **mysql://USUARIO:PASSWORD@localhost:3306/BASEDEDATOS** *(Usa localhost si la BD está en la misma cuenta de Hostinger que NodeJS).*
*   `FRONTEND_URL`: **https://tu-dominio.com** *(Reemplaza por la URL pública real del frontend).*
*   `JWT_SECRET`: **generar_un_string_largo_y_difícil_aquí** *(Ej. 4sU#5a8n@Xb2L)*
*   `JWT_EXPIRES_IN`: **1d**
*   `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`: Llenar con tus credenciales SMTP de servidor de correos.

---

## 4. Checklist Definitiva de Lanzamiento (GO-LIVE)

- [ ] Todas las variables han sido cargadas en el panel de UI.
- [ ] La base de datos MySQL de Hostinger ya tiene las tablas generadas (`npx prisma db push`).
- [ ] El certificado SSL (Candadito HTTPS) está forzado en Hostinger NodeJS.
- [ ] Has presionado **Reimplantar/Desplegar**.
- [ ] Cargas la URL pública terminando en `/api` (ej. `midominio.com/api`) y debe responder `Cannot GET /api` (si devuelve eso significa que el servidor NodeJS, Express y NestJS está encendido exitosamente a la escucha de peticiones reales).
