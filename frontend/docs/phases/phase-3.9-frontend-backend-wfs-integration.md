# Fase 3.9 — Integración Frontend ↔ Backend WFS

## 1. Objetivo

El objetivo de esta fase es integrar el frontend del Web GIS Enterprise con la API WFS expuesta por el backend, eliminando la dependencia directa del frontend respecto al servicio WFS de GeoServer para la carga de entidades vectoriales.

La arquitectura resultante establece al backend como capa de acceso y control entre el frontend y la infraestructura GIS.

El flujo implementado es:

```text
Frontend
   ↓
WFS API Client
   ↓
Backend REST API
   ↓
GeoServer / PostGIS
   ↓
GeoJSON FeatureCollection
   ↓
Vector Layer
   ↓
Layer Store
   ↓
Leaflet
```

---

## 2. Situación inicial

Antes de esta fase existían diferentes mecanismos para consultar datos WFS desde el frontend.

Parte del código realizaba solicitudes directamente contra GeoServer mediante `fetch`, construyendo URLs WFS desde el navegador.

El flujo anterior era aproximadamente:

```text
Frontend
   ↓
fetch()
   ↓
GeoServer WFS
```

También existían servicios WFS con responsabilidades parcialmente duplicadas.

Esta arquitectura generaba varios problemas:

* dependencia directa entre frontend y GeoServer;
* construcción manual de URLs WFS;
* duplicación de lógica HTTP;
* configuración distribuida;
* dificultad para centralizar errores y autenticación;
* acoplamiento entre la interfaz y la infraestructura GIS.

La Fase 3.9 reorganiza estas responsabilidades.

---

## 3. Arquitectura implementada

El nuevo flujo WFS es:

```text
WFSLoadButton
   ↓
loadWFSLayer()
   ↓
loadWFSFeatures()
   ↓
getWFSFeatures()
   ↓
Axios
   ↓
Backend /api/wfs/:typeName
   ↓
Backend WFS Service
   ↓
GeoServer / PostGIS
   ↓
FeatureCollection
   ↓
createVectorLayer()
   ↓
addLayerToGroup()
   ↓
Layer Store
   ↓
LayerRenderer
   ↓
VectorRenderer
   ↓
React-Leaflet GeoJSON
```

Cada nivel tiene una responsabilidad específica.

---

## 4. Cliente HTTP existente

El proyecto ya disponía de una instancia Axios centralizada:

```text
src/services/api/axios.js
```

Esta instancia utiliza:

```text
ENV.API_URL
```

como `baseURL`.

La configuración del frontend contiene:

```env
VITE_API_URL=http://localhost:3000
```

Por este motivo no fue necesario introducir otra librería HTTP ni crear una segunda configuración de API.

La Fase 3.9 reutiliza la infraestructura existente.

---

## 5. WFS API Client

Se creó:

```text
src/gis/services/wfs/wfsApi.js
```

Responsabilidad:

* realizar la comunicación HTTP;
* utilizar la instancia Axios existente;
* construir el endpoint del backend;
* transmitir parámetros de consulta;
* permitir el uso de `AbortSignal`;
* devolver la respuesta HTTP al nivel de servicio.

El endpoint utilizado sigue el formato:

```text
/api/wfs/:typeName
```

Ejemplo:

```text
/api/wfs/roads
```

La función acepta además un objeto `params`, permitiendo extender las consultas con los parámetros soportados por el backend, como:

* `count`;
* `startIndex`;
* `bbox`.

---

## 6. WFS Service

Se migró:

```text
src/gis/services/wfs/wfsService.js
```

La responsabilidad del servicio es establecer el contrato funcional entre la API y las capas superiores.

El servicio:

1. llama a `getWFSFeatures()`;
2. verifica la respuesta del backend;
3. comprueba que `success` sea válido;
4. valida la estructura mínima de un GeoJSON `FeatureCollection`;
5. extrae `response.data`;
6. devuelve únicamente el `FeatureCollection`.

El backend utiliza el contrato:

```json
{
  "success": true,
  "data": {
    "type": "FeatureCollection",
    "features": []
  }
}
```

Las capas superiores del frontend reciben únicamente:

```json
{
  "type": "FeatureCollection",
  "features": []
}
```

Esto evita propagar detalles del contrato HTTP hacia los componentes de renderizado.

---

## 7. WFS Layer Loader

Se migró:

```text
src/gis/layers/loaders/wfsLayerLoader.js
```

Anteriormente el loader utilizaba directamente un servicio asociado a GeoServer.

Ahora utiliza:

```text
wfsService.loadWFSFeatures()
```

