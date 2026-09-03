# Phase 3.8 — Advanced Enterprise WFS

## 1. Overview

Phase 3.8 extends the Web GIS Enterprise backend with advanced WFS querying capabilities through GeoServer.

The previous GeoServer integration established communication between:

```text
Client
  ↓
Express Backend
  ↓
GeoServer
  ↓
PostGIS
```

This phase evolves that integration into a controlled Enterprise WFS API capable of handling:

* Spatial filtering with BBOX
* Pagination
* Result limits
* Sorting
* Property selection
* Safe attribute filtering
* GeoServer error handling
* Request timeouts
* Query validation

The backend remains the public API boundary.

Clients do not communicate directly with GeoServer and do not have unrestricted access to GeoServer WFS parameters.

---

## 2. Objectives

The main objectives of Phase 3.8 are:

1. Extend WFS `GetFeature` requests with advanced query parameters.
2. Validate all public WFS query parameters before reaching GeoServer.
3. Maintain separation between the public API contract and GeoServer's internal WFS contract.
4. Support spatial queries using bounding boxes.
5. Implement WFS pagination.
6. Support feature ordering.
7. Support selective property retrieval.
8. Preserve backend-derived properties.
9. Introduce safe attribute filtering without exposing raw CQL expressions.
10. Handle GeoServer failures using structured API errors.
11. Add configurable GeoServer request timeouts.
12. Verify that advanced WFS parameters can operate together.

---

## 3. Architecture

The WFS request flow is:

```text
HTTP Client
    ↓
WFS Route
    ↓
validateRequest
    ↓
validateWfsQuery
    ↓
WFS Controller
    ↓
WFS Service
    ↓
WFS Query Translation
    ↓
GeoServer Service
    ↓
GeoServer WFS 2.0.0
    ↓
PostGIS
```

The responsibilities are intentionally separated.

### Route

Defines the public resource being requested.

Examples:

```text
GET /api/wfs/roads
GET /api/wfs/buildings
```

The layer is determined by the route and not by a public `typeName` query parameter.

### Validator

Validates the public HTTP query contract.

Invalid requests are rejected before contacting GeoServer.

### Controller

Receives the HTTP request and forwards the validated query parameters to the WFS service.

### WFS Service

Coordinates GeoServer data with repository data.

It also preserves application-level properties that are not directly exposed by GeoServer.

### WFS Query Utility

Translates public API query parameters into the subset required by GeoServer.

This prevents the public API from becoming an unrestricted GeoServer proxy.

### GeoServer Service

Builds and executes WFS 2.0.0 `GetFeature` requests.

It also handles:

* GeoServer HTTP failures
* Connection failures
* Invalid responses
* Request timeouts

---

## 4. Public WFS Endpoints

The current endpoints are:

```text
GET /api/wfs/roads
GET /api/wfs/buildings
```

The requested resource determines the GeoServer feature type.

For example:

```text
/api/wfs/roads
```

maps internally to:

```text
webgis:roads
```

while:

```text
/api/wfs/buildings
```

maps internally to:

```text
webgis:buildings
```

A public `typeName` parameter is therefore unnecessary and is not part of the Phase 3.8 API contract.

---

## 5. Supported Query Parameters

Phase 3.8 supports the following public query parameters:

| Parameter      | Purpose                             |
| -------------- | ----------------------------------- |
| `bbox`         | Spatial filtering                   |
| `count`        | Maximum number of returned features |
| `startIndex`   | Pagination offset                   |
| `sortBy`       | Feature ordering                    |
| `propertyName` | Property selection                  |
| `filter`       | Safe attribute filtering            |

Example:

```text
GET /api/wfs/roads?count=10&startIndex=0
```

---

## 6. Query Validation

All WFS query parameters pass through `validateWfsQuery`.

Validation occurs before the request reaches the service layer.

This protects the backend and GeoServer from malformed or unsupported input.

---

## 7. BBOX Spatial Filtering

Spatial filtering is supported through:

```text
bbox=minX,minY,maxX,maxY
```

Example:

```text
GET /api/wfs/roads?bbox=-63.70,-22.05,-63.65,-21.98
```

The validator requires exactly four finite numeric coordinates.

It also verifies:

```text
minX < maxX
minY < maxY
```

Invalid example:

```text
GET /api/wfs/roads?bbox=-63.70,-22.05
```

Result:

```text
400 VALIDATION_ERROR
```

### CRS handling

The application uses:

```text
EPSG:4326
```

The public API follows the GeoJSON coordinate convention used by the application:

```text
longitude, latitude
```

The GeoServer request explicitly includes the CRS in the BBOX:

```text
bbox=minX,minY,maxX,maxY,EPSG:4326
```

and requests features using:

```text
srsName=EPSG:4326
```

This resolved the WFS axis-order ambiguity encountered during Phase 3.8 testing.

---

## 8. Result Limits

The `count` parameter limits the number of WFS features returned.

Example:

