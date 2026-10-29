# Biblioteca de imágenes DEMO — maqueta Lapex 2

**Origen verificado:** `martinebene/Lapex2`, rama `chore/staging-demo-001`, commit `f255d92b0da80f1d4f55ac0a46b96c2c697c2641`, ruta `artifacts/staging/demo-001/`. [Ver lote en GitHub](https://github.com/martinebene/Lapex2/tree/chore/staging-demo-001/artifacts/staging/demo-001).

**Destino integrado en la maqueta:** `public/resource-images/demo-001/`. Vite incorpora los originales individualmente a su salida. En la publicación pública, los archivos se sirven bajo `/lapexMaqueta/maqueta/resource-images/demo-001/`, y Storybook utiliza la ruta equivalente `/lapexMaqueta/storybook/resource-images/demo-001/`. No establecer URLs de imágenes a la rama privada de Lapex2.

## Inventario y criterios

- 14 pilotos originales JPG y `pilots/pilot-default.png`.
- 5 circuitos originales JPG y `circuits/circuit-default.png`.
- 10 vehículos originales JPG, agrupados en `vehicles/{formula,kart,motorcycle,rally,touring}/`, y `vehicles/vehicle-default.png`.
- **32 archivos de imagen únicos**. Se excluye `vehicles/vehicle-default.jpg`, alternativa redundante a PNG, y no se incluye `demo-001.zip` ni otros artefactos de staging.
- Las claves estables se corresponden con los nombres sin extensión (`pilot-001`, `circuit-005`, `touring-017`, etc.). El mapeo de opciones y etiquetas se mantiene exclusivamente en `src/ResourceAvatar.tsx`.

Los tres tipos de recurso utilizan la imagen predeterminada cuando su ficha no tiene imagen propia ni una clave de ilustración vigente. El usuario puede escoger una ilustración desde un **Dialog** de galería o simular una subida personal en el formulario. La selección se muestra en ficha, detalle expandido y snapshot de sesión. En esta maqueta las subidas no persisten en un servidor, no se realizan conversiones WebP ni se modifica la base de datos.

## Recepción futura en Lapex 2

La guía oficial de recepción y normalización es [`ENTREGA-IMAGENES-DEMO.md`](https://github.com/martinebene/Lapex2/blob/main/docs/02-especificacion/incrementos/ENTREGA-IMAGENES-DEMO.md). Su ruta VPS propuesta `/var/lib/lapex2-data/incoming-images/demo-001/` **no está instalada por esta tarea**, que no autoriza migraciones ni vinculación de imágenes a registros reales. Cuando llegue un nuevo lote aprobado, actualizar únicamente los originales disponibles, el catálogo de opciones, las pruebas y este inventario, conservando claves estables.
