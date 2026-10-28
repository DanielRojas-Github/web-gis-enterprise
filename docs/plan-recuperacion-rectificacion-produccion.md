# Plan de recuperacion y rectificacion para produccion

**Proyecto:** Web GIS Enterprise
**Duracion de referencia:** 10 semanas (50 dias habiles)
**Inicio:** Semana 1, a partir de la aprobacion del plan
**Objetivo:** llevar el proyecto desde su estado actual de MVP tecnico a un primer despliegue productivo controlado, verificable y recuperable.

## 1. Resumen ejecutivo

Este documento es la hoja de ruta consolidada para pasar del estado actual a un primer despliegue productivo controlado. Los documentos de fase conservan el detalle tecnico y el historial; este plan registra prioridades, decisiones, criterios de salida y enlaces a esa evidencia.

El proyecto ya cuenta con un visor GIS, API, WFS, PostGIS, GeoServer y persistencia local de capas y equipamientos municipales. La autenticación OIDC local con Keycloak fue verificada de extremo a extremo: login/logout, emisión de roles GIS, acceso lector y rechazo 403 sin rol GIS. El CRUD de equipamientos persiste en PostGIS y tiene pruebas de API y de integración. `GeoServerSyncAdapter` no implementa escrituras remotas y `SyncQueue` sigue en memoria; el formulario municipal escribe en línea directamente a la API. Los conflictos multiusuario, la idempotencia/reintentos y una cola offline quedan diferidos a las etapas relacionadas. La configuración de un proveedor productivo, respaldos, restauración, migraciones reales y CI siguen requiriendo verificación antes de desplegar.

La revision inicial del 28-10-2026 tomó `fb669fd` como base local. No se han verificado aqui entornos productivos, configuraciones externas ni datos reales. Por ello los estados de abajo distinguen evidencia reproducida en el entorno local de requisitos que todavia necesitan confirmacion operativa.

El trabajo debe avanzar en este orden:

1. Proteger los datos y reducir la exposicion antes de cambiar infraestructura o esquema.
2. Definir seguridad, permisos y comportamiento funcional esperado.
3. Corregir el historial y proceso de migraciones sin reescribir migraciones ya aplicadas.
4. Completar la persistencia real y su manejo de errores.
5. Automatizar pruebas, despliegue, observabilidad, respaldo y restauracion.
6. Desplegar primero a staging y despues a produccion mediante una aprobacion Go/No-Go.

El cronograma es una estimacion con trabajo en paralelo. Asume disponibilidad de responsables de backend, frontend, infraestructura/DBA y QA; con una sola persona o disponibilidad parcial, se recomienda planificar de 12 a 16 semanas.

## 2. Alcance y supuestos

### Incluido

- Aplicacion web, API, PostGIS y GeoServer necesarios para el primer lanzamiento.
- Autenticacion, autorizacion por roles, seguridad de configuracion y proteccion de datos.
- Persistencia de ediciones GIS, pruebas automatizadas, CI/CD y operacion inicial.
- Despliegue controlado, plan de vuelta atras y periodo de estabilizacion.

### No incluido hasta definirlo con el negocio

- Integracion con un proveedor corporativo de identidad, SSO o MFA especifico.
- Requisitos regulatorios, residencia de datos, SLA y volumen maximo de usuarios.
- Alta disponibilidad multi-region, recuperacion ante desastre de sitio completo o escalado avanzado.
- Funcionalidades GIS nuevas no necesarias para asegurar los flujos existentes.

Estas decisiones deben cerrarse durante la semana 1. No se deben asumir requisitos regulatorios ni niveles de disponibilidad no confirmados.

## 3. Responsables sugeridos

Los roles pueden combinarse en equipos pequenos, pero cada responsabilidad debe tener un titular.