El loader transforma el `FeatureCollection` recibido en una capa compatible con la arquitectura interna del GIS mediante:

```text
createVectorLayer()
```

El resultado tiene una estructura equivalente a:

```text
{
  id,
  name,
  type: "vector",
  source: {
    features: FeatureCollection
  },
  visible: true,
  ...
}
```

---

## 8. WFS como fuente y VECTOR como representación interna

Una decisión arquitectónica importante de esta fase fue no crear un `WFSRenderer`.

WFS representa el mecanismo mediante el cual se adquieren los datos.

Una vez descargadas las entidades, estas se convierten en una capa vectorial interna.

Por lo tanto:

```text
WFS
 ↓
FeatureCollection
 ↓
VECTOR
```

El renderizado continúa siendo responsabilidad de:

```text
VectorRenderer.jsx
```

Esto evita acoplar la visualización al protocolo utilizado para obtener los datos.

---

## 9. Integración con Layer Store

Se migró:

```text
src/gis/import/components/WFSLoadButton.jsx
```

El componente dejó de:

* construir URLs del backend;
* utilizar directamente `fetch`;
* conocer detalles del servicio HTTP;
* crear directamente la capa vectorial.

Ahora su responsabilidad consiste en:

1. solicitar una capa mediante `loadWFSLayer()`;
2. recibir una capa vectorial preparada;
3. incorporarla al Layer Store mediante `addLayerToGroup()`.

La capa se agrega actualmente al grupo:

```text
imported-layers
```

Esto mantiene el componente de interfaz separado de la infraestructura de comunicación.

---

## 10. Eliminación de implementaciones WFS obsoletas

Durante la auditoría se identificaron implementaciones antiguas que realizaban consultas WFS directamente desde el frontend.

Entre ellas:

```text
src/gis/services/geoserver/getWFSFeatures.js
```

y:

```text
src/gis/services/wfs/wfsFeatureService.js
```

Estas implementaciones quedaron reemplazadas por:

```text
wfsApi.js
   ↓
wfsService.js
   ↓
wfsLayerLoader.js
```

Después de migrar sus consumidores se verificó que no existieran referencias residuales antes de eliminarlas.

Esto reduce duplicación y establece un único flujo para las consultas WFS realizadas a través del backend.

---

## 11. Integración con el renderer

La capa generada por `createVectorLayer()` utiliza:

```text
type: vector
```

Por lo tanto `LayerRenderer` delega automáticamente en:

```text
VectorRenderer
```

`VectorRenderer` utiliza el componente `GeoJSON` de React-Leaflet para representar las entidades.

No fue necesario modificar el renderer para soportar el nuevo flujo.

Esto confirmó que la arquitectura existente permite separar correctamente:

```text
adquisición de datos
        ↓
modelo interno
        ↓
renderizado
```

---

## 12. Prueba manual del loader

Antes de conectar la interfaz se realizó una prueba directa desde la consola del navegador.

Se importó dinámicamente:

```text
loadWFSLayer
```

y se ejecutó para:

```text
roads
```

El resultado obtenido fue una capa con:

```text
type = "vector"
```

El contenido recibido fue:

```text
FeatureCollection
```

y se verificaron:

```text
2 features
```

Esto confirmó el recorrido:

```text
Browser
 ↓
wfsLayerLoader
 ↓
wfsService
 ↓
wfsApi
 ↓
Axios
 ↓
Backend
 ↓
FeatureCollection
 ↓
Vector Layer
```

---

## 13. Prueba funcional end-to-end

Después de migrar `WFSLoadButton`, se realizó una prueba desde la aplicación.

Al ejecutar:

```text
Cargar WFS
```

se verificó:

* ausencia de errores nuevos en la consola;
* incorporación de la capa `roads`;
* incorporación dentro del grupo `Imported Layers`;
* recepción de dos entidades;
* representación correcta de las dos geometrías LineString;
* visualización de las líneas en el mapa.

Con esta prueba se verificó el recorrido completo:

```text
UI
 ↓
WFSLoadButton
 ↓
wfsLayerLoader
 ↓
wfsService
 ↓
wfsApi
 ↓
Axios
 ↓
Backend
 ↓
GeoServer / PostGIS
 ↓
FeatureCollection
 ↓
Vector Layer
 ↓
Layer Store
 ↓
LayerRenderer
 ↓
VectorRenderer
 ↓
Leaflet
```

---

## 14. Posición inicial del mapa

Durante la prueba funcional se observó que las geometrías WFS se encontraban fuera de la vista inicial del mapa.

Fue necesario desplazarse hasta la ubicación de las entidades para visualizarlas.

