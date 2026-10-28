# Phase 3.11 — Layer/WFS Hardening & Technical Debt

**Status:** Historical phase record; final completion status requires reconciliation with subsequent commits and validation evidence
**Area:** Frontend GIS architecture, layer management, drawing, interactions and persistence

## 1. Objective

Harden the existing layer and WFS integration, improve consistency across GIS components, and address technical debt discovered during implementation and functional testing.

This phase builds on the WFS integration completed in Phases 3.7–3.10. It does not introduce a new mapping stack or replace the existing state-management and persistence architecture.

## 2. Scope

### 2.1 Layer management and WFS

- Review layer schema and operational layer definitions.
- Separate layer types from data source types.
- Maintain WFS source metadata and layer loading behavior.
- Improve vector layer creation and group handling.
- Maintain integration with the existing layer state and rendering pipeline.

### 2.2 Rendering and map interactions

- Consolidate map layer rendering.
- Review tile, WMS and generic layer renderers.
- Improve map interaction handling.
- Remove obsolete interaction, selection, popup and rendering modules where their removal is intentional and verified.

### 2.3 Drawing and editing

- Consolidate rendering of saved geometries.
- Maintain provisional point, polyline and polygon rendering.
- Support feature selection and vertex editing.
- Validate minimum geometry requirements before saving.
- Persist created and updated features through the existing feature storage service.

### 2.4 State management and persistence

- Review GIS and layer actions, initial states and reducers.
- Maintain repository-based persistence and synchronization integration.
- Preserve the existing architecture and avoid introducing unnecessary state-management or data-fetching dependencies.

## 3. Implementation notes

The reviewed drawing implementation includes:

- Listener notification centralization in `drawStore`.
- Immutable updates to the feature collection.
- A single iteration over saved geometries in `DrawOverlay`.
- Minimum vertex checks for polylines and polygons.
- Selection styling for supported geometries.
- Drawing-state reset after successful creation.

The layer implementation includes changes to the schema, source types, operational layers, vector factory, WFS loader and layer-management logic.

These notes describe the implementation visible in the reviewed changes; they do not imply that every modified file has received an independent final audit.

## 4. Validation

The developer reported the following successful checks:

- Backend startup and database connection.
- Frontend map loading.
- WMS layer activation and rendering.
- WFS Roads and Buildings activation and rendering.
- Point, polyline and polygon drawing.
- Frontend production build.
- Frontend lint.

The functional checks and build/lint checks were reported as completed during the development session.

## 5. Outstanding verification

Before marking the phase complete:

- Confirm that all staged modifications and deletions are intentional.
- Confirm that obsolete modules have no remaining imports or references.
- Review the scope of changes to `docs/phases/phase-2.6-persistence.md`.
- Record any unresolved persistence inconsistencies as technical debt rather than silently treating them as fixed.
- Confirm the final staged diff before committing.

## 6. Completion criteria

The phase may be marked complete once:

1. The intended changes are identified and preserved.
2. Required validation has passed.
3. Documentation accurately reflects the implemented work.
4. The final staged diff contains only the changes intended for this phase.
5. A commit has been created successfully.

## 7. Git record

At the time this note was written, final staging and commit verification were pending. Subsequent project history includes commits `a08fa03` and `fb669fd`; the latter changes persistence and layer state behavior. This document is retained as a historical scope note and must not be used as the current completion status for those later changes.

**Current phase status:** Requires reconciliation against the relevant commits and validation evidence. The production-readiness roadmap is maintained in [`docs/plan-recuperacion-rectificacion-produccion.md`](../../../docs/plan-recuperacion-rectificacion-produccion.md).