| Rol | Responsabilidad |
|---|---|
| Responsable de producto / propietario de datos | Define usuarios, roles, flujos prioritarios, criterios de aceptacion y autoriza el lanzamiento. |
| Backend | API, autenticacion/autorizacion, integracion con GeoServer, persistencia, migraciones y pruebas de API. |
| Frontend | Inicio de sesion, guardas de interfaz, edicion, estados de sincronizacion y pruebas de flujos GIS. |
| Infraestructura / DBA | Secretos, redes, TLS, entornos, respaldos, restauracion, despliegue y monitoreo. |
| QA | Plan de pruebas, automatizacion, regresion, pruebas de aceptacion y evidencia de lanzamiento. |
| Responsable de lanzamiento | Coordina Go/No-Go, ventana de despliegue, comunicacion, monitoreo y vuelta atras. |

## 4. Cronograma de trabajo

Las semanas son semanas laborales. Actividades paralelas solo deben comenzar cuando sus dependencias esten satisfechas.

| Semana | Fase y tareas | Responsable principal | Dependencias | Entregable / criterio de salida |
|---|---|---|---|---|
| 1 | **Contencion y linea base.** Congelar cambios no urgentes; inventariar entornos, servicios, datos y secretos; comprobar que `.env` y credenciales no esten en Git ni en imagenes; identificar si hay datos reales; crear y verificar un respaldo antes de tocar esquema; acordar usuarios/roles y alcance del primer lanzamiento. | Infra/DBA + Producto | Ninguna | Inventario aprobado; secretos y exposicion documentados; respaldo creado y restauracion de prueba iniciada; decisiones de alcance registradas. |
| 2 | **Diseno de seguridad y recuperacion de datos.** Definir el flujo de identidad, roles y permisos; matriz de operaciones por rol; estrategia de sesiones/tokens; politica de CORS; limites de consulta y datos; RPO/RTO y retencion de respaldos; plan de despliegue y rollback. | Backend + Infra/DBA + Producto | Semana 1 | Diseno aprobado y comprobable; matriz de permisos; politica de secretos, respaldo y recuperacion; criterios Go/No-Go acordados. |
| 2–3 | **Rectificacion de base de datos.** Revisar migraciones y esquemas reales por entorno; validar los archivos `005` y `006` y cualquier discrepancia de checksum; no reescribir migraciones aplicadas; preparar una nueva migracion correctiva cuando corresponda; ejecutar primero en una copia restaurada y luego en staging; probar rollback o procedimiento compensatorio. | Infra/DBA + Backend | Respaldo verificado; inventario de esquemas | Historia de migraciones consistente por entorno; evidencia de ejecucion repetible en base limpia y restaurada; datos preservados. |
| 3–4 | **Autenticacion y autorizacion.** Implementar el mecanismo acordado; proteger rutas de API; validar permisos en backend para lectura y escritura; evitar confiar en roles guardados solo en frontend; restringir CORS; ocultar detalles internos de errores y mantener trazabilidad de solicitudes. | Backend + Frontend | Diseno de seguridad | Pruebas que demuestran acceso permitido/denegado por rol; sin operaciones protegidas accesibles anonimamente; errores externos no revelan detalles internos. |
| 4–6 | **Persistencia GIS real.** Completar operaciones de crear, actualizar y borrar en el destino de datos acordado; hacer que cada respuesta de exito corresponda a una escritura confirmada; definir identificadores, validacion geometrica, conflictos, idempotencia y errores; hacer durable la cola si se mantiene la sincronizacion offline; corregir el borrado local para afectar solo la entidad solicitada. | Backend + Frontend | Autorizacion lista; contrato de API y datos definido | Pruebas de ida y vuelta confirman que crear/editar/borrar sobrevive a recargas y reinicios; los fallos se muestran como fallos; no hay falsos exitos. |
| 5–6 | **Pruebas, calidad y rendimiento.** Ejecutar las pruebas automatizadas actuales de backend y persistencia PostGIS, lint y build frontend; ampliar cobertura de autenticacion, validacion WFS, errores de GeoServer, migraciones y flujos GIS prioritarios; configurar CI; fijar limites, paginacion y tiempos de espera; medir consultas con datos representativos. | QA + Backend + Frontend | Contratos de API estables; partes de persistencia integrables | Pipeline reproducible y verde; regresion automatizada de flujos criticos; limites de consulta documentados y rendimiento aceptado por Producto. |
| 6–7 | **Entorno y operacion.** Preparar despliegue separado de desarrollo; retirar contrasenas predeterminadas; aislar PostGIS y GeoServer de acceso publico; exponer solo servicios necesarios detras de proxy/TLS; configurar health checks, reinicios, logs, alertas, metricas y gestion de secretos; ejecutar migraciones como tarea controlada, no como accion concurrente de cada instancia. | Infra/DBA | Diseno aprobado; configuracion de aplicacion lista | Staging reproducible desde configuracion versionada sin secretos; acceso de red minimo; health checks, alertas y procedimiento de operacion probados. |
| 7–8 | **Respaldo, restauracion y aceptacion en staging.** Programar respaldos de base y configuracion necesaria de GeoServer; probar restauracion completa; ejecutar pruebas de integracion y aceptacion con usuarios; comprobar permisos, mapas, capas, edicion, sincronizacion, limites y recuperacion; corregir hallazgos bloqueantes. | QA + Infra/DBA + Producto | Staging desplegado; CI disponible | Acta de aceptacion; restauracion verificada y tiempos medidos; cero defectos criticos/altos abiertos para el alcance aprobado. |
| 9 | **Ensayo de lanzamiento y Go/No-Go.** Congelar cambios; respaldar datos de preproduccion; ensayar despliegue y vuelta atras; revisar migraciones pendientes, alertas, responsables de guardia y comunicacion; aprobar o posponer lanzamiento. | Responsable de lanzamiento + equipo | Aceptacion y recuperacion aprobadas | Checklist firmado; rollback ensayado; decision Go/No-Go registrada. |
| 10 | **Lanzamiento gradual y estabilizacion.** Desplegar en ventana acordada; validar salud, acceso, consultas y una edicion controlada; monitorear errores, latencia y sincronizacion; mantener capacidad de rollback; revisar incidentes a diario y cerrar pendientes no bloqueantes con fecha y responsable. | Responsable de lanzamiento + equipo | Go aprobado | Servicio monitorizado; validacion post-lanzamiento completada; incidencias clasificadas y plan de seguimiento acordado. |

