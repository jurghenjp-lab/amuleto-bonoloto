# Documento de Requisitos

## Introducción

Amuleto Bonoloto es una aplicación móvil que genera apuestas para la Bonoloto española mediante tres motores distintos: uno basado en análisis estadístico histórico, otro en simulación matemática del experimento de la Aguja de Buffon, y un tercero basado en datos personales del usuario. La aplicación combina rigor matemático con elementos lúdicos para crear una experiencia única de "amuleto digital", sin pretender garantizar premios ni tener vinculación oficial con SELAE.

## Glosario

- **Sistema**: La aplicación móvil Amuleto Bonoloto
- **Motor_Histórico**: Componente que genera apuestas basadas en análisis estadístico de resultados pasados
- **Motor_Buffon**: Componente que genera apuestas mediante simulación del experimento de la Aguja de Buffon
- **Motor_Amuleto**: Componente que genera apuestas basadas en datos personales del usuario
- **Apuesta**: Combinación de 6 números entre 1 y 49
- **Columna**: Una apuesta individual dentro de un boleto
- **API_Bonoloto**: Servicio externo que proporciona el histórico de resultados oficiales
- **Número_Caliente**: Número con alta frecuencia de aparición en el último año
- **Número_Frío**: Número que lleva más de 20 sorteos sin aparecer
- **Semilla_Personal**: Valor numérico derivado de datos personales del usuario
- **Sorteo**: Evento oficial de la Bonoloto con combinación ganadora

## Requisitos

### Requisito 1: Motor Histórico - Generación Estadística

**Historia de Usuario:** Como usuario, quiero generar apuestas basadas en análisis estadístico de resultados históricos, para que mis números tengan fundamento matemático.

#### Criterios de Aceptación

1. WHEN el Motor_Histórico genera una apuesta, THE Sistema SHALL consultar la API_Bonoloto para obtener resultados del último año
2. WHEN el Motor_Histórico selecciona números, THE Sistema SHALL incluir al menos 4 números de los 15 Números_Calientes con mayor frecuencia
3. WHEN el Motor_Histórico selecciona números, THE Sistema SHALL incluir exactamente 1 Número_Frío que lleve más de 20 sorteos sin aparecer
4. WHEN el Motor_Histórico completa una apuesta, THE Sistema SHALL asegurar una distribución de 3 pares y 3 impares, o 4 pares y 2 impares, o 2 pares y 4 impares
5. WHEN el Motor_Histórico genera una apuesta, THE Sistema SHALL producir exactamente 6 números únicos entre 1 y 49

### Requisito 2: Motor Buffon - Simulación Matemática

**Historia de Usuario:** Como usuario, quiero generar apuestas agitando mi móvil, para que el azar físico determine mis números mediante un experimento matemático clásico.

#### Criterios de Aceptación

1. WHEN el usuario agita el dispositivo, THE Sistema SHALL detectar la aceleración mediante el acelerómetro
2. WHEN el Sistema detecta aceleración superior a un umbral definido, THE Sistema SHALL iniciar la simulación de lanzamiento de agujas virtuales
3. WHEN el Motor_Buffon simula lanzamientos, THE Sistema SHALL distribuir agujas sobre una rejilla virtual de 49 espacios
4. WHEN el Motor_Buffon calcula intersecciones, THE Sistema SHALL identificar los 6 espacios donde las agujas cruzan líneas con mayor precisión matemática
5. WHEN el Motor_Buffon completa la simulación, THE Sistema SHALL convertir los 6 espacios seleccionados en números de apuesta entre 1 y 49
6. WHEN el Motor_Buffon genera una apuesta, THE Sistema SHALL producir exactamente 6 números únicos

### Requisito 3: Motor Amuleto - Personalización Mística

**Historia de Usuario:** Como usuario, quiero generar apuestas basadas en mis datos personales (signo zodiacal, color favorito, equipo de fútbol), para que mis números reflejen mi identidad y "destino".

#### Criterios de Aceptación

