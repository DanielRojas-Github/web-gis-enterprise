# Fase 3.6 — Data Infrastructure y PostGIS

## 1. Objetivo

La Fase 3.6 establece la infraestructura de datos del backend del proyecto Web GIS Enterprise.

El objetivo principal es reemplazar progresivamente los datos simulados por una infraestructura GIS real basada en PostgreSQL/PostGIS, manteniendo una arquitectura desacoplada entre las capas HTTP, servicios, repositorios y base de datos.

Durante esta fase se implementaron:

* PostgreSQL/PostGIS mediante Docker.
* Conexión del backend con PostgreSQL.
* Validación de disponibilidad de PostGIS.
* Tablas espaciales `roads` y `buildings`.
* Consultas espaciales desde repositories.
* Conversión de geometrías PostGIS a GeoJSON.
* Cálculos espaciales con PostGIS.
* Sistema automático de migraciones SQL.
* Registro de migraciones aplicadas.
* Transacciones y rollback.
* Verificación SHA-256 de migraciones.
* Arranque seguro del backend.
* Endpoints GIS respaldados por datos reales.
* Validación y manejo uniforme de errores.

---

## 2. Arquitectura resultante

El flujo principal de acceso a datos queda organizado de la siguiente manera:

```text
HTTP Request
     ↓
Routes
     ↓
Validation Middleware
     ↓
Controller
     ↓
Service
     ↓
RepositoryFactory
     ↓
Repository
     ↓
PostgreSQL / PostGIS
```

Esta separación evita que controllers y services conozcan directamente detalles de SQL o de la conexión con PostgreSQL.

---

## 3. Infraestructura Docker

PostgreSQL/PostGIS se ejecuta mediante Docker utilizando:

```text
postgis/postgis:16-3.4
```

La infraestructura proporciona:

* PostgreSQL 16.
* PostGIS 3.4.
* Base de datos `gisdb`.
* Persistencia mediante volumen Docker.
* Puerto PostgreSQL `5432`.

GeoServer también forma parte de la infraestructura Docker prevista por el proyecto, aunque su integración funcional se mantiene separada del trabajo de persistencia realizado en esta fase.

---

## 4. Conexión del backend

El backend utiliza el paquete `pg` y un `Pool` centralizado.

Archivo principal:

```text
backend/src/config/database.js
```

La configuración de conexión se obtiene desde:

```text
backend/src/config/env.js
```

Variables utilizadas:

```env
PORT=3000
GEOSERVER_URL=http://localhost:8080/geoserver
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gisdb
DB_USER=postgres
DB_PASSWORD=postgres
```

Las variables críticas son validadas antes de iniciar correctamente el backend.

---

## 5. Validación de PostgreSQL y PostGIS

Durante el arranque se realizan dos comprobaciones.

### PostgreSQL

```sql
SELECT NOW();
```

Permite comprobar que el backend puede establecer una conexión válida con la base de datos.

### PostGIS

```sql
SELECT PostGIS_Version() AS version;
```

Permite comprobar que la extensión espacial está disponible.

Ejemplo validado durante la fase:

```text
PostGIS connected: 3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1
```

---

## 6. Arranque seguro del backend

El servidor Express no comienza a aceptar peticiones hasta que la infraestructura requerida haya sido validada.

Orden de arranque:

```text
Database connection
        ↓
PostGIS verification
        ↓
Database migrations
        ↓
Express server
```

Salida esperada:

```text
Database connected: ...
PostGIS connected: ...
Database migrations completed
Server running on port 3000
```

Si falla la conexión, PostGIS o una migración, el proceso de arranque falla y el servidor no queda ejecutándose parcialmente.

---

## 7. Tabla espacial `roads`

La entidad `roads` representa geometrías lineales.

Características principales:

```text
Geometry type: LineString
SRID: 4326
```

Estructura actual:

```sql
roads
├── id
├── name
├── description
└── geom
```

La columna espacial utiliza:

```sql
geometry(LineString, 4326)
```

También dispone de un índice espacial GiST.

Datos de prueba reales fueron insertados y validados en PostGIS.

---