## 5. Hitos y puertas de control

### Hito A — Datos protegidos (fin de semana 1)

- Existe inventario de los entornos y de si contienen datos reales.
- Hay respaldo verificable antes de cualquier cambio de esquema.
- Se conoce quien puede aprobar cambios y restauraciones.
- No se ha habilitado acceso publico adicional durante la rectificacion.

### Hito B — Seguridad funcional (fin de semana 4)

- La API exige identidad para operaciones protegidas.
- Cada operacion valida permisos en backend.
- CORS y puertos publicados siguen la politica aprobada.
- Secretos de produccion no se guardan en el repositorio ni en el frontend.

### Hito C — Edicion confiable (fin de semana 6)

- La aplicacion no declara guardada una operacion que no persistio.
- Crear, editar y borrar funcionan de forma verificable en el destino de datos.
- Se definieron y probaron manejo de conflictos, reintentos e idempotencia.
- La cola no pierde trabajo pendiente ante recarga/reinicio, o la interfaz informa claramente que el modo offline no esta habilitado.

### Hito D — Listo para lanzamiento (fin de semana 9)

- CI y pruebas de regresion estan verdes.
- Staging fue validado con flujos y datos representativos.
- Respaldo y restauracion fueron probados.
- No hay vulnerabilidades o defectos criticos/altos abiertos dentro del alcance del lanzamiento.
- Hay responsables, monitoreo, procedimiento de rollback y ventana de soporte.

