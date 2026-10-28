# Fase 2.6 — Persistence Engine

## 1. Objetivo

La Fase 2.6 tiene como objetivo implementar y consolidar el **motor de persistencia del sistema GIS**, proporcionando una infraestructura desacoplada y extensible para gestionar operaciones de persistencia y sincronización.

La arquitectura permite separar las responsabilidades de:

* Gestión de operaciones.
* Cola de sincronización.
* Ciclo de vida de las operaciones.
* Reintentos.
* Ejecución.
* Adaptación hacia diferentes mecanismos de sincronización.
* Acceso mediante repositorios.
* Acceso al almacenamiento físico.

La implementación actual utiliza `localStorage` como mecanismo de persistencia local, manteniendo una arquitectura preparada para futuras implementaciones de almacenamiento y sincronización con servicios externos como GeoServer.

---

## 2. Alcance

Durante esta fase se consolidó la infraestructura de persistencia iniciada en la fase anterior.

El flujo principal queda estructurado de la siguiente manera:

```text
Persistence Engine
        │
        ▼
Operation Executor
        │
        ▼
Synchronization Adapter
        │
        ▼
Repository
        │
        ▼
Storage Provider
        │
        ▼
LocalStorage
```

Esta separación permite que las capas superiores de la aplicación no dependan directamente de la tecnología utilizada para almacenar los datos.

---

## 3. Arquitectura

La arquitectura de persistencia está organizada mediante diferentes patrones y responsabilidades.

```text
┌─────────────────────────────┐
│     Persistence Engine      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      OperationExecutor      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│    Synchronization Adapter  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        Repository           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Storage Provider       │
└──────────────┬──────────────┘
               │
               ▼
        ┌─────────────┐
        │ localStorage│
        └─────────────┘
```

---

## 4. Componentes principales

### 4.1 Persistence Engine

El motor de persistencia coordina las operaciones necesarias para mantener el estado persistente del sistema GIS.

Su responsabilidad es proporcionar el punto de entrada para las operaciones relacionadas con persistencia y sincronización.

---

### 4.2 SyncQueue

La cola de sincronización permite registrar operaciones pendientes de ejecución.

Las operaciones se procesan de manera controlada evitando que la lógica de negocio tenga que gestionar directamente la ejecución de cada operación.

Conceptualmente:

```text
Operation
    ↓
SyncQueue
    ↓
OperationExecutor
```

---

### 4.3 SyncOperation

Las operaciones de sincronización representan una acción persistente que debe ser ejecutada.

Una operación contiene información necesaria para identificar:

* La operación.
* El tipo de acción.
* El repositorio.
* Los datos asociados.
* El adaptador utilizado.
* El estado de ejecución.
* Los reintentos.

Los estados del ciclo de vida permiten controlar la evolución de cada operación.

---

### 4.4 OperationLifecycle

El ciclo de vida de una operación permite controlar sus diferentes estados.

El flujo general es:

```text
PENDING
   ↓
PROCESSING
   ↓
SUCCESS
```

En caso de error:

```text
PENDING
   ↓
PROCESSING
   ↓
FAILED
```

Durante el procesamiento también se registra el número de reintentos realizados.

---

### 4.5 RetryEngine

El `RetryEngine` proporciona la infraestructura necesaria para volver a ejecutar operaciones que no pudieron completarse correctamente.

Esto permite separar la lógica de reintento de la lógica específica de persistencia.

---

### 4.6 PersistenceScheduler

`PersistenceScheduler` mantiene el estado de ejecución del sistema de persistencia y permite controlar si el motor está activo o si ya existe una operación en procesamiento.

Sus responsabilidades principales son:

- Mantener el estado de ejecución mediante `start()` y `stop()`.
- Indicar si el scheduler está activo mediante `isRunning()`.
- Controlar el estado de procesamiento mediante `startProcessing()` y `finishProcessing()`.
- Permitir que `PersistenceEngine` compruebe si puede iniciar el procesamiento de otra operación.

