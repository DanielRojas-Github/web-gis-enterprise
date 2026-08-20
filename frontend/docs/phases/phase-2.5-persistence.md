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

---

# Arquitectura general

La arquitectura de persistencia implementada en esta fase sigue una estructura por capas donde cada componente tiene una responsabilidad claramente definida.

El objetivo principal es desacoplar la lógica de negocio del mecanismo de almacenamiento, permitiendo sustituir o incorporar nuevas tecnologías de persistencia sin modificar el resto del sistema.

El flujo de una operación comienza cuando la aplicación solicita crear, actualizar o eliminar información persistente. A partir de ese momento, la solicitud atraviesa una serie de componentes especializados, cada uno responsable de una parte específica del proceso.

La arquitectura implementada es la siguiente:

```text
Application
      │
      ▼
PersistenceEngine
      │
      ▼
OperationExecutor
      │
      ▼
PersistenceService
      │
      ▼
AdapterFactory
      │
      ▼
LocalSyncAdapter
      │
      ▼
RepositoryFactory
      │
      ▼
LayerRepository
      │
      ▼
LocalStorageProvider
      │
      ▼
LocalStorage
```

Cada nivel conoce únicamente la responsabilidad inmediata del siguiente componente, evitando dependencias innecesarias y manteniendo una arquitectura altamente desacoplada.

---

# Flujo completo de una operación

Cuando un componente de la aplicación necesita persistir información, no interactúa directamente con LocalStorage ni con ningún otro mecanismo de almacenamiento.

En su lugar, delega la operación al **Persistence Engine**, que coordina todo el proceso.

El flujo completo es el siguiente:

## 1. Inicio de la operación

La aplicación solicita una operación de persistencia (crear, actualizar o eliminar).

El Persistence Engine recibe la solicitud y construye un objeto `SyncOperation`, que contiene toda la información necesaria para ejecutar la operación.

---

## 2. Gestión del ciclo de vida

Antes de ejecutar la operación, el sistema registra su estado inicial.

Durante su ejecución la operación puede pasar por distintos estados, por ejemplo:

* Pendiente.
* En procesamiento.
* Completada correctamente.
* Fallida.

Este seguimiento permite controlar el estado de cada operación y facilita futuras estrategias de sincronización.

---

## 3. Ejecución

El `OperationExecutor` recibe la operación y determina cuál es la acción que debe ejecutarse.

En esta etapa todavía no existe ningún conocimiento sobre LocalStorage, GeoServer o cualquier otro proveedor.

Su única responsabilidad consiste en coordinar la ejecución.

---

## 4. Servicio de persistencia

El `PersistenceService` actúa como punto central de acceso para todas las operaciones de persistencia.

Según el tipo de operación recibida, delega el trabajo al adaptador correspondiente.

Esto permite mantener una interfaz única para toda la aplicación.

---

## 5. Selección del adaptador

El `AdapterFactory` selecciona el adaptador adecuado.

En esta fase únicamente existe:

* LocalSyncAdapter

Sin embargo, la arquitectura permite registrar nuevos adaptadores sin modificar el resto del sistema.

Por ejemplo:

* GeoServerSyncAdapter
* IndexedDBSyncAdapter
* RestSyncAdapter

---

## 6. Adaptador

El adaptador traduce la operación genérica a un mecanismo concreto de persistencia.

En el caso del `LocalSyncAdapter`, la operación es delegada al repositorio correspondiente.

El adaptador conoce cómo trabajar con un determinado entorno, pero desconoce la lógica de negocio de la aplicación.

---

## 7. Repositorio

El `RepositoryFactory` proporciona el repositorio adecuado.

Actualmente se utiliza:

* LayerRepository

En fases posteriores podrán añadirse nuevos repositorios, por ejemplo:

* FeatureRepository
* ProjectRepository
* UserRepository

Cada repositorio encapsula completamente el acceso a un dominio específico de datos.

---

## 8. Provider

Finalmente, el repositorio utiliza un Provider para interactuar con el mecanismo físico de almacenamiento.

En esta fase el proveedor implementado es:

* LocalStorageProvider