## 6. Criterios de Go/No-Go

**No lanzar** si se cumple cualquiera de estas condiciones:

- No hay respaldo reciente y restaurable de los datos que se van a modificar.
- Alguna ruta protegida puede usarse sin autenticacion o sin permisos adecuados.
- Una operacion de edicion reporta exito sin persistir, o existe riesgo de perdida de ediciones pendientes.
- Hay secretos predeterminados, credenciales comprometidas o servicios de datos expuestos sin justificacion.
- Las migraciones no se han probado contra una copia del esquema/datos de destino.
- El rollback no se ensayo o no hay responsable disponible durante el lanzamiento.
- Hay defectos criticos/altos abiertos para los flujos que forman parte del lanzamiento.
- No hay monitoreo suficiente para detectar que la API, GeoServer o PostGIS dejan de responder.

Se puede limitar el primer lanzamiento a lectura si Producto acepta formalmente desactivar edicion y sincronizacion; la interfaz y la API deben reflejar esa limitacion y no simular guardados exitosos.

## 7. Plan de recuperacion ante incidente

1. **Detectar y declarar:** registrar hora, entorno, impacto, servicios afectados y responsable del incidente.
2. **Contener:** deshabilitar temporalmente escrituras o el acceso afectado; no borrar ni recrear datos como primera respuesta.
3. **Preservar evidencia:** guardar logs, identificadores de solicitud, estado de migracion y version desplegada.
4. **Evaluar:** decidir si se requiere rollback de aplicacion, restauracion de datos o migracion compensatoria. La decision debe involucrar a DBA/Infra y propietario de datos.
5. **Recuperar:** seguir el procedimiento ensayado en staging. No ejecutar restauraciones destructivas sobre produccion sin confirmar el destino, respaldo y aprobacion.
6. **Validar:** comprobar salud de servicios, integridad de datos y flujos GIS antes de reabrir escrituras.
7. **Comunicar y aprender:** informar impacto y estado; documentar causa, acciones, datos afectados y tareas preventivas con responsables y fechas.

La restauracion de una base completa puede hacer perder escrituras posteriores al respaldo. Antes de declarar RPO/RTO, Producto y el propietario de datos deben aceptar ese riesgo y cualquier mecanismo de recuperacion punto-en-tiempo que se implemente.

## 8. Riesgos y mitigaciones

| Riesgo | Mitigacion |
|---|---|
| Entornos existentes tienen historial de migraciones distinto | Inventariar y restaurar copias antes de corregir; crear migraciones correctivas compatibles; no editar migraciones aplicadas. |
| La edicion offline aparenta estar disponible pero no sobrevive a reinicios | Desarrollar cola durable y pruebas de reinicio, o deshabilitar la promesa offline en el primer lanzamiento. |
| Cambios de autenticacion afectan consumo WFS y GeoServer | Definir un solo contrato de identidad/permisos; probar integracion completa en staging. |
| Consultas WFS o carga de capas exceden capacidad | Establecer paginacion, limites, timeout, pruebas con datos representativos y alertas de latencia. |
| Plazo se extiende por falta de definiciones de negocio | Cerrar roles, destino de escrituras, volumen, SLA/RPO/RTO y alcance en semana 1; tratar nuevas funcionalidades como cambio de alcance. |
| Fallo durante despliegue causa indisponibilidad o perdida de datos | Ensayar despliegue y rollback; separar migraciones; exigir respaldo y aprobacion Go/No-Go. |

## 9. Acciones iniciales para los proximos cinco dias habiles

1. Nombrar propietarios de Producto, datos, backend, infraestructura y QA.
2. Confirmar si existen datos reales en cada entorno y que servicios son accesibles desde Internet.
3. Verificar el estado de Git y el historial de secretos; rotar credenciales si se sospecha exposicion.
4. Crear y restaurar una copia de respaldo en un entorno aislado.
5. Acordar roles, operaciones que tendra el primer lanzamiento y si se permite edicion remota.
6. Obtener el esquema y el historial real de migraciones de cada base desplegada.
7. Convertir las tareas del cronograma en issues con responsable, fecha objetivo y criterio de aceptacion.