El scheduler no consume la cola ni ejecuta operaciones de forma independiente. `PersistenceEngine` consulta periódicamente `SyncQueue`, verifica las condiciones de procesamiento y delega la ejecución en `OperationExecutor`.

Esta separación permite centralizar el control del procesamiento. Sin embargo, el ciclo de inicio y detención del motor debe validarse en escenarios de reinicialización para garantizar una gestión correcta del temporizador y de la suscripción al estado de red.

---

## 5. Repository Pattern

El acceso a los datos persistentes se organiza mediante el patrón **Repository**, que separa las operaciones de acceso a datos de los componentes que las solicitan.

Para las capas GIS se utiliza `LayerRepository`, que trabaja con la clave `gis-layer-state` a través de `LocalStorageProvider`.

Aunque el repositorio expone los métodos `create()`, `update()`, `find()`, `findAll()` y `delete()`, su comportamiento actual tiene limitaciones:

- `create()` y `update()` guardan el valor recibido bajo una misma clave; no administran individualmente cada capa.
- `find()` devuelve el contenido almacenado, sin filtrar por el identificador solicitado.
- `findAll()` recupera el contenido completo de la clave.
- `delete()` elimina la clave completa, no una capa individual.

Por tanto, estos métodos constituyen una interfaz de repositorio, pero todavía no ofrecen operaciones CRUD completas por entidad.

`FeatureRepository` también presenta una implementación parcial: `create()` no persiste la entidad, `find()` devuelve `null` y `delete()` limpia el conjunto de features almacenado. Estas limitaciones deben tenerse en cuenta antes de ampliar el uso de persistencia de entidades.

## 6. Adapter Pattern

El patrón **Adapter** desacopla las operaciones de persistencia del mecanismo que las ejecuta.

La infraestructura contiene un contrato base `SyncAdapter` y una `AdapterFactory` que registra adaptadores locales y de GeoServer.

### LocalSyncAdapter

`LocalSyncAdapter` delega las operaciones al repositorio correspondiente mediante `RepositoryFactory`. Si el repositorio no lanza una excepción, el adaptador devuelve un resultado de éxito. Actualmente no comprueba si el repositorio realmente persistió los datos; por ello, el resultado no garantiza por sí solo la persistencia efectiva.

### GeoServerSyncAdapter

`GeoServerSyncAdapter` existe como implementación preliminar, pero sus operaciones actuales registran información y devuelven resultados simulados. No realizan todavía solicitudes HTTP ni una sincronización real con GeoServer.

La integración WMS/WFS del proyecto es independiente de este adaptador y no debe confundirse con una sincronización remota ejecutada por el motor de persistencia.

## 7. Provider Pattern

El patrón Provider abstrae el mecanismo físico de almacenamiento.

El contrato base se encuentra en:

```text
src/gis/services/persistence/providers/BaseStorageProvider.js
```

Define las operaciones:

```text
create(key, data)
update(key, data)
delete(key)
load(key)
```

La implementación actual es:

```text
LocalStorageProvider
```

Su responsabilidad es comunicarse directamente con `localStorage`.

Esto permite mantener la siguiente separación:

```text
Repository
    ↓
Storage Provider
    ↓
Storage technology
```

El repositorio, por tanto, no necesita conocer los detalles específicos de `localStorage`.

---

## 8. LocalStorageProvider

El proveedor local implementa el contrato definido por `BaseStorageProvider`.

Las operaciones principales son:

```text
create()
    ↓
localStorage.setItem()

update()
    ↓
localStorage.setItem()

delete()
    ↓
localStorage.removeItem()

load()
    ↓
localStorage.getItem()
    ↓
JSON.parse()
```

El almacenamiento utiliza serialización JSON para conservar el estado de las entidades persistidas.

---

## 9. Factory Pattern

La arquitectura utiliza factories para desacoplar la creación y selección de implementaciones.

