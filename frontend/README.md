# Web GIS Enterprise — Frontend

## Descripción

**Web GIS Enterprise** es una aplicación web desarrollada con una arquitectura Enterprise para la visualización, gestión y edición de información geoespacial.

El proyecto está diseñado bajo principios de escalabilidad, mantenibilidad y separación de responsabilidades, permitiendo la incorporación de nuevas funcionalidades GIS sin afectar la arquitectura existente.

Actualmente el desarrollo se centra en la construcción del frontend utilizando React y Leaflet, preparado para integrarse posteriormente con servicios de GeoServer, PostGIS y un backend basado en Node.js.

---

# Objetivos

* Construir una plataforma GIS moderna y escalable.
* Implementar una arquitectura Enterprise basada en componentes desacoplados.
* Facilitar la integración con servicios OGC (WMS, WFS y WFS-T).
* Proporcionar herramientas avanzadas de edición y análisis espacial.
* Preparar la aplicación para funcionamiento online y offline mediante un sistema de persistencia y sincronización.

---

# Tecnologías

## Frontend

* React
* Vite
* JavaScript (ES Modules)
* Leaflet
* CSS

## Arquitectura

* Context API
* Repository Pattern
* Adapter Pattern
* Provider Pattern

## Persistencia

* LocalStorage
* Enterprise Persistence Engine
* Sync Queue
* Retry Engine
* Operation Lifecycle

---

# Características implementadas

## Arquitectura

* Arquitectura Enterprise para aplicaciones GIS.
* Organización modular del código.
* Separación por dominios funcionales.
* Sistema de herramientas extensible.
* Gestión centralizada del estado GIS.

## Gestión de capas

* Visualización de capas.
* Control de visibilidad.
* Control de opacidad.
* Ordenamiento de capas.
* Soporte para grupos de capas.

## Herramientas GIS

* Measure Tool.
* Identify Tool.
* Draw Tool.
* Feature Editing.
* Feature Selection.

## Persistencia

* Motor de persistencia desacoplado.
* Sistema de operaciones sincronizables.
* Cola de sincronización.
* Reintentos automáticos.
* Persistencia local mediante LocalStorage.
* Arquitectura preparada para futuros adaptadores (GeoServer, IndexedDB, REST, entre otros).

---

# Estado del proyecto

El proyecto se encuentra en desarrollo activo.

Fases completadas:

* ✔ Fase 0 — Preparación del proyecto
* ✔ Fase 1 — Arquitectura Frontend Enterprise
* ✔ Fase 1.6 — Arquitectura GIS State
* ✔ Fase 2.5 — Enterprise Persistence Integration

Próxima fase:

* Fase 2.6

---

# Instalación

## Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

## Instalar dependencias

```bash
npm install
```

## Ejecutar el proyecto

```bash
npm run dev
```

---

# Arquitectura

El proyecto sigue una arquitectura Enterprise basada en responsabilidades claramente definidas.

```text
React
   │
   ▼
GIS Core
   │
   ▼
Tools
   │
   ▼
Persistence Engine
   │
   ▼
Repositories
   │
   ▼
Providers
```

Esta estructura permite extender el sistema sin modificar los componentes existentes, favoreciendo la mantenibilidad y la escalabilidad.

---

# Roadmap

* Documentación técnica del proyecto.
* Integración con GeoServer.
* Integración con PostGIS.
* Sincronización remota.
* Autenticación y autorización.
* Backend Enterprise.
* Dockerización completa.
* Despliegue en la nube.

---

# Estado

Proyecto en desarrollo con fines de aprendizaje, investigación y construcción de una arquitectura GIS Enterprise moderna.
