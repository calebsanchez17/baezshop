# DC STORE PRO V2.2

Versión corregida con portada de tres paneles (Diamantes, Cuentas y Entretenimiento) y sistema de canales EN VIVO reparado.

## Cambios V2.2
- Al marcar un canal como **EN VIVO**, el sistema también lo deja visible automáticamente.
- La portada consulta los canales periódicamente y muestra una sección destacada **Ahora en vivo**.
- Un canal EN VIVO aparece incluso si todavía no tiene enlace; en ese caso muestra “Enlace por configurar”.
- La portada tiene exactamente tres paneles principales: **Diamantes**, **Cuentas** y **Entretenimiento**.
- La pestaña Diamantes también muestra los productos de Extras para conservar esa categoría sin añadir un cuarto panel principal.
- El catálogo separa Cuentas de Diamantes y mantiene Entretenimiento independiente.
- Se conserva el CRUD administrativo, galería de cuentas, pedidos, voucher y configuración.


Tienda digital completa con **Frontend + Backend + panel administrativo + almacenamiento local persistente**, diseñada para Free Fire, cuentas digitales, extras y entretenimiento.

## Mejoras de esta versión

- Diseño nuevo oscuro/premium y totalmente responsive, sin emojis en la interfaz.
- Inicio profesional con catálogo destacado, preguntas frecuentes y panel de canales/redes.
- Estado **EN VIVO** por canal: el administrador lo activa/desactiva y el inicio se actualiza automáticamente sin recargar la página.
- CRUD completo de productos: agregar, editar, eliminar/desactivar y actualización inmediata en el catálogo.
- Productos de tipo **Cuenta** con galería de fotos y videos.
- El Jefe configura el límite de fotos y videos permitidos por cada cuenta.
- El administrador puede subir la foto principal y los archivos de galería.
- Checkout inteligente:
  - **Diamantes y Extras:** solicita ID de Free Fire.
  - **Cuentas y Entretenimiento:** no solicita ID; solo nombre y método de pago.
- Voucher PNG profesional con producto, total, método, cliente, código e ID cuando corresponde.
- WhatsApp con mensaje prellenado según el tipo de producto.
- Panel de pedidos con estados: pendiente, pagado, procesando, completado y cancelado.
- CRUD de preguntas frecuentes.
- CRUD de métodos de pago (solo Jefe).
- CRUD de canales/redes con imagen, enlace, plataforma, texto del botón y estado EN VIVO.
- El Jefe puede crear, editar y eliminar cuentas de administradores/trabajadores.
- Cada usuario del panel puede editar su propio nombre de usuario y contraseña.
- Configuración del logo, portada del login, música del login, WhatsApp, textos, tipo de cambio y actualización automática.
- Precios en soles con conversión automática a dólares usando el tipo de cambio configurado.
- Backend sin dependencias externas: no necesitas ejecutar `npm install`.

## Cuenta inicial del Jefe

- Usuario: `dcbaez2026`
- Contraseña inicial: `baez1234`

**Cambia la contraseña desde Panel → Mi cuenta antes de publicar la web en Internet.**

## Cómo ejecutarlo en Windows

1. Instala Node.js 20 o superior.
2. Descomprime el proyecto.
3. Abre la carpeta en Visual Studio Code.
4. Abre **Terminal → Nuevo terminal**.
5. Ejecuta:

```bash
npm start
```

También puedes hacer doble clic en `INICIAR.bat`.

Luego abre:

- Tienda: `http://localhost:3000`
- Panel: `http://localhost:3000/login.html`

## Entrar desde otro celular en tu misma red

Ejecuta `ipconfig`, busca la IPv4 de tu PC y abre en el celular:

```text
http://TU-IP:3000
```

Ejemplo: `http://192.168.18.168:3000`.

## Archivos importantes