Entre ellas se encuentran:

```text
RepositoryFactory
AdapterFactory
```

### RepositoryFactory

Permite registrar y recuperar repositorios sin que los consumidores necesiten conocer directamente sus implementaciones concretas.

### AdapterFactory

Permite seleccionar el adaptador correspondiente según el tipo de sincronización solicitado.

Esto facilita la incorporación futura de nuevos adaptadores.

---


## 10. Flujo de una operación

El procesamiento de una operación de persistencia sigue este flujo general:

```text
1. Se crea una SyncOperation
            ↓
2. La operación se agrega a SyncQueue
            ↓
3. PersistenceEngine solicita el procesamiento
            ↓
4. Se comprueba la disponibilidad de la red,
   el estado de la cola y el scheduler
            ↓
5. OperationExecutor identifica la acción
   (CREATE, UPDATE o DELETE)
            ↓
6. PersistenceService selecciona el adapter
            ↓
7. El adapter delega en el repository
   o mecanismo de almacenamiento correspondiente
            ↓
8. PersistenceEngine gestiona el resultado,
   el ciclo de vida y los posibles reintentos
```

`PersistenceEngine` consulta periódicamente la cola y también puede intentar procesar una operación cuando se detecta que la conexión vuelve a estar disponible.

`PersistenceScheduler` mantiene el estado de ejecución y procesamiento. No ejecuta por sí mismo las operaciones: el motor coordina su procesamiento y delega la acción en `OperationExecutor`.

Cuando una operación falla, el motor evalúa si corresponde reintentarla o registrar un fallo definitivo, de acuerdo con la lógica de ciclo de vida y reintentos implementada.

Este flujo describe la arquitectura prevista por el código actual. No garantiza que todos los repositorios implementen correctamente las operaciones CRUD ni que exista sincronización remota efectiva.

## 11. Persistencia actual

La persistencia local utiliza `localStorage` en diferentes flujos.

- **Estado de capas:** `LayerRepository` utiliza la clave `gis-layer-state` mediante `LocalStorageProvider`.
- **Features dibujadas:** el servicio `featureStorageService` utiliza la clave `gis_features`.

Estos mecanismos almacenan datos serializados en JSON. Las operaciones que escriben bajo una clave reemplazan su contenido anterior; no constituyen automáticamente un almacenamiento por entidad.

La infraestructura incluye una cola de operaciones, ciclo de vida, reintentos y selección de adaptadores. Sin embargo, la existencia de estas abstracciones no garantiza que cada operación CRUD se complete correctamente ni que los datos se sincronicen con un servidor remoto.

`localStorage` es el almacenamiento activo de los flujos descritos aquí. La presencia de otros providers en el código no implica que estén integrados en este flujo.

## 12. Ventajas arquitectónicas

La implementación proporciona varias ventajas para la evolución del proyecto.

### Desacoplamiento

Las capas superiores no dependen directamente de `localStorage`.

### Extensibilidad

La arquitectura define abstracciones que pueden facilitar la incorporación de nuevos mecanismos de almacenamiento.

Sin embargo, los repositorios actuales seleccionan directamente sus providers. Por ello, incorporar otro mecanismo de almacenamiento puede requerir modificaciones en los repositorios, además de implementar y registrar el nuevo provider.

La sustitución de providers sin modificar los repositorios queda como una mejora arquitectónica pendiente.

### Intercambio de adaptadores

Los mecanismos de sincronización pueden cambiarse mediante adapters.

### Control de operaciones

Las operaciones tienen estados y ciclos de vida definidos.

### Reintentos

Las operaciones fallidas pueden ser procesadas mediante un mecanismo de retry.

### Procesamiento controlado

La cola y el scheduler permiten controlar la ejecución de operaciones pendientes.

### Preparación para backend

La arquitectura permite evolucionar desde persistencia local hacia persistencia y sincronización remota.

---

## 13. Pruebas