## 10. Evidencia revisada y trazabilidad

Este plan parte de una revision estatica del repositorio y debe confirmarse contra entornos desplegados antes de ejecutar cambios:

- [docker-compose.yml](../docker-compose.yml): configuracion de desarrollo con puertos publicados y credenciales predeterminadas.
- [app.js](../backend/src/app.js): CORS permisivo y montaje de middleware/API.
- [AppRouter.jsx](../frontend/src/app/router/AppRouter.jsx) y [LoginPage.jsx](../frontend/src/pages/Login/LoginPage.jsx): rutas y pantalla de login existente.
- [GeoServerSyncAdapter.js](../frontend/src/gis/services/persistence/adapters/GeoServerSyncAdapter.js): adaptador que no ejecuta escrituras remotas reales.
- [FeatureRepository.js](../frontend/src/gis/services/persistence/repositories/FeatureRepository.js): operaciones locales pendientes de completar y borrado que limpia la coleccion.
- [syncQueue.js](../frontend/src/gis/services/persistence/syncQueue.js): cola en memoria.
- [runMigrations.js](../backend/src/database/runMigrations.js): ejecucion de migraciones desde el backend al iniciar.
- [002_add_description_to_roads.sql](../backend/src/database/migrations/002_add_description_to_roads.sql), [005_add_description_to_roads.sql](../backend/src/database/migrations/005_add_description_to_roads.sql) y [006_add_description_to_roads.sql](../backend/src/database/migrations/006_add_description_to_roads.sql): archivos a contrastar con el historial real de cada base.
- [README.md](../README.md) y [frontend/README.md](../frontend/README.md): documentacion de estado que debe alinearse tras confirmar la implementacion.

La presencia de codigo o documentacion no se considera prueba de que una capacidad opere en produccion; cada criterio de salida requiere evidencia reproducible.

## 11. Estado consolidado y orden de trabajo

La siguiente matriz es la fuente de estado para la hoja de ruta. Las fases anteriores son evidencia de implementacion reportada, no un sustituto de la verificacion actual.

