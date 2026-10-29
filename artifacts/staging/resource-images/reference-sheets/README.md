# Lapex 2 — referencias visuales aprobadas (staging)

**Estado:** dirección artística y composiciones aprobadas por el director. Referencias para producción de archivos finales, **no** imágenes individuales de resolución nativa.

**Alcance previsto:** 24 pilotos, 24 vehículos, 24 circuitos y 3 imágenes neutras por defecto (75 recursos).

## Láminas

- `lamina_01_pilotos.png`: retratos adultos, vestimenta de competición y casco; diversidad de rasgos, edades, tonos de piel, sexo aparente y colores.
- `lamina_02_vehiculos.png`: turismos, sedanes, compactos, zonales, TC clásico y moderno como inspiración, pickups, deportivos y pocas fórmulas. No usar logotipos reales ni reproducir patrocinadores.
- `lamina_03_circuitos.png`: vistas aéreas/isométricas de autódromos diversos, óvalos, callejeros, trazados abiertos y entornos verdes, urbanos y áridos.

Las **tres imágenes por defecto ya estaban aprobadas**: piloto, vehículo tipo turismo y circuito, con estilo de silueta gris. Revisar el material visual y la documentación adjunta al encargo original para conservar el diseño.

## Requisitos de producción

- Cada archivo final debe ser una **ilustración individual**, no un simple recorte ampliado de esta lámina si la resolución/calidad resultante no alcanza los estándares de uso web.
- Mantener consistencia estilística, buena lectura en miniaturas y anatomía/proporciones/trazados plausibles.
- Entregar por recurso PNG principal, WebP optimizado, WebP de 256×256 y WebP de 128×128; preferir fuente cuadrada ≥1024×1024, fondo transparente para pilotos/vehículos cuando sea posible.
- Identificadores `pilot_001..024`, `vehicle_001..024`, `track_001..024`, y `default_pilot_001`, `default_vehicle_001`, `default_track_001`.
- Preparar manifiesto con rutas, variantes, categorías y, cuando corresponda, subtipo. Revisar los resultados antes de reemplazar cualquier versión.

## Gobernanza del staging

Rama temporal de **maqueta**; no integrar esta rama a `main`. La biblioteca final corresponde al repositorio `martinebene/Lapex2`, en una ubicación de staging acordada con las instrucciones y estructura vigentes de ese repositorio. Esta rama y sus imágenes **solo sirven como referencia**.
