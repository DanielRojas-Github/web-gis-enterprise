# Phase 3.7 — GeoServer Integration

## Overview

Phase 3.7 integrates GeoServer into the Web GIS Enterprise backend architecture.

The backend can now communicate with GeoServer through its REST API and WFS services, while PostgreSQL/PostGIS remains responsible for persistent spatial data and spatial calculations.

The integration includes:

- GeoServer connectivity validation.
- REST API authentication.
- GeoServer workspace creation.
- PostGIS datastore creation.
- Publication of spatial layers.
- WFS feature retrieval.
- Backend integration with GeoServer.
- Preservation of the existing API contracts.
- PostGIS spatial metrics.

---

## Architecture

The WFS request flow is:

```text
Client
  ↓
Express Route
  ↓
Validator
  ↓
Controller
  ↓
WFS Service
  ├──────────────→ GeoServer Service
  │                    ↓
  │               GeoServer WFS
  │                    ↓
  │                 PostGIS
  │
  └──────────────→ Repository
                       ↓
                    PostGIS
                       ↓
               Spatial metrics
```

GeoServer is responsible for exposing GIS services.

PostGIS remains responsible for spatial storage and specialized spatial calculations.

The backend service layer orchestrates both sources and exposes a stable API contract to clients.

---

## Docker Infrastructure

The project uses Docker Compose for PostgreSQL/PostGIS and GeoServer.

Services:

```text
postgres
geoserver
```

Containers:

```text
gis_postgres
gis_geoserver
```

GeoServer is exposed through:

```text
http://localhost:8080/geoserver
```

PostgreSQL is exposed through:

```text
localhost:5432
```

Inside the Docker Compose network, GeoServer connects to PostgreSQL using the service hostname:

```text
postgres
```

It must not use `localhost`, because inside the GeoServer container `localhost` refers to the GeoServer container itself.

---

## Environment Configuration

The backend GeoServer configuration is loaded through environment variables.

Required variables:

```env
GEOSERVER_URL=http://localhost:8080/geoserver
GEOSERVER_USER=<admin-user>
GEOSERVER_PASSWORD=<admin-password>
```

Credentials must not be hardcoded in application source code.

The configuration is exposed through:

```text
src/config/env.js
```

using:

```text
env.geoserver.url
env.geoserver.user
env.geoserver.password
```

Configuration validation errors are centralized in:

```text
src/config/configErrors.js
```

---

## GeoServer Service

GeoServer communication is encapsulated in:

```text
src/services/geoserverService.js
```

Main responsibilities:

```text
checkConnection()
getWorkspaces()
createWorkspace()
createPostGISDataStore()
publishLayer()
publishRoadsLayer()
publishBuildingsLayer()
getFeatures()
```

This prevents controllers and higher-level services from depending directly on GeoServer HTTP implementation details.

---

## GeoServer Workspace

The project workspace is:

```text
webgis
```

It was created through the GeoServer REST API.

The workspace groups the GIS resources belonging to the Web GIS Enterprise application.

---

## PostGIS Datastore

The GeoServer datastore is:

```text
webgis_postgis
```

It connects GeoServer to the project's PostgreSQL/PostGIS database.

Internal Docker connection:

```text
host: postgres
port: 5432
database: gisdb
dbtype: postgis
```

Database credentials are obtained from the backend environment configuration.

---

## Published Layers

Two PostGIS tables are currently published through GeoServer.

### Roads

Native table:

```text
roads
```

Published layer:

```text
webgis:roads
```

Geometry:

```text
LineString
```

Spatial reference system:

```text
EPSG:4326
```

### Buildings

Native table:

```text
buildings
```

Published layer:

```text
webgis:buildings
```

Geometry:

```text
Polygon
```

Spatial reference system:

```text
EPSG:4326
```

---

## WFS Integration

GeoServer WFS 2.0 is used to retrieve features.

The service performs requests equivalent to:

```text
service=WFS
version=2.0.0
request=GetFeature
typeNames=webgis:<layer>
outputFormat=application/json
```

`GeoServerService.getFeatures(typeName)` provides a reusable interface for retrieving published layers.

Validated layers:

```text
roads
buildings
```

Both return valid GeoJSON `FeatureCollection` responses.

---

## Backend WFS Endpoints

The backend exposes:

```text
GET /api/wfs/roads
GET /api/wfs/buildings
```

Request flow:

```text
Route
  ↓
validateWfsQuery
  ↓
WFS Controller
  ↓
WFS Service
  ↓
GeoServer Service
  ↓
GeoServer WFS
```

The backend therefore acts as an application API layer in front of GeoServer rather than exposing GeoServer directly to application clients.

---

## API Contract Normalization

Native GeoServer WFS responses use identifiers such as:

```text
roads.1
buildings.1
```

The backend normalizes these identifiers to numeric application identifiers:

```json
{
  "id": 1
}
```

The normalized identifier is also exposed in feature properties.

This prevents GeoServer-specific response details from becoming part of the public application API contract.

---

## Roads Spatial Metrics

Road length is calculated directly by PostGIS.

The repository uses:

```sql
ST_Length(
  geom::geography
)
```

The API exposes:

```text
lengthMeters
```

The WFS service combines GeoServer feature data with the PostGIS calculation while preserving the existing API contract.

---

## Buildings Spatial Metrics

Building area is calculated with:

```sql
ST_Area(
  geom::geography
)
```

Building perimeter is calculated with:

```sql
ST_Perimeter(
  geom::geography
)
```

The API exposes:

```text
areaSquareMeters
perimeterMeters
```

As with roads, GeoServer provides the WFS feature while PostGIS provides specialized spatial metrics.

---

## Validation Performed

The following validations were completed successfully:

- GeoServer Docker container running.
- GeoServer web interface accessible.
- WMS `GetCapabilities` response.
- Backend to GeoServer connectivity.
- GeoServer REST authentication.
- Workspace creation.
- PostGIS datastore creation.
- `roads` layer publication.
- `buildings` layer publication.
- WFS `GetCapabilities`.
- WFS `GetFeature` for roads.
- WFS `GetFeature` for buildings.
- `GeoServerService.getFeatures("roads")`.
- `GeoServerService.getFeatures("buildings")`.
- `GET /api/wfs/roads`.
- `GET /api/wfs/buildings`.
- Roads API contract regression test.
- Buildings API contract validation.
- PostGIS spatial metrics validation.
- Invalid WFS layer error handling.

---

## Architectural Decisions

### GeoServer is isolated behind a service

Controllers do not communicate directly with GeoServer.

All GeoServer-specific communication is encapsulated by:

```text
GeoServerService
```

### Repositories remain available

GeoServer integration does not replace the repository layer.

Repositories remain responsible for direct database access and specialized PostGIS operations.

### PostGIS performs spatial calculations

Spatial calculations are not duplicated in JavaScript.

PostGIS remains responsible for operations such as:

```text
ST_Length
ST_Area
ST_Perimeter
```

### Stable backend API

GeoServer response formats are not exposed directly as the application contract.

The service layer normalizes GIS data before returning it to API consumers.

---

## Phase 3.7 Status

Phase 3.7 GeoServer integration is operational.

Current GIS data flow:

```text
PostgreSQL/PostGIS
        ↓
     GeoServer
        ↓
       WFS
        ↓
GeoServerService
        ↓
   WFS Service
        ↓
    REST API
```

The backend now has a functional GIS service layer capable of consuming real GeoServer WFS resources while preserving PostGIS spatial capabilities and stable application contracts.