| Frente | Estado con evidencia disponible | Siguiente paso y criterio de cierre |
|---|---|---|
| CRUD local de capas | Corregido en `fb669fd`; `LayerRepository` opera por identificador y rechaza entidades inexistentes o duplicadas. | Añadir/ejecutar pruebas automatizadas que demuestren persistencia y errores; no declarar cubierto el CRUD de features por este cambio. |
| CRUD local de features | `FeatureRepository` implementa create/update/find/findAll/delete y replaceAll por ID sobre LocalStorage; `drawStore` y la carga inicial usan el repositorio. Verificación manual en navegador: dos puntos persistieron tras recarga, borrar uno conservó el otro; los datos temporales se eliminaron al finalizar. | Añadir pruebas automatizadas de CRUD y recuperación de datos inválidos. Esto cubre persistencia local, no sincronización remota ni durabilidad de la cola. |
| Sincronizacion remota | CRUD de equipamientos municipales sobre PostGIS; la suite automatizada verifica permisos/CRUD y la integración verifica persistencia. El formulario actualiza la capa al confirmar el servidor; el dibujo genérico sigue siendo local. Falta una prueba de ida y vuelta desde el formulario del navegador. | Verificar crear/editar/borrar desde el mapa y recargar. **Pendiente para la etapa de colaboración multiusuario:** control de conflictos y concurrencia; una actualización simultánea hoy puede sobrescribir la anterior. **Pendiente para la etapa offline/reintentos:** idempotencia de creación y política de reintentos. |
| Cola de sincronizacion | Diferida para el alcance conectado actual: `SyncQueue` conserva operaciones en memoria y el formulario municipal escribe en línea, mostrando los errores al usuario; no se promete edición offline. | Retomar cuando se planifique trabajo offline o colaboración multiusuario; entonces decidir cola durable o desactivar explícitamente edición sin conexión y verificar recuperación tras recarga/reinicio. |
| Seguridad e identidad | Verificado localmente: OIDC con Keycloak, PKCE, sesión PostgreSQL, logout RP-Initiated y mapper de roles al ID token. `demo-viewer` (`gis-reader`), `demo-editor` (`gis-editor`) y una cuenta temporal `gis-admin` emitieron el rol correcto; una cuenta sin rol GIS recibió `403` y el logout dejó `/api/auth/me` en `401`. El issuer HTTP solo se permite en loopback con `NODE_ENV=development`. | Pendiente: acordar y aplicar permisos distintos para lectura, edición y administración; conectar los roles de `/api/auth/me` con la interfaz sin confiar en ella para autorización; configurar y validar el proveedor HTTPS y secretos del entorno productivo. |
| Migraciones y datos | El runner ahora serializa ejecuciones con un advisory lock y permite desactivar arranque automático en producción (`RUN_MIGRATIONS_ON_START=false`) para ejecutar `npm run migrate` como tarea controlada. `005_add_description_to_roads.sql` es una consulta `SELECT`; `006` agrega `description` con `IF NOT EXISTS`. No se cambió ningún SQL histórico y el estado de cada base desplegada sigue sin consultarse. | Inventariar esquemas/checksums por entorno, crear y restaurar respaldo, y reconciliar historial antes de decidir cambios; probar cualquier corrección sobre una copia. |
| Pruebas y entrega | `backend/test/publicFacilityApi.test.js` cubre roles, Origin, validación y CRUD; `backend/test/publicFacilityRepository.integration.test.js` verifica ida y vuelta contra PostGIS con `GIS_ALLOW_DB_TESTS=true`. Se ejecutaron 9 pruebas en total. Build y lint del frontend pasan. El workflow `.github/workflows/ci.yml` ya configura esas verificaciones en GitHub Actions; todavía no hay resultado remoto porque la rama no se ha subido. La interacción del formulario en navegador no tiene prueba automatizada. | Subir la rama y confirmar CI verde; después comprobar crear/editar/borrar desde el formulario del mapa y recargar, y exigir pipeline verde en staging. |
| Operacion productiva | Sin evidencia de staging, monitoreo, alertas, respaldo/restauracion o ensayo de rollback en esta inspeccion. | Completar los criterios de las semanas 6–10 y adjuntar evidencia operativa. |

### Orden de precedencia documental

1. Este plan gobierna prioridades, decisiones abiertas y puertas de lanzamiento.
2. Los documentos de fase explican el diseño y los cambios historicos; actualizar su estado cuando exista nueva evidencia, sin duplicar aqui su detalle.
3. `project-tree.txt` es solo un inventario auxiliar y no representa estado ni avance.
4. La evidencia Git consultada refleja el checkout local; antes de ejecutar trabajo de lanzamiento, volver a revisar rama, cambios sin seguimiento y sincronizacion con remoto.

### Decisiones que bloquean fechas definitivas

Durante la semana 1 deben resolverse: identidad/SSO y MFA, matriz de roles, si el primer lanzamiento permite edicion, destino de escritura GIS, datos reales por entorno, volumen esperado, SLA, RPO/RTO, retencion y titulares responsables. El horizonte de 10 semanas es una estimacion condicionada a esas decisiones y a la disponibilidad de los roles; no es una fecha comprometida.

### Mantenimiento del plan

Al cerrar cada criterio, registrar enlace a commit o evidencia de staging/operacion, responsable y fecha real. Cambiar el estado a completo solo con esa evidencia. Revisar este documento al inicio de cada fase y antes de Go/No-Go; registrar decisiones de alcance aqui y mantener el detalle tecnico en los documentos de fase.