## 8. Tabla espacial `buildings`

La entidad `buildings` representa geometrías poligonales.

Características:

```text
Geometry type: Polygon
SRID: 4326
```

Estructura:

```sql
buildings
├── id
├── name
├── description
└── geom
```

La columna espacial utiliza:

```sql
geometry(Polygon, 4326)
```

También dispone de índice espacial GiST.

Durante las pruebas se almacenó y validó un polígono irregular real.

---

## 9. Operaciones espaciales PostGIS

Los repositories realizan la transformación de geometrías PostGIS a GeoJSON mediante:

```sql
ST_AsGeoJSON(geom)
```

### Roads

Se calcula la longitud geográfica mediante:

```sql
ST_Length(
  geom::geography
)
```

El resultado se expone como:

```text
lengthMeters
```

### Buildings

Se calcula el área mediante:

```sql
ST_Area(
  geom::geography
)
```

y el perímetro mediante:

```sql
ST_Perimeter(
  geom::geography
)
```

Los resultados se exponen como:

```text
areaSquareMeters
perimeterMeters
```

El uso de `geography` permite obtener las mediciones en unidades métricas para las geometrías almacenadas en EPSG:4326.

---

## 10. Repositories

La comunicación SQL está encapsulada en repositories.

Actualmente existen:

```text
FeatureRepository
RoadRepository
BuildingRepository
```

`RepositoryFactory` centraliza la resolución de repositories:

```text
feature
road
building
```

Esto mantiene desacoplados los services de las implementaciones concretas de persistencia.

---

## 11. Sistema de migraciones

Se implementó un migration runner propio:

```text
backend/src/database/runMigrations.js
```

Las migraciones se encuentran en:

```text
backend/src/database/migrations/
```

El runner:

1. Descubre automáticamente archivos `.sql`.
2. Los ordena por nombre.
3. Comprueba si ya fueron aplicados.
4. Calcula su checksum SHA-256.
5. Ejecuta nuevas migraciones dentro de una transacción.
6. Registra las migraciones completadas.
7. Realiza rollback cuando una migración falla.
8. Detecta modificaciones posteriores de migraciones aplicadas.

---

## 12. Tabla `schema_migrations`

El historial de migraciones se almacena en:

```text
schema_migrations
```

Campos principales:

```text
id
filename
checksum
applied_at
```

El campo `checksum` utiliza SHA-256 para verificar la integridad del contenido de cada migración.

---

## 13. Integridad mediante checksum

Cada archivo SQL obtiene un hash SHA-256.

Si una migración ya registrada cambia posteriormente, el backend detecta:

```text
Migration checksum mismatch
```

La comparación es estricta a nivel de contenido del archivo.

Esto significa que incluso cambios aparentemente menores, como espacios o comentarios, pueden modificar el checksum.

Esta protección permite detectar alteraciones accidentales del historial de base de datos.

---

## 14. Regla de inmutabilidad de migraciones

A partir de esta fase se establece la siguiente regla del proyecto:

> Una migración que ya fue aplicada no debe modificarse para corregir el esquema. Las correcciones posteriores deben realizarse mediante una nueva migración.

Esta regla mantiene consistente el historial entre diferentes instalaciones y entornos.

---

## 15. Incidentes históricos de migraciones

Durante el desarrollo se detectaron dos migraciones históricas cuyo nombre no correspondía con la modificación que realmente realizaban.

### Migración 002

```text
002_add_description_to_roads.sql
```

Fue registrada históricamente, pero su contenido repetía la creación original de `roads`.

No se modificó posteriormente debido a la regla de inmutabilidad.

### Migración 005

```text
005_add_description_to_roads.sql
```

Fue registrada, pero contenía una consulta de inspección de `information_schema` y no modificaba el esquema.

Tampoco fue reescrita después de quedar registrada.

### Migración correctiva 006

La corrección real se implementó mediante:

```text
006_add_description_to_roads.sql
```

con:

```sql
ALTER TABLE roads
ADD COLUMN IF NOT EXISTS description VARCHAR(500);
```

De esta manera se preservó el historial y se corrigió el esquema mediante una migración posterior.