El proyecto incluye la utilidad de desarrollo `src/gis/services/persistence/dev/persistenceIntegrationTest.js` para explorar el flujo de operaciones de persistencia.

La utilidad crea una operación de sincronización, la incorpora a la cola y registra información de su estado. También incluye una función que solicita la ejecución de la sincronización y registra el tamaño de la cola antes y después.

Esta utilidad es una comprobación exploratoria del flujo, no una suite automatizada con aserciones. Por sí sola no demuestra que los datos se hayan guardado correctamente en `localStorage`, ni que las operaciones CRUD funcionen por entidad.

La validación pendiente debe incluir pruebas que comprueben, como mínimo:

- La ejecución correcta de operaciones y la transición de sus estados.
- El resultado real de la persistencia en el almacenamiento.
- El comportamiento de los reintentos y de los errores.
- Las operaciones CRUD individuales de capas y features.
- El comportamiento de los adaptadores ante fallos y respuestas reales del servicio remoto.

## 14. Estructura principal

La infraestructura de persistencia se encuentra en:

```text
src/gis/services/persistence/
```

Su estructura actual se organiza de la siguiente manera:

```text
persistence/
├── adapters/
│   ├── AdapterFactory.js
│   ├── GeoServerSyncAdapter.js
│   ├── LocalSyncAdapter.js
│   └── SyncAdapter.js
├── constants/
│   ├── adapterTypes.js
│   ├── operationTypes.js
│   └── repositoryTypes.js
├── dev/
│   ├── GISDeveloperAPI.js
│   ├── index.js
│   └── persistenceIntegrationTest.js
├── lifecycle/
│   ├── operationLifecycle.js
│   ├── operationStatus.js
│   └── retryEngine.js
├── models/
│   ├── PersistenceResult.js
│   └── SyncOperation.js
├── providers/
│   ├── BaseStorageProvider.js
│   ├── IndexedDBProvider.js
│   └── LocalStorageProvider.js
├── repositories/
│   ├── BaseRepository.js
│   ├── FeatureRepository.js
│   ├── LayerRepository.js
│   ├── registerRepositories.js
│   └── RepositoryFactory.js
├── scheduler/
│   └── PersistenceScheduler.js
├── services/
│   ├── featureStorageService.js
│   ├── indexdDBService.js
│   ├── persistenceService.js
│   └── synchronizationService.js
├── validation/
│   └── validateSyncOperation.js
├── initializeFeaturePersistence.js
├── layerPersistence.js
├── loadPersistedLayers.js
├── networkStatus.js
├── operationExecutor.js
├── PersistenceEngine.js
├── storageKeys.js
└── syncQueue.js
```

La organización separa las responsabilidades principales:

- **`adapters/`:** selección y ejecución mediante adaptadores de persistencia.
- **`constants/`:** tipos de adaptadores, operaciones y repositorios.
- **`dev/`:** utilidades de desarrollo y comprobaciones exploratorias.
- **`lifecycle/`:** estados de las operaciones y gestión de reintentos.
- **`models/`:** modelos de operaciones y resultados de persistencia.
- **`providers/`:** abstracciones y mecanismos de almacenamiento.
- **`repositories/`:** acceso a datos y registro de repositorios.
- **`scheduler/`:** control del estado de ejecución y procesamiento.
- **`services/`:** servicios de persistencia, almacenamiento y sincronización.
- **`validation/`:** validación de operaciones de sincronización.

Los archivos ubicados directamente en `persistence/` coordinan el motor, la cola, la ejecución de operaciones y la integración de la persistencia con otras partes del sistema.

La presencia de un componente en esta estructura documenta su existencia, pero no garantiza que todas sus funcionalidades estén completas ni que cada mecanismo de almacenamiento esté conectado al flujo de ejecución.

---

## 15. Estado de la fase

La Fase 2.6 establece la infraestructura arquitectónica del motor de persistencia. Los componentes indicados a continuación existen en el código, aunque su presencia no implica que todas las operaciones estén completamente implementadas o verificadas.

