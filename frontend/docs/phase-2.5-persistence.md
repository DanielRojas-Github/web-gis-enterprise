# FASE 2.5 — Enterprise Persistence Integration

## Introducción

La **FASE 2.5 — Enterprise Persistence Integration** incorpora al proyecto **Web GIS Enterprise** una arquitectura de persistencia desacoplada, escalable y preparada para futuras integraciones con diferentes mecanismos de almacenamiento y sincronización.

Hasta esta fase, la aplicación permitía gestionar capas, herramientas GIS y operaciones de edición durante la ejecución de la sesión. Sin embargo, no existía una infraestructura que permitiera conservar el estado de la aplicación ni administrar de forma estructurada las operaciones de persistencia.

Para resolver esta necesidad se diseñó un **Persistence Engine**, responsable de coordinar el ciclo completo de una operación de persistencia sin acoplar la lógica de negocio a un mecanismo específico de almacenamiento.

La arquitectura implementada sigue principios de diseño Enterprise, aplicando patrones ampliamente utilizados en el desarrollo de software como **Repository Pattern**, **Adapter Pattern** y **Provider Pattern**. Gracias a esta separación de responsabilidades, el sistema puede incorporar nuevos proveedores de almacenamiento o nuevos mecanismos de sincronización sin modificar el núcleo de la aplicación.

Aunque en esta fase la persistencia utiliza **LocalStorage** como implementación inicial, toda la infraestructura fue diseñada para admitir futuras integraciones con tecnologías como **IndexedDB**, **GeoServer**, servicios **REST**, bases de datos remotas o estrategias de funcionamiento **Offline First**.

El resultado es una arquitectura flexible, mantenible y preparada para acompañar el crecimiento del proyecto durante las siguientes fases de desarrollo.

---

# Objetivos

La implementación de la FASE 2.5 persigue los siguientes objetivos:

* Desacoplar la lógica de persistencia del resto de la aplicación.
* Centralizar la ejecución de todas las operaciones de persistencia mediante un motor especializado.
* Permitir la incorporación de múltiples mecanismos de almacenamiento sin modificar la lógica de negocio.
* Implementar una infraestructura preparada para sincronización local y remota.
* Gestionar el ciclo de vida completo de cada operación de persistencia.
* Incorporar un sistema de cola para administrar operaciones pendientes de sincronización.
* Implementar un mecanismo de reintentos ante fallos temporales.
* Facilitar la futura integración con GeoServer, PostGIS, IndexedDB y servicios REST.
* Mantener una arquitectura modular, escalable y fácilmente extensible.

---

# Problema que resuelve

En una aplicación GIS Enterprise, las operaciones realizadas por el usuario no deberían depender directamente del mecanismo de almacenamiento utilizado.

Si los componentes de la interfaz escribieran directamente sobre LocalStorage, una base de datos o un servicio remoto, cada cambio de tecnología implicaría modificar múltiples partes del sistema, aumentando el acoplamiento y dificultando el mantenimiento.

Además, funcionalidades como la sincronización diferida, el funcionamiento sin conexión, la repetición automática de operaciones fallidas o la coexistencia de distintos proveedores de almacenamiento requieren una infraestructura capaz de administrar dichas responsabilidades de forma centralizada.

La arquitectura desarrollada durante esta fase elimina esa dependencia directa mediante una cadena de componentes especializados. Cada uno asume una única responsabilidad y delega el trabajo al siguiente nivel de la arquitectura, permitiendo que la aplicación interactúe con una interfaz uniforme independientemente del destino final de la información.
