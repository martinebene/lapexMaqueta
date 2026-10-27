/** Borradores de Lapex2: planillas independientes, no constituyen contrato físico aprobado.
 * Cada texto representa un campo opcional. Una cadena vacía no equivale a cero.
 * general: valor libre | axes: Delantero/Trasero | wheels: DI/DD/TI/TD.
 */
export type SetupSection={title:string;general?:string;axes?:string;wheels?:string}
export const vehicleTypes=["Moto de velocidad","Karting","Auto de Fórmula","Auto de Turismo","Vehículo de Rally"] as const
export const setupTemplates:Record<string,SetupSection[]>={
"Moto de velocidad":[
 {title:"Pesos y distribución",general:"Peso total real medido | Lastre adicional | Ubicación del lastre | Condición del pesaje: piloto y combustible | Reparto porcentual calculado (si hay mediciones)",axes:"Peso medido por rueda | Reparto medido de peso"},
 {title:"Suspensión",general:"Modelo de horquilla | Rigidez de resortes de horquilla (N/mm) | Precarga de horquilla | Compresión de horquilla | Rebote de horquilla | Compresión baja/alta de horquilla | Rebote baja/alta de horquilla | Nivel de aceite de horquilla | Posición de horquilla en tijas | Modelo de amortiguador trasero | Rigidez del resorte trasero (N/mm) | Precarga trasera | Compresión trasera | Rebote trasero | Recorrido del amortiguador trasero | Topes traseros | Regulación de altura trasera | Posición del pivote del basculante"},
 {title:"Geometría",general:"Ángulo de dirección/rake (°) | Avance/trail (mm) | Distancia entre ejes (mm) | Longitud del basculante (mm) | Posición del basculante | Offset de tijas (mm) | Posición de horquilla | Posición/ergonomía deportiva",axes:"Altura estática (mm)"},
 {title:"Neumáticos",axes:"Fabricante | Modelo | Medida | Compuesto | Presión fría (bar) | Presión objetivo caliente (bar) | Temperatura objetivo (°C) | Diámetro de rodadura (mm) | Circunferencia (mm) | Llanta | Estado de uso | Ciclos térmicos"},
 {title:"Transmisión",general:"Relaciones individuales de marchas | Dientes piñón final | Dientes corona final | Relación final | Tensión de cadena | Longitud de cadena | Tipo de embrague | Ajuste de embrague antirrebote | Quickshifter | Blipper"},
 {title:"Frenos",axes:"Compuesto de pastillas | Dimensiones de disco (mm) | Tipo de disco | Pinza | Bomba | Regulación de maneta/pedal | Mapa/ajuste ABS"},
 {title:"Motor y electrónica",general:"Mapa motor | Limitador de régimen (rpm) | Respuesta de acelerador | Mapa de combustible | Encendido | Presión objetivo de sobrealimentación | Freno motor | Control de tracción | Anti-wheelie | Control de largada | Estrategia quickshifter | Estrategia blipper"},
 {title:"Aerodinámica",general:"Carenado | Cúpula | Winglets/alerones | Tomas de aire | Refrigeración | Otros elementos aerodinámicos"},
 {title:"Otros / atributos personalizados",general:"Notas del setup | Parámetros especiales (clave, valor y unidad)"}
],
"Karting":[
 {title:"Pesos y distribución",general:"Peso total realmente medido (kg) | Distribución por eje | Reparto izquierda/derecha derivado | Carga cruzada/diagonal derivada | Posición del asiento | Lastre del kart (kg) | Posición del lastre | Condición del pesaje: piloto y combustible",wheels:"Peso medido (kg)"},
 {title:"Suspensión / elasticidad del chasis",general:"Rigidez/flexión de chasis | Barras desmontables | Tirantes desmontables | Rigidez de eje trasero | Diámetro de eje trasero (mm) | Material del eje trasero | Anclajes de asiento | Soportes de asiento | Posición de manguetas",axes:"Altura de chasis (mm)"},
 {title:"Geometría",general:"Toe total delantero | Ackermann | Geometría de dirección | Distancia entre ejes ajustable (mm)",axes:"Trocha (mm) | Altura de eje/manguetas (mm)",wheels:"Comba (°) | Caster (°) | Espesor de separadores (mm)"},
 {title:"Neumáticos",wheels:"Fabricante | Modelo | Medida | Compuesto | Presión fría (bar) | Presión objetivo caliente (bar) | Temperatura objetivo (°C) | Llanta | Ciclos térmicos | Estado de uso"},
 {title:"Transmisión",general:"Dientes de piñón | Dientes de corona | Relación final | Longitud de cadena | Tensión de cadena | Diámetro de eje trasero (mm) | Rigidez de eje | Tipo/ajuste de embrague | Relaciones de marchas (sólo kart con caja)"},
 {title:"Frenos",general:"Tipo de freno | Tipo y tamaño del disco | Compuesto de pastillas | Ajuste bomba/pedal | Calibración | Repartidor (si tiene) | Freno delantero (si equipa)"},
 {title:"Motor y electrónica",general:"Carburación | Chiclés | Mapa de inyección | Bujía | Encendido | Limitador de régimen (rpm) | Temperatura objetivo (°C) | Ajuste de embrague | Electrónica autorizada"},
 {title:"Aerodinámica / carrocería",general:"Carenado frontal | Pontones | Frontal/spoiler | Accesorios de carrocería | Posición de elementos | Ajustes de carrocería"},
 {title:"Otros / atributos personalizados",general:"Observaciones del chasis | Observaciones de pista | Observaciones de mecánica | Parámetros de categoría (clave, valor y unidad)"}
],
"Auto de Fórmula":[
 {title:"Pesos y distribución",general:"Masa total real medida (kg) | Reparto por eje | Reparto izquierda/derecha derivado | Carga cruzada/diagonal derivada | Lastre del setup | Ubicación del lastre | Condición de combustible y piloto",wheels:"Peso medido (kg)"},
 {title:"Suspensión",general:"Tercer resorte/heave | Topes | Packers | Recorrido | Motion ratio",axes:"Barra estabilizadora | Altura (mm)",wheels:"Rigidez de resorte (N/mm o lbf/in) | Longitud de resorte (mm) | Precarga | Compresión baja | Compresión alta | Rebote baja | Rebote alta"},
 {title:"Geometría",general:"Distancia entre ejes (mm) | Ackermann | Anti-dive | Anti-squat | Posición de anclajes",axes:"Trocha (mm) | Toe total | Centro de rolido",wheels:"Comba (°) | Caster (°) | Toe individual | SAI/KPI (°) | Calces de geometría"},
 {title:"Neumáticos",wheels:"Fabricante/modelo | Medida | Compuesto | Presión fría (bar) | Presión objetivo caliente (bar) | Temperatura objetivo (°C) | Medidas de llanta | Offset de llanta (mm) | Diámetro de rodadura (mm) | Uso/desgaste"},
 {title:"Transmisión",general:"Relaciones por marcha | Relación final | Número de dientes | Tipo diferencial | Precarga diferencial | Rampa power | Rampa coast | Bloqueo diferencial | Corte de cambio | Tiempo de cambio | Reparto de torque (si tiene)"},
 {title:"Frenos",general:"Balance delantero/trasero | Barra compensadora | Objetivo de presión | Mapa ABS",axes:"Bomba | Discos | Compuesto de pastillas | Pinzas | Ventilación"},
 {title:"Motor y electrónica",general:"Mapa ECU | Limitador rpm | Pedal/acelerador | Mezcla objetivo | Mapa encendido | Boost objetivo | Límite torque | Freno motor | Control de tracción | Largada | Mapas de transmisión"},
 {title:"Aerodinámica",general:"Gurney | Fondo plano | Difusor | Rake | Alturas aerodinámicas de referencia | Tomas de refrigeración | Paquete aero",axes:"Alerón | Ángulo de alerón (°) | Posición de flaps"},
 {title:"Otros / atributos personalizados",general:"Reglajes especiales del monoplaza | Notas técnicas | Parámetros específicos (clave, valor y unidad)"}
],
"Auto de Turismo":[
 {title:"Pesos y distribución",general:"Peso total real medido (kg) | Peso por eje | Carga cruzada/diagonal derivada | Lastre de setup (kg) | Ubicación del lastre | Condiciones de pesaje",wheels:"Peso medido (kg)"},
 {title:"Suspensión",general:"Recorridos | Topes | Packers | Relación de movimiento",axes:"Barra estabilizadora | Altura estática (mm)",wheels:"Rigidez de resorte (N/mm o lbf/in) | Longitud de resorte | Precarga | Modelo amortiguador | Compresión simple | Extensión simple | Compresión baja/alta | Rebote baja/alta"},
 {title:"Geometría",general:"Distancia entre ejes (mm) | Ackermann | Ajustes de brazos | Excéntricas",axes:"Toe total | Trocha (mm)",wheels:"Comba (°) | Caster (°) | Toe individual | SAI/KPI (°)"},
 {title:"Neumáticos",wheels:"Fabricante | Modelo | Medida | Compuesto | Presión fría (bar) | Presión objetivo caliente (bar) | Temperatura objetivo (°C) | Llanta | Diámetro/circunferencia | Ciclos y uso"},
 {title:"Transmisión",general:"Tipo de caja manual/secuencial | Relaciones por marcha | Relación final | Dientes | Tipo diferencial | Precarga diferencial | Bloqueo | Rampas de diferencial | Reparto de torque | Mapa/corte de cambio"},
 {title:"Frenos",general:"Reparto delantero/trasero | Barra compensadora | Mapa ABS",axes:"Bomba | Discos | Pinzas | Pastillas | Temperatura objetivo | Presión objetivo | Conductos de refrigeración"},
 {title:"Motor y electrónica",general:"Mapa ECU | Limitador rpm | Combustible | Encendido | Boost | Mapa de pedal | Control de tracción | Control de largada | Freno motor | Potencia límite | Torque límite | Ajustes de cambio"},
 {title:"Aerodinámica",general:"Alerón trasero | Splitter delantero | Flaps | Gurney | Difusor | Fondo plano | Altura aero | Tomas de refrigeración | Salidas de refrigeración | Paquete aero"},
 {title:"Otros / atributos personalizados",general:"Datos particulares de la categoría | Reglajes especiales de Turismo | Parámetros con valor y unidad"}
],
"Vehículo de Rally":[
 {title:"Pesos y distribución",general:"Peso total real medido (kg) | Peso por eje | Repartos derivados | Lastre del setup | Posición del lastre | Condición de pesaje: piloto/copiloto/repuestos/combustible",wheels:"Peso medido (kg)"},
 {title:"Suspensión",general:"Recorrido largo | Ajuste por superficie | Protección | Hidráulica especial",axes:"Altura de suspensión (mm) | Barra estabilizadora",wheels:"Resorte/rigidez | Precarga | Compresión baja/alta | Rebote baja/alta | Droop | Tope | Packers"},
 {title:"Geometría",general:"Distancia entre ejes | Ackermann | Configuración tierra/asfalto/nieve | Posiciones de anclajes",axes:"Trocha | Toe total | Altura de carrocería",wheels:"Comba (°) | Caster (°) | Toe individual"},
 {title:"Neumáticos",wheels:"Tipo tierra/asfalto/nieve/lluvia | Fabricante | Compuesto | Medida | Presión fría (bar) | Presión objetivo caliente (bar) | Llanta | Diámetro de rodadura | Estado de uso | Clavos (si permitidos)"},
 {title:"Transmisión",general:"Relaciones por marcha | Relación final | Diferencial delantero | Diferencial central | Diferencial trasero | Precarga diferencial | Bloqueo diferencial | Rampas power/coast | Reparto de torque | Corte de cambio | Mapas electrónicos"},
 {title:"Frenos",general:"Reparto delantero/trasero | Barra de balance | Freno de mano hidráulico | Ajuste ABS",axes:"Discos por superficie | Pastillas por superficie | Bomba | Refrigeración"},
 {title:"Motor y electrónica",general:"Mapa ECU | Respuesta del pedal | Limitador | Combustible | Ignición | Boost | Freno motor | Control de tracción | Diferencial activo | Estrategia híbrida (si equipa)"},
 {title:"Aerodinámica",general:"Alerones | Splitters | Deflectores | Fondo/planchas de protección | Tomas de aire | Salidas de aire | Configuración según superficie"},
 {title:"Otros / atributos personalizados",general:"Protección de bajos | Equipamiento accesorio | Ajustes específicos de categoría | Parámetros especiales (clave, valor y unidad)"}
]
}
export function fieldNames(value?:string){return value?value.split(" | "):[]}