### Componentes arquitectónicos existentes

- [x] Persistence Engine.
- [x] Sync Queue.
- [x] Sync Operations.
- [x] Operation Lifecycle.
- [x] Retry Engine.
- [x] Persistence Scheduler.
- [x] Operation Executor.
- [x] Repository Pattern y Repository Factory.
- [x] Adapter Pattern y Adapter Factory.
- [x] Provider Pattern y LocalStorageProvider.
- [x] Registro de repositorios.
- [x] Integración de `LayerRepository` con `LocalStorageProvider`.

### Funcionalidades y validaciones pendientes

- [x] CRUD local de `LayerRepository` implementado por id y con validación de duplicados/entidades inexistentes en el commit `fb669fd`; falta cobertura automatizada.
- [x] CRUD local de `FeatureRepository` implementado por id, con validación de duplicados/entidades inexistentes y borrado limitado a la entidad solicitada. La integración con dibujo, edición, carga y undo/redo se verificó manualmente en el navegador; falta cobertura automatizada.
- [ ] Comprobar que los adaptadores informen del resultado real de la persistencia.
- [x] `GeoServerSyncAdapter` ya no simula éxito: devuelve el error explícito de adaptador no implementado hasta que exista escritura remota real (commit `609a372`).
- [ ] Implementar y probar la sincronización remota real en `GeoServerSyncAdapter` cuando se acuerden el contrato y el destino de escritura.
- [ ] Añadir pruebas automatizadas con aserciones para persistencia, errores y reintentos.
- [ ] Validar el ciclo de inicio y detención del motor, incluidos los escenarios de reinicialización.
- [ ] Verificar el comportamiento del procesamiento de la cola en condiciones de error y recuperación de conexión.

Las casillas de componentes existentes documentan la presencia de la infraestructura. Las funcionalidades pendientes deberán marcarse como completadas únicamente después de implementar los cambios correspondientes y verificar su comportamiento.

## 16. Resultado

La Fase 2.6 proporciona una base arquitectónica desacoplada para gestionar operaciones de persistencia mediante una cola, un motor de ejecución, adaptadores, repositorios y providers. El commit `fb669fd` posterior a esta documentación completa el CRUD local de capas, pero no demuestra persistencia remota ni cubre por sí mismo las operaciones de features.

El almacenamiento local del estado de capas está conectado mediante `LayerRepository` y `LocalStorageProvider`. No obstante, las limitaciones descritas en esta documentación impiden considerar completas todas las operaciones CRUD o la sincronización remota.

Esta infraestructura debe entenderse como una base funcional en evolución. La siguiente mejora de persistencia debe priorizar la verificación automatizada, la durabilidad de la cola y el contrato de escritura remota, sin confundir estas tareas con las integraciones GIS de lectura WFS que ya existen en otras partes del proyecto.

## 17. Continuidad y trabajo pendiente

Las fases posteriores del proyecto ya incorporaron el backend con Node.js/Express, PostgreSQL/PostGIS, GeoServer y la integración WFS. Estas integraciones forman parte del estado actual del proyecto y no deben documentarse como trabajo futuro de esta fase.

Para la evolución del motor de persistencia, las prioridades pendientes son:

1. Completar y verificar las operaciones CRUD de capas y features, garantizando que cada operación actúe sobre la entidad correspondiente.
2. Añadir pruebas automatizadas con aserciones que comprueben los datos persistidos, las transiciones de estado y el manejo de errores.
3. Revisar y probar el ciclo de inicio, detención y reinicialización del motor, así como el procesamiento de la cola y la recuperación ante fallos.
4. Definir el contrato de integración para la sincronización remota e implementar y probar `GeoServerSyncAdapter` conforme a dicho contrato.

Estas tareas deben abordarse de forma incremental, conservando la arquitectura existente y documentando los cambios junto con las pruebas que verifiquen su comportamiento.