1. WHEN el usuario proporciona su signo zodiacal, THE Sistema SHALL asignar una Semilla_Personal numérica específica para ese signo
2. WHEN el usuario proporciona su color favorito, THE Sistema SHALL mapear el color a un valor numérico basado en longitud de onda del espectro visible
3. WHEN el usuario proporciona su equipo de fútbol, THE Sistema SHALL calcular un valor numérico sumando valores ASCII de las letras del nombre y aplicando módulo 49
4. WHEN el Motor_Amuleto genera una apuesta, THE Sistema SHALL combinar las tres Semillas_Personales con la fecha actual mediante una función hash
5. WHEN el Motor_Amuleto genera apuestas en el mismo día para el mismo usuario, THE Sistema SHALL producir la misma combinación de números
6. WHEN el Motor_Amuleto genera apuestas en días diferentes para el mismo usuario, THE Sistema SHALL producir combinaciones diferentes
7. WHEN el Motor_Amuleto completa el cálculo, THE Sistema SHALL producir exactamente 6 números únicos entre 1 y 49

### Requisito 4: Selección de Columnas y Generación Múltiple

**Historia de Usuario:** Como usuario, quiero elegir cuántas columnas generar (de 1 a 8), para poder crear boletos con múltiples apuestas de una vez.

#### Criterios de Aceptación

1. WHEN el usuario selecciona el número de columnas, THE Sistema SHALL aceptar valores entre 1 y 8 inclusive
2. WHEN el usuario solicita generar apuestas, THE Sistema SHALL producir exactamente el número de columnas seleccionado
3. WHEN el Sistema genera múltiples columnas, THE Sistema SHALL permitir que cada columna use un motor diferente o el mismo motor
4. WHEN el Sistema genera múltiples columnas con el mismo motor, THE Sistema SHALL asegurar que cada columna contenga una combinación diferente

### Requisito 5: Consulta de Resultados Oficiales

**Historia de Usuario:** Como usuario, quiero consultar los últimos resultados oficiales de la Bonoloto, para verificar si mis apuestas guardadas han sido ganadoras.

#### Criterios de Aceptación

1. WHEN el usuario solicita ver resultados, THE Sistema SHALL consultar la API_Bonoloto para obtener el último Sorteo
2. WHEN el Sistema obtiene resultados del último Sorteo, THE Sistema SHALL mostrar la combinación ganadora de 6 números
3. WHEN el Sistema obtiene resultados del último Sorteo, THE Sistema SHALL mostrar el número complementario
4. WHEN el Sistema obtiene resultados del último Sorteo, THE Sistema SHALL mostrar el número de reintegro
5. WHEN el Sistema obtiene resultados del último Sorteo, THE Sistema SHALL mostrar la distribución de premios por categoría

### Requisito 6: Almacenamiento Local de Apuestas

**Historia de Usuario:** Como usuario, quiero guardar mis apuestas favoritas localmente, para poder consultarlas y reutilizarlas sin necesidad de crear una cuenta.

#### Criterios de Aceptación

1. WHEN el usuario guarda una apuesta, THE Sistema SHALL almacenarla en una base de datos SQLite local
2. WHEN el usuario guarda una apuesta, THE Sistema SHALL registrar los 6 números, la fecha de creación y el motor utilizado
3. WHEN el usuario solicita ver apuestas guardadas, THE Sistema SHALL recuperar todas las apuestas de la base de datos local
4. WHEN el usuario elimina una apuesta guardada, THE Sistema SHALL removerla permanentemente de la base de datos local
5. WHEN el Sistema almacena apuestas, THE Sistema SHALL mantener los datos exclusivamente en el dispositivo del usuario

### Requisito 7: Interfaz de Usuario - El Orbe

**Historia de Usuario:** Como usuario, quiero interactuar con una pantalla principal elegante y mística, para que la experiencia de generar apuestas sea visualmente atractiva.

#### Criterios de Aceptación