---

## 16. Reparación controlada de checksum

Durante la revisión final se detectó una modificación accidental en:

```text
003_create_buildings.sql
```

El archivo contenía un carácter residual que no correspondía con la migración originalmente ejecutada.

Después de verificar el contenido correcto de la migración se realizó una reparación controlada del checksum registrado.

Este procedimiento fue excepcional y no sustituye la regla general de inmutabilidad.

La regla operativa continúa siendo:

```text
Migración aplicada
        ↓
NO modificar
        ↓
Crear nueva migración correctiva
```

---

## 17. Problema de conexión PostgreSQL detectado

Durante la configuración inicial aparecieron errores de autenticación, entre ellos:

```text
password authentication failed
```

y:

```text
SASL: client password must be a string
```

La investigación permitió detectar interferencia con una instalación local de PostgreSQL además del contenedor Docker.

La configuración fue corregida y finalmente se verificó la conexión directa del backend con el PostgreSQL/PostGIS ejecutado mediante Docker.

Como resultado, el proyecto mantiene una contraseña de base de datos no vacía y valida esta configuración durante el arranque.

---

## 18. Endpoints GIS validados

### Estado del backend

```text
GET /
```

Resultado:

```text
200
```

### Features

```text
GET /api/features
```

Resultado:

```text
200
```

### Roads

```text
GET /api/wfs/roads
```

Resultado:

```text
200
```

### Roads con `typeName`

```text
GET /api/wfs/roads?typeName=roads
```

Resultado:

```text
200
```

Una petición no soportada:

```text
GET /api/wfs/roads?typeName=building
```

produce:

```text
400 VALIDATION_ERROR
```

### Buildings

```text
GET /api/buildings
```

Resultado:

```text
200
```

### Ruta inexistente

```text
GET /api/no-existe
```

Resultado:

```text
404 ROUTE_NOT_FOUND
```

---

## 19. Manejo de errores

El backend mantiene un contrato uniforme:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

Los errores conocidos utilizan `AppError`.

El pipeline principal es:

```text
Error
  ↓
AppError
  ↓
errorHandler
  ↓
HTTP response
```

---

## 20. Request ID y trazabilidad

Cada petición recibe un identificador.

Ejemplo:

```text
47ba9cab-29e8-459f-bd21-2898bbc67e41
```

El identificador se encuentra en:

```text
request.requestId
```

y se devuelve mediante:

```text
X-Request-ID
```

Morgan incluye este identificador en los logs HTTP.

Esto proporciona una base para trazabilidad distribuida futura.

---

## 21. Regresión final

La regresión realizada al cierre de la fase confirmó:

```text
Database connection                  PASS
PostGIS availability                 PASS
Database migrations                  PASS
Server startup                       PASS

GET /                                200 PASS
GET /api/features                    200 PASS
GET /api/wfs/roads                   200 PASS
GET /api/wfs/roads?typeName=roads    200 PASS
GET /api/wfs/roads?typeName=building 400 PASS
GET /api/buildings                   200 PASS
GET /api/no-existe                   404 PASS
```

Todos los endpoints críticos y mecanismos de infraestructura de esta fase quedaron operativos.

---

## 22. Mejora futura

El migration runner actual es adecuado para el entorno y arquitectura actuales.

Como mejora futura para despliegues con múltiples instancias del backend se deberá evaluar un PostgreSQL advisory lock.

Esto evitará que dos instancias intenten ejecutar simultáneamente una misma migración durante el arranque.

Esta mejora no es necesaria para cerrar la Fase 3.6.

---

## 23. Estado final

La Fase 3.6 deja establecido un backend GIS con infraestructura espacial real:

```text
Node.js / Express
        ↓
Repository Architecture
        ↓
pg Pool
        ↓
PostgreSQL 16
        ↓
PostGIS 3.4
```

El proyecto dispone ahora de persistencia espacial real, consultas GIS, cálculos espaciales, migraciones versionadas, protección de integridad mediante checksum, manejo uniforme de errores y un proceso de arranque seguro.

**Estado de la Fase 3.6: COMPLETADA**