- `server.js`: backend/API y servidor web.
- `db.js`: almacenamiento JSON, contraseñas y datos iniciales.
- `public/`: frontend.
- `data/store.json`: base de datos local (se crea al iniciar).
- `uploads/`: fotos, videos, logo y música subidos desde el panel.
- `tests/smoke.js`: prueba automática de login, CRUD, pedidos, redes y uploads.

## Multimedia de cuentas

En **Panel → Configuración**, el Jefe define:

- límite de fotos por cuenta;
- límite de videos por cuenta.

Después, en **Panel → Productos**, crea o edita un producto con categoría **Cuentas**. Aparecerá la sección de galería para subir múltiples fotos y videos.

Límites por archivo:

- imágenes: hasta 10 MB;
- videos MP4/WEBM: hasta 50 MB;
- audio: hasta 20 MB.

## Estado EN VIVO

En **Panel → Canales**, agrega una red con nombre, plataforma, enlace e imagen. El botón **Marcar EN VIVO** hace que aparezca el indicador rojo `EN VIVO` en el inicio. El inicio consulta los cambios automáticamente cada pocos segundos; el intervalo se configura en **Configuración**.

Para detectar automáticamente si YouTube/Twitch/TikTok están transmitiendo sin pulsar el botón se necesitan las APIs oficiales y credenciales de cada plataforma. Esta versión deja el control en el panel y actualiza la portada automáticamente.

## WhatsApp y voucher

La web prepara automáticamente el mensaje de WhatsApp. Un navegador normal no puede adjuntar por sí solo una imagen generada a `wa.me`; por eso el sistema incluye **Descargar voucher** y **Compartir voucher**. En celulares compatibles, “Compartir voucher” permite enviar directamente la imagen a WhatsApp.

Para envío 100% automático de la imagen desde el servidor se requiere WhatsApp Cloud API de Meta.

## Seguridad y publicación

- Contraseñas almacenadas con `scrypt`.
- Cookies de sesión HttpOnly.
- Limitación básica de intentos.
- Cabeceras de seguridad.
- El Jefe conserva las funciones críticas de configuración, pagos y equipo.

Para una tienda pública 24/7, usa HTTPS y un hosting/VPS con persistencia para `data/` y `uploads/`. Si crecerá a muchos pedidos o varias instancias, migra el almacenamiento a PostgreSQL/MySQL.


## V2.1 - Corrección del panel

Se corrigieron los botones dinámicos Editar/Eliminar, el cambio de estado de pedidos y el botón EN VIVO. El problema era la política de seguridad CSP: los atributos HTML `onclick`/`onchange` estaban bloqueados. La V2.1 usa delegación de eventos en JavaScript y mantiene la CSP segura.

## Novedades V2.3 — Apariencia y música

El usuario **Jefe / propietario** tiene una nueva sección **Apariencia** en el panel administrativo. Desde allí puede:

- Subir o quitar una imagen de fondo general para toda la tienda pública.
- Activar o desactivar ese fondo sin borrar el archivo configurado.
- Regular el oscurecimiento del fondo (0–95 %) para mantener la lectura profesional.
- Subir o quitar la música ambiental de la tienda.
- Activar o desactivar la música.
- Elegir el volumen inicial (0–100 %).
- Intentar reproducción automática, repetir la pista e iniciar silenciado.
- Probar la pista desde el mismo panel antes de guardar.

Cuando la música está activa, la tienda muestra un reproductor flotante para el visitante con **reproducir/pausar, silenciar/activar sonido y control de volumen**. El navegador puede bloquear el autoplay con sonido; si ocurre, el reproductor queda listo para iniciarse con la primera interacción del visitante.

### Actualizar desde V2.2 sin perder datos

Usa el ZIP `DC-STORE-PRO-V2.3-PATCH.zip` y reemplaza los archivos indicados sobre tu proyecto actual. **No borres las carpetas `data` ni `uploads`** de tu instalación, porque allí se conservan la configuración, productos e imágenes subidas. Al iniciar V2.3, la migración añade automáticamente las nuevas opciones a `data/store.json`.