Su responsabilidad consiste únicamente en leer y escribir información utilizando la API correspondiente.

Gracias a esta separación, el repositorio nunca necesita conocer detalles de implementación del almacenamiento.

---

## Resultado del flujo

Una vez finalizada la operación, el resultado es devuelto siguiendo el mismo camino hasta el componente que inició la solicitud.

Durante todo el proceso, ningún componente depende directamente del mecanismo físico de almacenamiento, permitiendo reemplazar o ampliar la infraestructura de persistencia sin modificar la lógica de negocio de la aplicación.

---

# Componentes principales

La arquitectura de persistencia está formada por un conjunto de componentes especializados. Cada uno posee una única responsabilidad y colabora con los demás siguiendo el principio de **Responsabilidad Única (Single Responsibility Principle - SRP)**.

Esta separación permite que cada componente evolucione de forma independiente sin afectar al resto del sistema.

---

## PersistenceEngine

El **PersistenceEngine** representa el punto de entrada de toda la infraestructura de persistencia.

Su responsabilidad consiste en coordinar el ciclo completo de una operación de persistencia, desde que la aplicación solicita una acción hasta que se obtiene el resultado final.

Entre sus funciones principales se encuentran:

* Recibir solicitudes de persistencia.
* Crear o gestionar objetos `SyncOperation`.
* Enviar operaciones al `OperationExecutor`.
* Integrarse con la cola de sincronización (`SyncQueue`).
* Coordinar el funcionamiento del `PersistenceScheduler`.

El motor no conoce cómo se almacenan los datos ni qué tecnología será utilizada para persistirlos.

Su única función es orquestar el flujo de trabajo.

---

## OperationExecutor

El **OperationExecutor** es responsable de ejecutar una operación concreta.

Recibe un objeto `SyncOperation` y determina cuál es la acción que debe realizarse según el tipo de operación:

* Create
* Update
* Delete

Una vez identificada la operación, delega la ejecución al `PersistenceService`.

El ejecutor no conoce detalles de almacenamiento ni de sincronización; únicamente coordina la ejecución de la operación solicitada.

---

## PersistenceService

El **PersistenceService** constituye la capa de acceso unificada para todas las operaciones de persistencia.

Su responsabilidad consiste en abstraer completamente la interacción con los distintos mecanismos de almacenamiento.

Para ello:

* recibe la operación solicitada;
* identifica el adaptador correspondiente;
* delega la ejecución al adaptador adecuado;
* devuelve el resultado obtenido.

Gracias a esta capa, el resto de la aplicación nunca necesita conocer qué proveedor de almacenamiento está siendo utilizado.

---

## AdapterFactory

El **AdapterFactory** implementa el patrón **Factory**, proporcionando el adaptador apropiado para cada operación.

Actualmente la arquitectura dispone de un único adaptador:

* LocalSyncAdapter

Sin embargo, el diseño permite registrar nuevos adaptadores sin modificar el código existente.

Ejemplos de futuras implementaciones:

* GeoServerSyncAdapter
* IndexedDBSyncAdapter
* RestSyncAdapter

Esta estrategia facilita la incorporación de nuevos mecanismos de sincronización manteniendo el principio **Open/Closed (OCP)**.

---

## LocalSyncAdapter

El **LocalSyncAdapter** implementa la lógica necesaria para trabajar con el almacenamiento local.

Su responsabilidad consiste en traducir una operación genérica de persistencia hacia las operaciones específicas del repositorio correspondiente.

El adaptador:

* obtiene el repositorio adecuado;
* invoca la operación solicitada;
* devuelve un resultado estandarizado.

De esta manera, la lógica de sincronización permanece completamente desacoplada del almacenamiento físico.

---

## RepositoryFactory

El **RepositoryFactory** centraliza la creación y obtención de repositorios.

Cada dominio funcional de la aplicación puede disponer de su propio repositorio especializado.

Durante esta fase se implementó:

* LayerRepository

La arquitectura permite incorporar nuevos repositorios sin modificar los componentes superiores.

Ejemplos:

* FeatureRepository
* ProjectRepository
* UserRepository