1. WHEN el usuario accede a la pantalla principal, THE Sistema SHALL mostrar un círculo brillante (El Orbe) que pulsa con animación
2. WHEN el usuario toca El Orbe, THE Sistema SHALL mostrar opciones para seleccionar el número de columnas (1 a 8)
3. WHEN el Sistema muestra la interfaz, THE Sistema SHALL usar una paleta de colores con fondo azul medianoche (#0B0E14) y acentos dorados (#D4AF37)
4. WHEN el usuario selecciona columnas, THE Sistema SHALL mostrar opciones para elegir el motor de generación para cada columna

### Requisito 8: Interfaz de Usuario - La Mesa de Buffon

**Historia de Usuario:** Como usuario, quiero ver una representación visual del experimento de Buffon, para entender cómo se generan mis números mediante este método.

#### Criterios de Aceptación

1. WHEN el usuario selecciona el Motor_Buffon, THE Sistema SHALL mostrar una interfaz con texturas visuales de madera y metal
2. WHEN el Motor_Buffon ejecuta la simulación, THE Sistema SHALL mostrar agujas cayendo sobre una rejilla en animación 3D
3. WHEN las agujas se estabilizan, THE Sistema SHALL resaltar visualmente los 6 espacios seleccionados
4. WHEN la animación completa, THE Sistema SHALL mostrar los 6 números generados de forma clara

### Requisito 9: Interfaz de Usuario - El Altar de Datos

**Historia de Usuario:** Como usuario, quiero introducir mis datos personales en un formulario elegante, para configurar el Motor_Amuleto de forma agradable.

#### Criterios de Aceptación

1. WHEN el usuario accede al formulario de datos personales, THE Sistema SHALL mostrar campos para signo zodiacal, color favorito y equipo de fútbol
2. WHEN el usuario introduce datos, THE Sistema SHALL mostrar animaciones de partículas de luz como retroalimentación visual
3. WHEN el usuario completa el formulario, THE Sistema SHALL almacenar los datos localmente para uso futuro
4. WHEN el Sistema muestra el formulario, THE Sistema SHALL mantener la estética de misticismo moderno con la paleta de colores definida

### Requisito 10: Aviso Legal y Cumplimiento Normativo

**Historia de Usuario:** Como usuario, quiero ver claramente que la aplicación es lúdica y no garantiza premios, para tener expectativas realistas sobre su propósito.

#### Criterios de Aceptación

1. WHEN el Sistema muestra cualquier pantalla, THE Sistema SHALL incluir en el pie de página el texto: "Esta aplicación es una herramienta de generación aleatoria basada en algoritmos lúdicos. No garantiza premios y no tiene vinculación oficial con SELAE. Juega con responsabilidad"
2. WHEN el usuario usa la aplicación por primera vez, THE Sistema SHALL mostrar un aviso legal completo que requiera aceptación explícita
3. WHEN el Sistema genera apuestas, THE Sistema SHALL cumplir con las normativas de Loterías del Estado para aplicaciones informativas
4. WHEN el Sistema almacena datos, THE Sistema SHALL cumplir con regulaciones de protección de datos aplicables

### Requisito 11: Validación de Apuestas

**Historia de Usuario:** Como usuario, quiero que el sistema valide que todas las apuestas generadas sean válidas según las reglas de Bonoloto, para evitar errores al jugar.

#### Criterios de Aceptación

1. WHEN cualquier motor genera una apuesta, THE Sistema SHALL verificar que contenga exactamente 6 números
2. WHEN cualquier motor genera una apuesta, THE Sistema SHALL verificar que todos los números estén en el rango 1 a 49 inclusive
3. WHEN cualquier motor genera una apuesta, THE Sistema SHALL verificar que no haya números duplicados
4. IF una apuesta generada no cumple las validaciones, THEN THE Sistema SHALL regenerar la apuesta hasta obtener una válida
5. WHEN el Sistema valida una apuesta, THE Sistema SHALL ordenar los números de menor a mayor antes de mostrarlos

### Requisito 12: Integración con API de Bonoloto

**Historia de Usuario:** Como desarrollador, quiero que el sistema maneje correctamente la comunicación con la API oficial, para garantizar datos precisos y manejar errores de red.

#### Criterios de Aceptación

1. WHEN el Sistema consulta la API_Bonoloto, THE Sistema SHALL usar el endpoint oficial proporcionado por SELAE
2. IF la API_Bonoloto no responde en 10 segundos, THEN THE Sistema SHALL mostrar un mensaje de error al usuario
3. IF la API_Bonoloto devuelve un error, THEN THE Sistema SHALL registrar el error y mostrar un mensaje informativo
4. WHEN el Sistema recibe datos de la API_Bonoloto, THE Sistema SHALL validar la estructura de los datos antes de procesarlos
5. WHEN el Sistema obtiene datos históricos, THE Sistema SHALL cachear los resultados localmente por 24 horas para reducir llamadas a la API
