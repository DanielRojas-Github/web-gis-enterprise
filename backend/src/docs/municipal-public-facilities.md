# Capa municipal de equipamientos públicos

La capa `public_facilities` representa equipamientos de servicio municipal como puntos. No contiene propietarios, residentes ni contactos personales.

## Esquema

- `name`: nombre público del equipamiento, obligatorio.
- `facility_type`: `school`, `health_center`, `municipal_office`, `community_center`, `sports_center`, `library` u `other`.
- `status`: `active`, `inactive` o `under_maintenance`.
- `managing_department`: nombre del área municipal responsable; no es un dato de contacto personal.
- `geom`: punto en EPSG:4326, obligatorio, con índice espacial GiST.

La migración `007_create_public_facilities.sql` crea la tabla. La capa no se incluye como una tabla genérica: la geometría y los dominios de atributos están restringidos para este tipo de entidad.

## API y mapa

- `GET /api/public-facilities` devuelve una colección GeoJSON y requiere la sesión OIDC y un rol GIS de lectura, como las demás rutas `/api`.
- `POST /api/public-facilities` crea un punto; `PUT /api/public-facilities/:id` reemplaza sus atributos y geometría; `DELETE /api/public-facilities/:id` lo elimina.
- Las escrituras exigen `GIS_WRITE_ROLES` (por defecto `gis-editor,gis-admin`) y un encabezado `Origin` permitido por `CORS_ALLOWED_ORIGINS`. El cuerpo acepta `name`, `facilityType`, `status`, `managingDepartment` y una geometría `Point` GeoJSON con coordenadas `[longitud, latitud]` en EPSG:4326.
- El grupo `Municipal Services` del panel carga la capa al activarla y conserva la configuración de usuario aunque ya exista un árbol de capas guardado localmente.
- El formulario municipal permite ubicar un equipamiento en el mapa, actualizar sus atributos y eliminarlo. Solo muestra acciones de escritura cuando `/api/auth/me` informa `permissions.canWrite`; el backend sigue aplicando la autorización en cada operación.
- La API valida los dominios y límites de coordenadas antes de escribir; PostGIS impone el tipo `Point`, el SRID y las restricciones de categoría y estado.

La tabla comienza vacía si no se cargan datos municipales; no se insertan ubicaciones de ejemplo en las migraciones. El editor genérico de dibujo sigue siendo local; solo el formulario de equipamientos escribe en esta tabla.

## Casos diferidos

- La prueba automatizada de PostGIS se ejecuta solo con `GIS_ALLOW_DB_TESTS=true`; por defecto, `npm test` usa un repositorio en memoria para no escribir en la base local.
- No hay control de versión para actualizaciones concurrentes: si dos editores guardan el mismo equipamiento, prevalece la última escritura. Resolver conflictos se abordará en una etapa de colaboración multiusuario.
- La creación no usa clave de idempotencia. Añadirla y decidir el comportamiento de reintentos se abordará junto con una etapa offline o de conectividad intermitente.
- La cola offline existente sigue en memoria; el formulario municipal requiere conexión. No se promete edición offline en el alcance actual.
- Falta una prueba automatizada que cubra la interacción del formulario y el mapa en navegador.