El uso de una fábrica evita dependencias directas entre los adaptadores y las implementaciones concretas de los repositorios.

---

## LayerRepository

El **LayerRepository** encapsula toda la lógica relacionada con la persistencia de capas.

Su responsabilidad consiste en ofrecer una interfaz de alto nivel para operaciones como:

* crear;
* actualizar;
* consultar;
* eliminar.

El repositorio no conoce cómo se almacenan físicamente los datos.

Simplemente delega dichas operaciones al proveedor correspondiente.

Esta separación permite sustituir el mecanismo de almacenamiento sin modificar la lógica del repositorio.

---

## LocalStorageProvider

El **LocalStorageProvider** constituye la capa más cercana al mecanismo físico de almacenamiento.

Su responsabilidad consiste exclusivamente en interactuar con la API de `LocalStorage`.

Entre sus funciones se encuentran:

* almacenar información;
* recuperar información;
* actualizar registros;
* eliminar registros.

Ningún componente superior interactúa directamente con `LocalStorage`, garantizando un bajo nivel de acoplamiento y facilitando la sustitución futura por otros proveedores de almacenamiento.

---

# Relación entre los componentes

Cada componente conoce únicamente la responsabilidad inmediata del siguiente nivel de la arquitectura.

La cadena completa de dependencias queda representada de la siguiente forma:

```text
PersistenceEngine
        │
        ▼
OperationExecutor
        │
        ▼
PersistenceService
        │
        ▼
AdapterFactory
        │
        ▼
LocalSyncAdapter
        │
        ▼
RepositoryFactory
        │
        ▼
LayerRepository
        │
        ▼
LocalStorageProvider
        │
        ▼
LocalStorage
```

Esta organización mantiene una clara separación de responsabilidades, favorece la reutilización de componentes y simplifica la incorporación de nuevas tecnologías de persistencia sin alterar el funcionamiento del resto de la aplicación.

---

# Modelos de persistencia

La infraestructura implementada utiliza modelos que representan las operaciones y los resultados de la persistencia. Estos modelos permiten estandarizar la comunicación entre los distintos componentes de la arquitectura.

## SyncOperation

El modelo `SyncOperation` representa una operación de persistencia independiente.

Cada instancia contiene toda la información necesaria para que una operación pueda ejecutarse, supervisarse y, si fuera necesario, reintentarse posteriormente.

Entre la información que almacena se encuentra:

* Identificador único de la operación.
* Tipo de operación (Create, Update o Delete).
* Adaptador responsable de ejecutarla.
* Repositorio destino.
* Datos asociados a la operación.
* Estado actual.
* Número de reintentos realizados.
* Fecha de creación.

Al encapsular todos estos datos en un único objeto, el sistema puede transportar una operación completa a través de toda la arquitectura sin perder información.

---

## PersistenceResult

El modelo `PersistenceResult` representa el resultado devuelto por cualquier operación de persistencia.

Su propósito es ofrecer una respuesta uniforme independientemente del mecanismo de almacenamiento utilizado.

Generalmente contiene información como:

* Estado de la operación.
* Mensaje descriptivo.
* Datos devueltos por la operación.
* Información de errores cuando corresponda.

Gracias a este modelo, todos los adaptadores y repositorios responden utilizando un formato consistente.

---

# Gestión del ciclo de vida de una operación

Cada operación de persistencia atraviesa un conjunto de estados claramente definidos.

La gestión de estos estados es responsabilidad del `OperationLifecycle`.

Durante su ejecución, una operación puede evolucionar de la siguiente manera:

```text
PENDING
    │
    ▼
PROCESSING
    │
    ├──────────────► SUCCESS
    │
    └──────────────► FAILED
                          │
                          ▼
                    RetryEngine
                          │
                          ▼
                    PROCESSING
```

Esta estrategia proporciona una visión completa del estado de cada operación y constituye la base para futuras funcionalidades de sincronización remota y funcionamiento offline.

---

## Estados principales

### Pending

La operación ha sido creada pero todavía no ha comenzado su ejecución.

---

### Processing

La operación se encuentra siendo ejecutada por la infraestructura de persistencia.

