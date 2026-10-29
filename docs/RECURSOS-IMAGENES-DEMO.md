# Biblioteca de imágenes DEMO — maqueta Lapex 2

**Origen verificado:** `martinebene/Lapex2`, rama `chore/staging-demo-001`, commit de subentrega `b62276a3d9931788d91634aaaa9973e88abab5ec` (los archivos anteriores conservan su procedencia original), ruta `artifacts/staging/demo-001/`. [Ver lote en GitHub](https://github.com/martinebene/Lapex2/tree/chore/staging-demo-001/artifacts/staging/demo-001).

**Destino integrado en la maqueta:** `public/resource-images/demo-001/`. Vite incorpora los originales individualmente a su salida. En la publicación pública, los archivos se sirven bajo `/lapexMaqueta/maqueta/resource-images/demo-001/`, y Storybook utiliza la ruta equivalente `/lapexMaqueta/storybook/resource-images/demo-001/`. No establecer URLs de imágenes a la rama privada de Lapex2.

## Inventario y criterios

- 14 pilotos originales JPG, `pilots/pilot-default.png` (anterior) y **`pilots/pilot-default-2.png` (actual)**.
- 5 circuitos originales JPG, `circuits/circuit-default.png` (anterior) y **`circuits/circuit-default-2.png` (actual)**.
- 10 vehículos originales JPG en `vehicles/{formula,kart,motorcycle,rally,touring}/`, más `vehicles/vehicle-default.jpg` y `vehicles/vehicle-default.png` (anteriores, preservadas), y **`vehicles/vehicle-default-2.png` (actual: turismo de competición genérico)**.
- **36 archivos de imagen** (los 33 previamente integrados más los 3 defaults v2). Los tres anteriores siguen disponibles. La maqueta conserva una selección del banco gráfico original; no se afirma que ya haya sincronizado todas las variantes de los 50 archivos de la rama de staging de Lapex 2.
- Las claves estables se corresponden con los nombres sin extensión (`pilot-001`, `circuit-005`, `touring-017`, etc.). El mapeo de opciones y etiquetas se mantiene exclusivamente en `src/ResourceAvatar.tsx`.

Los tres tipos de recurso utilizan la imagen predeterminada cuando su ficha no tiene imagen propia ni una clave de ilustración vigente. La nueva opción predeterminada corresponde a los archivos `*-default-2.png`; las claves explícitas anteriores (`pilot-default`, `vehicle-default`, `circuit-default`, además de `vehicle-neutral`) permanecen seleccionables y no se reescriben. El usuario puede escoger una ilustración desde un **Dialog** de galería o simular una subida personal en el formulario. La selección se muestra en ficha, detalle expandido y snapshot de sesión. En esta maqueta las subidas no persisten en un servidor, no se realizan conversiones WebP ni se modifica la base de datos.

## Recepción futura en Lapex 2

La guía oficial de recepción y normalización es [`ENTREGA-IMAGENES-DEMO.md`](https://github.com/martinebene/Lapex2/blob/main/docs/02-especificacion/incrementos/ENTREGA-IMAGENES-DEMO.md). Su ruta VPS propuesta `/var/lib/lapex2-data/incoming-images/demo-001/` **no está instalada por esta tarea**, que no autoriza migraciones ni vinculación de imágenes a registros reales. Cuando llegue un nuevo lote aprobado, actualizar únicamente los originales disponibles, el catálogo de opciones, las pruebas y este inventario, conservando claves estables.

## Subentrega de defaults v2

- **Procedencia fuente:** [Lapex 2, commit `b62276a`](https://github.com/martinebene/Lapex2/commit/b62276a3d9931788d91634aaaa9973e88abab5ec), rama `chore/staging-demo-001`.
- **Recursos nuevos:** tres PNG individuales RGB 1024 × 1024 px extraídos del diseño conjunto aprobado, con contenido neutral en azul grisáceo y vehículo de turismo, sin marcas identificables.
- **Hash binario:** los archivos de `public/resource-images/demo-001/` se copiaron exactamente desde los originales v2 de la rama fuente, comprobando su SHA de Git.
- **Comportamiento:** los formularios nuevos muestran default v2; las antiguas variantes se conservan en la galería y en sus referencias existentes. No se modificaron los recursos históricos, imágenes personales, bases de datos ni archivos del VPS.
- **Derivados:** esta maqueta publica el PNG nativo; no necesita copias manuales en otros tamaños. El sistema definitivo preparará los WebP y variantes mediante su pipeline oficial.