```text
GET /api/wfs/roads?count=1
```

Validation rules:

```text
count >= 1
count <= 1000
count must be an integer
```

The maximum prevents clients from requesting an uncontrolled number of features in a single operation.

Example invalid request:

```text
GET /api/wfs/roads?count=-1
```

Result:

```text
400 VALIDATION_ERROR
```

---

## 9. Pagination

WFS pagination is implemented using:

```text
count
startIndex
```

Example:

```text
GET /api/wfs/roads?count=1&startIndex=0
```

returns the first feature.

```text
GET /api/wfs/roads?count=1&startIndex=1
```

returns the next feature.

Validation requires:

```text
startIndex >= 0
startIndex must be an integer
```

Testing confirmed pagination using the existing `Road A` and `Road B` features.

---

## 10. Sorting

Feature ordering is exposed through:

```text
sortBy
```

Example ascending request:

```text
GET /api/wfs/roads?sortBy=name
```

Descending:

```text
GET /api/wfs/roads?sortBy=name%20D
```

Sorting can be combined with pagination.

Example:

```text
GET /api/wfs/roads?sortBy=name%20D&count=1&startIndex=0
```

Testing confirmed that GeoServer applies the ordering before pagination.

Invalid sort formats are rejected by the validator.

---

## 11. Property Selection

Clients can request specific public properties through:

```text
propertyName
```

Example:

```text
GET /api/wfs/roads?propertyName=name
```

Multiple properties can be requested:

```text
GET /api/wfs/roads?propertyName=name,lengthMeters
```

A major architectural requirement is that public API properties are not necessarily identical to GeoServer properties.

For roads, the public API can expose:

```text
id
name
description
lengthMeters
```

For buildings:

```text
id
name
description
areaSquareMeters
perimeterMeters
```

Some of these values are enriched by the backend and repository layer rather than being supplied directly by GeoServer.

Therefore:

```text
Public propertyName
        ↓
WFS Service
        ↓
WFS Query Utility
        ↓
GeoServer-compatible properties
```

Derived properties are not forwarded blindly to GeoServer.

---

## 12. Geometry Preservation

When `propertyName` is used, the backend still requests the geometry property required to construct the resulting GeoJSON feature.

Internally:

```text
geom
```

is preserved in the GeoServer property request.

This allows queries such as:

```text
GET /api/wfs/roads?propertyName=name,lengthMeters
```

to return selected properties while preserving feature geometry.

---

## 13. Safe Attribute Filtering

Phase 3.8 introduces the public parameter:

```text
filter
```

using the format:

```text
field:value
```

Example:

```text
GET /api/wfs/roads?filter=name:Road%20A
```

The backend translates the validated filter into a GeoServer CQL expression.

Clients are **not** allowed to send arbitrary `CQL_FILTER` expressions directly.

This provides an abstraction boundary:

```text
Client filter
    ↓
Validation
    ↓
Allowed field verification
    ↓
Safe CQL construction
    ↓
GeoServer
```

Currently allowed filter fields are:

```text
id
name
description
```

Example valid request:

```text
GET /api/wfs/roads?filter=id:1
```

Example unsupported request:

```text
GET /api/wfs/roads?filter=lengthMeters:1514
```

Result:

```text
400 VALIDATION_ERROR
```

Derived properties such as `lengthMeters`, `areaSquareMeters`, and `perimeterMeters` are not currently translated into GeoServer CQL filters.

---

## 14. CQL Safety

Raw CQL is not exposed as part of the public API.

The backend:

1. Parses the public filter.
2. Validates the field.
3. Validates that a value exists.
4. Restricts filtering to explicitly allowed fields.
5. Escapes single quotes in filter values.
6. Generates the internal CQL expression.

This prevents the API from functioning as an unrestricted CQL proxy.

---

## 15. GeoServer Error Model

A dedicated `GeoServerError` provides structured operational errors.

The global `errorHandler` already supports:

```text
statusCode
code
message
```

This allows GeoServer failures to be represented consistently with the rest of the API.

### Error categories

| HTTP Status | Code                         | Meaning                                         |
| ----------- | ---------------------------- | ----------------------------------------------- |
| `502`       | `GEOSERVER_WFS_ERROR`        | GeoServer rejected or failed the WFS request    |
| `502`       | `GEOSERVER_INVALID_RESPONSE` | GeoServer returned an invalid JSON/WFS response |
| `503`       | `GEOSERVER_UNAVAILABLE`      | GeoServer could not be reached                  |
| `504`       | `GEOSERVER_TIMEOUT`          | GeoServer exceeded the configured timeout       |

Application validation errors remain separate:

```text
400 VALIDATION_ERROR
```

---

## 16. GeoServer Timeout

WFS requests use `AbortController` to prevent the backend from waiting indefinitely for GeoServer.

The timeout is configurable through:

```env
GEOSERVER_TIMEOUT=5000
```

The configuration is loaded and validated through:

```text
config/env.js
```