---

### Success

La operación finalizó correctamente y no requiere nuevas acciones.

---

### Failed

La operación produjo un error durante su ejecución.

Dependiendo del tipo de error, podrá volver a intentarse automáticamente mediante el `RetryEngine`.

---

# SyncQueue

La `SyncQueue` constituye la cola central de operaciones pendientes.

Su responsabilidad consiste en administrar las operaciones que todavía no han sido ejecutadas o que requieren un nuevo intento.

Separar las operaciones de la ejecución permite:

* controlar el orden de procesamiento;
* preparar la arquitectura para sincronización asíncrona;
* facilitar el funcionamiento sin conexión;
* desacoplar la creación de operaciones de su ejecución.

Actualmente la cola trabaja con persistencia local, pero su diseño admite futuras implementaciones distribuidas.

---

# RetryEngine

El `RetryEngine` administra la repetición automática de operaciones que no pudieron completarse correctamente.

Su función principal consiste en evitar que fallos temporales provoquen la pérdida definitiva de información.

Entre los escenarios contemplados se encuentran:

* pérdida temporal de conectividad;
* indisponibilidad de un servicio remoto;
* errores transitorios durante la sincronización.

Cada nuevo intento actualiza el estado de la operación mediante el `OperationLifecycle`, permitiendo un seguimiento completo de todo el proceso.

---

# Patrones de diseño utilizados

La infraestructura desarrollada durante esta fase aplica varios patrones ampliamente utilizados en arquitecturas Enterprise.

## Repository Pattern

Cada dominio funcional accede a sus datos mediante un repositorio especializado.

Esto desacopla completamente la lógica de negocio del mecanismo de almacenamiento.

---

## Adapter Pattern

Los adaptadores traducen las operaciones genéricas hacia implementaciones concretas.

Gracias a ello es posible incorporar nuevos mecanismos de persistencia sin modificar el resto del sistema.

---

## Provider Pattern

Los proveedores encapsulan el acceso a las tecnologías físicas de almacenamiento.

Actualmente se implementa `LocalStorageProvider`, pero podrán añadirse nuevos proveedores en fases posteriores.

---

## Factory Pattern

Las fábricas (`AdapterFactory` y `RepositoryFactory`) centralizan la creación y obtención de componentes.

Esto evita dependencias directas y facilita la incorporación de nuevas implementaciones.

---

# Principios SOLID aplicados

La arquitectura también incorpora varios principios SOLID:

* **Single Responsibility Principle (SRP):** cada componente posee una única responsabilidad.
* **Open/Closed Principle (OCP):** la arquitectura está preparada para extenderse sin modificar el código existente.
* **Dependency Inversion Principle (DIP):** los componentes dependen de abstracciones y no de implementaciones concretas.

La aplicación sistemática de estos principios facilita el mantenimiento del proyecto conforme aumenta su complejidad.

---

# Escalabilidad futura

La infraestructura diseñada durante esta fase constituye la base para futuras funcionalidades del proyecto.

Entre las extensiones previstas se encuentran:

* sincronización con GeoServer;
* persistencia mediante IndexedDB;
* integración con servicios REST;
* sincronización diferida;
* funcionamiento Offline First;
* resolución de conflictos;
* sincronización bidireccional;
* incorporación de nuevos repositorios y proveedores.

Gracias al diseño desacoplado, estas funcionalidades podrán añadirse sin modificar la arquitectura central de persistencia.

---

# Resultado de la fase

La FASE 2.5 representa un punto de inflexión dentro del proyecto **Web GIS Enterprise**.

A partir de esta implementación, la aplicación dispone de una infraestructura de persistencia robusta, modular y preparada para evolucionar junto con el resto del sistema.

Más allá de proporcionar persistencia local, esta fase establece los cimientos necesarios para soportar escenarios de sincronización complejos, múltiples tecnologías de almacenamiento y futuras capacidades de funcionamiento distribuido.

La arquitectura obtenida cumple los objetivos planteados al inicio de la fase y proporciona una base sólida para el desarrollo de las siguientes etapas del proyecto.