Esto no representa un error de WFS ni de geometría.

La capa contiene coordenadas válidas y fue renderizada correctamente.

Como mejora futura puede implementarse:

```text
fitBounds
```

al cargar determinadas capas vectoriales.

Esta mejora se considera comportamiento de navegación/UX y no bloquea el cierre de la integración WFS.

---

## 15. Validación ESLint

Se realizó una validación específica sobre los archivos involucrados en la integración:

```bash
npx eslint \
src/gis/import/components/WFSLoadButton.jsx \
src/gis/layers/loaders/wfsLayerLoader.js \
src/gis/services/wfs/wfsApi.js \
src/gis/services/wfs/wfsService.js
```

Resultado:

```text
sin errores
sin warnings
```

El proyecto mantiene deuda técnica de lint en otros archivos anteriores a esta fase.

Esos problemas no fueron modificados para evitar mezclar responsabilidades y cambios históricos con la Fase 3.9.

---

## 16. Build de producción

Se ejecutó:

```bash
npm run build
```

Resultado:

```text
vite v8.0.13
251 modules transformed

dist/index.html
0.47 kB
gzip: 0.30 kB

dist/assets/index-DwV6oM_j.css
17.52 kB
gzip: 6.98 kB

dist/assets/index-Cj1lZenJ.js
430.06 kB
gzip: 133.19 kB

build completed successfully
```

El mensaje de rendimiento relacionado con `vite:css` no representa un error de compilación y no bloquea esta fase.

---

## 17. Responsabilidades finales

La separación obtenida es:

### `wfsApi.js`

Responsable de:

```text
HTTP / Axios / Backend endpoint
```

### `wfsService.js`

Responsable de:

```text
contrato funcional
validación
normalización de respuesta
```

### `wfsLayerLoader.js`

Responsable de:

```text
FeatureCollection
      ↓
Vector Layer
```

### `WFSLoadButton.jsx`

Responsable de:

```text
interacción de usuario
      ↓
solicitud de carga
      ↓
incorporación al Layer Store
```

### `VectorRenderer.jsx`

Responsable de:

```text
Vector Layer
      ↓
React-Leaflet GeoJSON
      ↓
mapa
```

---

## 18. Decisiones técnicas

Durante esta fase se tomaron las siguientes decisiones:

1. Reutilizar Axios existente.
2. No introducir React Query.
3. No introducir Redux Toolkit.
4. No crear un segundo cliente HTTP.
5. No crear un `WFSRenderer`.
6. Mantener `VectorRenderer` independiente del origen de los datos.
7. Centralizar las consultas WFS al backend.
8. Mantener las consultas WMS existentes independientes de este cambio.
9. No resolver deuda histórica de lint dentro de esta fase.
10. Mantener `fitBounds` como mejora posterior.
11. Mantener soporte para `AbortSignal` en el nivel HTTP sin introducir todavía un ciclo de cancelación innecesario en el botón.

---

## 19. Arquitectura resultante

La arquitectura final de WFS queda:

```text
┌──────────────────────────┐
│       Frontend UI        │
│      WFSLoadButton       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      WFS Layer Loader    │
│      loadWFSLayer()      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       WFS Service        │
│    loadWFSFeatures()     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        WFS API           │
│    getWFSFeatures()      │
│          Axios           │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       Backend API        │
│    /api/wfs/:typeName    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ GeoServer / PostgreSQL   │
│        PostGIS           │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   GeoJSON FeatureCollection
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       Vector Layer       │
│       Layer Store        │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      VectorRenderer      │
│     React-Leaflet        │
└──────────────────────────┘
```

---

## 20. Resultado de la fase

**Fase 3.9 — Integración Frontend ↔ Backend WFS: COMPLETADA FUNCIONALMENTE.**

Se consiguió:

* conectar el frontend con la API WFS del backend;
* eliminar el acceso WFS directo a GeoServer desde este flujo;
* centralizar HTTP mediante Axios;
* establecer una separación API / Service / Loader / UI;
* reutilizar la arquitectura vectorial existente;
* incorporar capas WFS dinámicamente al Layer Store;
* renderizar datos procedentes de PostGIS/GeoServer en Leaflet;
* validar el flujo con datos reales de `roads`;
* renderizar correctamente dos geometrías;
* validar los archivos modificados con ESLint;
* completar correctamente el build de producción.

La aplicación dispone ahora de un flujo WFS desacoplado y preparado para futuras capacidades como filtros espaciales, paginación, selección dinámica de capas, estados de carga, gestión avanzada de errores y navegación automática hacia las geometrías cargadas.
