# Phase 3.10 — WFS Layer System Integration

## 1. Objective

Integrate remote WFS layers into the existing Enterprise layer-management architecture so that WFS resources behave as normal operational layers inside the application.

The implementation must preserve the separation of responsibilities between:

* layer registry
* React UI
* layer state
* WFS loaders
* WFS services
* backend API
* renderers

React components must not directly manage WFS URLs, HTTP requests, GeoServer communication, or GeoJSON transformation.

---

## 2. Previous State

Before this phase, the frontend was already capable of requesting WFS data through the backend and transforming the resulting GeoJSON into a renderable vector layer.

The loading flow worked independently:

```text
loadWFSLayer
→ loadWFSFeatures
→ Backend API
→ GeoJSON
→ createVectorLayer
```

However, WFS layers were not yet fully integrated into the operational layer tree.

Manual loading could therefore return valid features, but the loaded resource did not yet participate naturally in:

* layer visibility
* groups
* persistence
* layer identity
* normal rendering lifecycle
* loading state
* error state

---

## 3. Architecture

The final WFS lifecycle implemented in this phase is:

```text
operationalLayers
        ↓
useLayers
        ↓
findLayerById
        ↓
loadWFSLayer
        ↓
loadWFSFeatures
        ↓
Backend /api/wfs/*
        ↓
FeatureCollection
        ↓
createVectorLayer
        ↓
UPDATE_LAYER
        ↓
VECTOR
        ↓
VectorRenderer
        ↓
Leaflet
```

The layer begins as an operational WFS configuration:

```text
type: wfs
source.layerName: roads
```

After the first successful remote load, it becomes:

```text
type: vector
source.features: FeatureCollection
```

The original layer identity is preserved.

---

## 4. Operational WFS Layers

WFS layers were registered in the operational layer catalog using the existing `createLayer()` contract.

Examples introduced during this phase include:

```text
roads-wfs
buildings-wfs
```

The WFS source stores only the information required by the loader:

```js
source: {
  layerName: 'roads',
}
```

Network URLs and backend implementation details remain outside the UI and layer registry.

WMS and WFS representations can coexist because they serve different responsibilities.

---

## 5. Layer Identity

The previous WFS loader generated identifiers dynamically using timestamps.

That behavior was removed for operational WFS layers.

The loader now receives the complete layer definition and preserves:

* `id`
* `name`
* `visible`
* `opacity`
* `zIndex`
* `metadata`

This ensures stable identity across:

* state updates
* layer groups
* persistence
* visibility changes
* remote loading

---

## 6. Vector Layer Factory

The vector layer factory was extended to accept operational layer properties while remaining independent from WFS-specific configuration.

The resulting vector source follows the standard vector contract:

```js
source: {
  features: geojson,
}
```

The WFS source configuration itself is not copied into the vector source.

---

## 7. Layer Lookup

A recursive utility was introduced:

```text
findLayerById
```

Its responsibility is to locate layers or groups anywhere in the layer tree without modifying the tree.

This complements the existing recursive update utility:

```text
updateLayerTree
```

Responsibilities therefore remain separated:

```text
findLayerById
→ read tree

updateLayerTree
→ update tree
```

---

## 8. Individual WFS Activation

`useLayers.toggleLayer()` now detects operational WFS layers.

For an unloaded WFS layer:

```text
WFS invisible
→ remote request
→ GeoJSON
→ VECTOR
→ visible
```

After the first successful load, the layer becomes a vector layer.

Subsequent visibility changes use the normal `TOGGLE_LAYER` flow and do not execute another WFS request.

This provides an in-memory cache through the layer store itself.

---

## 9. Group Activation

WFS loading was also integrated into `toggleGroup()`.

This is required because a WFS layer can become visible indirectly when its parent group is activated.

When enabling a group:

```text
group ON
→ inspect children
→ load unloaded WFS children
→ activate normal children
→ activate group
```

When disabling a group no network operation is required.

Already-loaded WFS layers are vectors and therefore do not generate another remote request when the group is re-enabled.

---

## 10. Loading State

A per-layer loading state was added:

```js
loading: false
```

The state belongs to the layer rather than to the entire layer store.

This allows multiple layers to independently represent states such as:

```text
roads-wfs
loading: true

buildings-wfs
loading: false
```

`loading` represents remote GIS data loading and remains semantically separate from:

```text
saving
```

which belongs to the persistence/synchronization subsystem.

---

## 11. Error Handling

WFS loading errors are stored directly in:

```js
layer.error
```

On failure:

```text
loading → false
error   → error message
type    → wfs
```

The original WFS configuration remains intact so the user can retry the operation.

On a successful retry:

```text
error   → null
loading → false
type    → vector
```

---

## 12. Layer UI Status

`LayerItem` now distinguishes between the following states:

```text
error
loading
saving
dirty
saved
```

Priority:

```text
error
→ loading
→ saving
→ dirty
→ saved
```

WFS loading displays a loading status while errors are represented with a warning icon and tooltip.

This avoids mixing remote data loading with persistence state.

---

## 13. Functional Tests

### Roads WFS

Verified:

```text
roads-wfs
→ request /api/wfs/roads
→ FeatureCollection
→ rendered correctly
```

After the first successful request:

```text
ON
→ OFF
→ ON
→ OFF
→ ON
```

did not generate additional WFS requests.

---

### Buildings WFS

Verified:

```text
buildings-wfs
→ request /api/wfs/buildings
→ polygon FeatureCollection
→ rendered correctly
```

This confirmed that the implementation is not specific to LineString geometries.

---

### Group Activation

Verified with the Transportation group:

```text
Transportation ON
→ roads-wfs loaded
→ roads WMS visible
→ roads WFS visible
```

Repeated group activation did not generate duplicate backend requests.

---

### Error Test

A controlled invalid WFS `layerName` was configured.

Verified:

```text
request fails
→ loading false
→ error stored in layer
→ warning icon displayed
→ WFS configuration preserved
```

After restoring the correct `layerName`, the layer loaded successfully.

---

## 14. Architectural Decisions

### React does not perform remote GIS loading

React components only request layer operations through the layer hooks.

### Reducer remains pure

No HTTP or asynchronous behavior was introduced into `layerReducer`.

### No new reducer action was required

The existing:

```text
UPDATE_LAYER
```

action was sufficient for replacing an unloaded WFS definition with its loaded vector representation.

### Stable operational IDs

Loaded WFS resources preserve their original operational IDs.

### Store-based reuse

Once loaded, WFS features remain attached to the vector layer and are reused when visibility changes.

---

## 15. Known Technical Debt

The following improvements are intentionally outside the scope of Phase 3.10:

* recursive group activation for deeply nested groups
* possible cleanup of legacy global `loadingLayers`
* possible cleanup of legacy global `layerErrors`
* review of `SET_LAYER_ERROR` versus per-layer `error`
* GeoServer WMS URLs currently hardcoded in parts of the operational layer registry
* possible concurrent loading optimization using `Promise.all`
* existing lint warning related to the `LayerGroup` effect dependency

These items should be handled in a dedicated hardening/refactoring phase rather than mixed into the WFS integration.

---

## 16. Result

Phase 3.10 completes the integration of WFS resources with the Enterprise layer-management architecture.

WFS layers now participate in the same operational lifecycle as the rest of the GIS layer system while preserving separation between:

```text
configuration
state
remote loading
backend communication
rendering
persistence
UI
```

The frontend can now load, render, hide, restore, group, retry, and reuse remote WFS layers through the normal layer-management workflow.