rather than being hardcoded inside `GeoServerService`.

The resulting flow is:

```text
.env
  ↓
GEOSERVER_TIMEOUT
  ↓
env.js validation
  ↓
env.geoserver.timeout
  ↓
GeoServerService
  ↓
AbortController
```

This allows different environments to use different timeout values without modifying application source code.

Invalid timeout configuration prevents the application from starting with an invalid operational configuration.

---

## 17. Query Parameter Whitelisting

GeoServer query parameters are built explicitly.

The application does not forward the complete `request.query` object directly to GeoServer.

Instead, supported values are selectively translated.

This prevents requests from introducing arbitrary GeoServer parameters.

The architecture therefore maintains:

```text
Public API contract
        ↓
Validation
        ↓
Controlled translation
        ↓
GeoServer WFS contract
```

---

## 18. Combined WFS Queries

The implemented query capabilities can operate together.

The final integration test included:

```text
GET /api/wfs/roads?bbox=-63.70,-22.05,-63.65,-21.98&sortBy=name%20D&count=1&startIndex=0&propertyName=name,lengthMeters
```

Result:

```text
200 OK
```

This validates the combined operation of:

```text
BBOX
+
sorting
+
pagination
+
result limiting
+
property selection
```

---

## 19. Integration Test Matrix

The final Phase 3.8 manual integration tests produced the following results.

| Request                                           | Result |
| ------------------------------------------------- | ------ |
| `/api/wfs/roads`                                  | `200`  |
| `/api/wfs/buildings`                              | `200`  |
| `/api/wfs/roads?count=1`                          | `200`  |
| `/api/wfs/roads?count=1&startIndex=1`             | `200`  |
| `/api/wfs/roads?bbox=-63.70,-22.05,-63.65,-21.98` | `200`  |
| `/api/wfs/roads?sortBy=name%20D`                  | `200`  |
| `/api/wfs/roads?propertyName=name,lengthMeters`   | `200`  |
| `/api/wfs/roads?filter=name:Road%20A`             | `200`  |
| `/api/wfs/roads?count=-1`                         | `400`  |
| `/api/wfs/roads?bbox=-63.70,-22.05`               | `400`  |
| `/api/wfs/roads?filter=lengthMeters:1514`         | `400`  |
| Combined advanced WFS query                       | `200`  |

All expected results were confirmed.

---

## 20. Files Introduced

### `errors/GeoServerError.js`

Provides structured errors for operational failures involving GeoServer.

### `utils/wfsQuery.js`

Provides reusable WFS query translation functionality, including:

* Property parsing
* GeoServer property selection
* Safe filter construction
* Public-to-GeoServer query translation

### `docs/phase-3/phase-3.8-wfs-enterprise.md`

Documents the architecture, implementation decisions, API contract, validation rules, error handling, and integration tests introduced during Phase 3.8.

---

## 21. Files Modified

Phase 3.8 modifies the responsibilities of several existing backend components.

### `controllers/wfsController.js`

Forwards validated query parameters to the WFS service.

### `services/wfsService.js`

Accepts WFS query options, translates public property requirements, preserves repository enrichment, and coordinates GeoServer queries.

### `services/geoserverService.js`

Supports advanced WFS parameters and structured GeoServer failure handling.

### `validators/wfsValidator.js`

Validates the public advanced WFS query contract.

### `config/env.js`

Adds validated GeoServer timeout configuration.

### `config/configErrors.js`

Adds the GeoServer timeout configuration error message.

---

## 22. Architectural Decisions

### GeoServer remains internal infrastructure

Clients interact with the Express API rather than directly with GeoServer.

### Layer selection belongs to the route

The public API does not require a `typeName` query parameter.

### Public properties are application properties

`propertyName` refers to the public API contract, not directly to GeoServer attributes.

### Raw CQL is not public

Clients use a controlled `filter=field:value` abstraction.

### Geometry is preserved

Property selection does not remove the geometry required by the GeoJSON response.

### Operational configuration belongs to the environment

GeoServer timeout behavior is configurable without changing application code.

### Errors are classified

Validation, upstream failures, connectivity failures, malformed responses, and timeouts have distinct error semantics.

---

## 23. Phase Result

Phase 3.8 successfully evolves the initial GeoServer integration into an advanced WFS API layer.

The backend now supports:

```text
Advanced GetFeature
        +
BBOX spatial queries
        +
Pagination
        +
Result limits
        +
Sorting
        +
Property selection
        +
Repository enrichment
        +
Safe attribute filtering
        +
Structured GeoServer errors
        +
Configurable request timeout
        +
Enterprise validation
```

The resulting architecture keeps Express as the application boundary while GeoServer remains an internal geospatial service backed by PostGIS.

---

## 24. Status

**Phase 3.8 — Advanced Enterprise WFS: COMPLETED**

All planned implementation and integration tests for this phase were completed successfully.

The backend is ready to proceed to the next Web GIS Enterprise backend phase.
