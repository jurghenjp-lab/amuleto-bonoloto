# Plan de Implementación: Amuleto Bonoloto

## Visión General

Este plan implementa una aplicación móvil multiplataforma que genera apuestas para la Bonoloto española mediante tres motores algorítmicos: análisis estadístico histórico, simulación de la Aguja de Buffon, y personalización basada en datos del usuario. La implementación se realizará en TypeScript con React Native para soporte multiplataforma.

## Tareas

- [x] 1. Configurar estructura del proyecto y dependencias
  - Inicializar proyecto React Native con TypeScript
  - Configurar SQLite para almacenamiento local
  - Instalar dependencias para acelerómetro y animaciones
  - Configurar framework de testing (Jest + fast-check para property-based testing)
  - _Requisitos: Todos los requisitos técnicos_

- [x] 2. Implementar modelos de datos e interfaces core
  - [x] 2.1 Crear interfaces TypeScript para modelos de datos
    - Definir interfaces: Apuesta, ResultadoSorteo, ConfiguracionUsuario, CacheResultados
    - Definir tipos: SignoZodiacal, DistribucionPremios
    - _Requisitos: 1.1, 3.1, 5.1, 6.2_
  
  - [x] 2.2 Crear interfaz IGeneradorApuestas
    - Definir contrato común para todos los motores
    - Incluir métodos: generarApuesta(), propiedades: nombre, requiereConfiguracion
    - _Requisitos: 1.1, 2.1, 3.1_

- [x] 3. Implementar Validador de Apuestas
  - [x] 3.1 Crear clase ValidadorApuestas
    - Implementar método validar() con las 4 reglas de validación
    - Implementar método estaOrdenada()
    - _Requisitos: 11.1, 11.2, 11.3, 11.5_
  
  - [x] 3.2 Escribir tests de propiedades para ValidadorApuestas
    - **Propiedad 1: Validación rechaza apuestas inválidas**
    - *Para cualquier* array de números que no cumpla las reglas (longitud ≠ 6, números fuera de rango 1-49, duplicados, no enteros), el validador debe lanzar un error
    - **Valida: Requisitos 11.1, 11.2, 11.3**
  
  - [x] 3.3 Escribir tests unitarios para ValidadorApuestas
    - Probar casos específicos: apuesta vacía, números negativos, números > 49, duplicados
    - Probar método estaOrdenada() con arrays ordenados y desordenados
    - _Requisitos: 11.1, 11.2, 11.3, 11.5_

- [x] 4. Implementar Cliente API Bonoloto
  - [x] 4.1 Crear interfaz IBonolotoApiClient
    - Definir métodos: obtenerUltimoSorteo(), obtenerResultadosRango()
    - _Requisitos: 1.1, 5.1, 12.1_
  
  - [x] 4.2 Implementar clase BonolotoApiClient
    - Configurar endpoint oficial de SELAE
    - Implementar timeout de 10 segundos
    - Implementar manejo de errores HTTP
    - Implementar método parsearResultado() con validación de estructura
    - _Requisitos: 12.1, 12.2, 12.3, 12.4_
  
  - [x] 4.3 Escribir tests unitarios para BonolotoApiClient
    - Mockear respuestas de la API
    - Probar timeout, errores HTTP, datos inválidos
    - Probar parseo correcto de resultados
    - _Requisitos: 12.2, 12.3, 12.4_

- [x] 5. Implementar sistema de caché de resultados
  - [x] 5.1 Crear clase CacheResultados
    - Implementar almacenamiento local con validez de 24 horas
    - Implementar métodos: guardar(), obtener(), esValido()
    - _Requisitos: 12.5_
  
  - [x] 5.2 Escribir tests unitarios para CacheResultados
    - Probar expiración de caché después de 24 horas
    - Probar recuperación de datos cacheados válidos
    - _Requisitos: 12.5_

- [x] 6. Implementar Motor Histórico
  - [x] 6.1 Crear clase MotorHistorico implementando IGeneradorApuestas
    - Implementar método generarApuesta()
    - Implementar calcularFrecuencias() para análisis estadístico
    - Implementar obtenerNumerosCalientes() (top 15)
    - Implementar obtenerNumerosFrios() (>20 sorteos sin aparecer)
    - Implementar ajustarDistribucionParImpar() (3:3, 4:2, 2:4)
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 6.2 Escribir test de propiedad para Motor Histórico - Validez de apuestas
    - **Propiedad 2: Apuestas del Motor Histórico son válidas**
    - *Para cualquier* ejecución del Motor Histórico, la apuesta generada debe pasar todas las validaciones (6 números únicos, rango 1-49, ordenados)
    - **Valida: Requisitos 1.5, 11.1, 11.2, 11.3**
  
  - [x] 6.3 Escribir test de propiedad para Motor Histórico - Distribución par/impar
    - **Propiedad 3: Distribución par/impar correcta**
    - *Para cualquier* apuesta generada por el Motor Histórico, debe tener distribución 3:3, 4:2, o 2:4 de pares e impares
    - **Valida: Requisito 1.4**
  
  - [x] 6.4 Escribir tests unitarios para Motor Histórico
    - Probar selección de números calientes (al menos 4 de top 15)
    - Probar inclusión de exactamente 1 número frío
    - Mockear datos de API para testing determinista
    - _Requisitos: 1.2, 1.3_

- [x] 7. Implementar servicio de Acelerómetro
  - [x] 7.1 Crear interfaz IAcelerometroService
    - Definir método obtenerAceleracion()
    - _Requisitos: 2.1_
  
  - [x] 7.2 Implementar clase AcelerometroService
    - Integrar con API de acelerómetro de React Native
    - Implementar detección de umbral de aceleración
    - _Requisitos: 2.1, 2.2_
  
  - [x] 7.3 Escribir tests unitarios para AcelerometroService
    - Mockear lecturas del acelerómetro
    - Probar detección de umbral
    - _Requisitos: 2.1, 2.2_

- [x] 8. Implementar Motor Buffon
  - [x] 8.1 Crear clase MotorBuffon implementando IGeneradorApuestas
    - Implementar método generarApuesta()
    - Implementar calcularNumeroAgujas() basado en aceleración
    - Implementar simularLanzamientos() con rejilla 7x7 (49 espacios)
    - Implementar calcularIntersecciones() con precisión matemática
    - Implementar calcularPrecisionInterseccion() (distancia a líneas)
    - Implementar seleccionarMejoresIntersecciones() (top 6)
    - _Requisitos: 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [x] 8.2 Escribir test de propiedad para Motor Buffon - Validez de apuestas
    - **Propiedad 4: Apuestas del Motor Buffon son válidas**
    - *Para cualquier* nivel de aceleración, la apuesta generada debe pasar todas las validaciones (6 números únicos, rango 1-49, ordenados)
    - **Valida: Requisitos 2.6, 11.1, 11.2, 11.3**
  
  - [x] 8.3 Escribir tests unitarios para Motor Buffon
    - Probar simulación con diferentes niveles de aceleración
    - Verificar cálculo correcto de intersecciones
    - Probar conversión de espacios a números (1-49)
    - _Requisitos: 2.3, 2.4, 2.5_

- [x] 9. Implementar repositorio de configuración de usuario
  - [x] 9.1 Crear interfaz IConfiguracionUsuario
    - Definir métodos: guardar(), obtener(), existe()
    - _Requisitos: 3.1, 3.2, 3.3_
  
  - [x] 9.2 Implementar clase ConfiguracionUsuarioSQLite
    - Crear tabla de configuración en SQLite
    - Implementar persistencia de signo zodiacal, color favorito, equipo de fútbol
    - _Requisitos: 3.1, 3.2, 3.3, 9.3_
  
  - [x] 9.3 Escribir tests unitarios para ConfiguracionUsuario
    - Probar guardado y recuperación de configuración
    - Probar actualización de configuración existente
    - _Requisitos: 3.1, 3.2, 3.3, 9.3_

- [x] 10. Implementar Motor Amuleto
  - [x] 10.1 Crear clase MotorAmuleto implementando IGeneradorApuestas
    - Implementar método generarApuesta()
    - Implementar calcularSemillaZodiacal() con mapeo de signos
    - Implementar calcularSemillaColor() basado en longitud de onda
    - Implementar calcularSemillaEquipo() con suma ASCII módulo 49
    - Implementar generarHash() determinista
    - Implementar hashANumeros() para convertir hash a 6 números únicos
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.7_
  
  - [x] 10.2 Escribir test de propiedad para Motor Amuleto - Determinismo mismo día
    - **Propiedad 5: Determinismo en el mismo día**
    - *Para cualquier* configuración de usuario, generar apuestas múltiples veces en el mismo día debe producir la misma combinación
    - **Valida: Requisito 3.5**
  
  - [x] 10.3 Escribir test de propiedad para Motor Amuleto - Variación entre días
    - **Propiedad 6: Variación entre días diferentes**
    - *Para cualquier* configuración de usuario, generar apuestas en días diferentes debe producir combinaciones diferentes
    - **Valida: Requisito 3.6**
  
  - [x] 10.4 Escribir test de propiedad para Motor Amuleto - Validez de apuestas
    - **Propiedad 7: Apuestas del Motor Amuleto son válidas**
    - *Para cualquier* configuración de usuario, la apuesta generada debe pasar todas las validaciones (6 números únicos, rango 1-49, ordenados)
    - **Valida: Requisitos 3.7, 11.1, 11.2, 11.3**
  
  - [x] 10.5 Escribir tests unitarios para Motor Amuleto
    - Probar cálculo de semillas para diferentes signos zodiacales
    - Probar cálculo de semillas para diferentes colores
    - Probar cálculo de semillas para diferentes equipos
    - Verificar que el hash es determinista
    - _Requisitos: 3.1, 3.2, 3.3, 3.4_

- [x] 11. Checkpoint - Validar motores de generación
  - Ejecutar todos los tests de los tres motores
  - Verificar que cada motor genera apuestas válidas
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [x] 12. Implementar Coordinador de Motores
  - [x] 12.1 Crear clase CoordinadorMotores
    - Implementar método generarColumnas() con validación de parámetros
    - Implementar lógica para evitar combinaciones duplicadas
    - Integrar con ValidadorApuestas
    - Implementar registro de motores disponibles
    - _Requisitos: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 12.2 Escribir test de propiedad para Coordinador - Unicidad de columnas
    - **Propiedad 8: Columnas únicas**
    - *Para cualquier* número de columnas (1-8) y configuración de motores, todas las columnas generadas deben tener combinaciones diferentes
    - **Valida: Requisito 4.4**
  
  - [x] 12.3 Escribir tests unitarios para Coordinador
    - Probar generación con diferentes números de columnas (1-8)
    - Probar mezcla de motores diferentes
    - Probar manejo de errores (columnas fuera de rango, motor desconocido)
    - _Requisitos: 4.1, 4.2, 4.3_

- [x] 13. Implementar Repositorio de Apuestas
  - [x] 13.1 Crear interfaz IRepositorioApuestas
    - Definir métodos: guardar(), obtenerTodas(), eliminar()
    - _Requisitos: 6.1, 6.3, 6.4_
  
  - [x] 13.2 Implementar clase RepositorioApuestasSQLite
    - Crear tabla de apuestas con campos: id, numeros, motor, fecha_generacion
    - Implementar método inicializarTablas()
    - Implementar persistencia con serialización JSON de números
    - Implementar generación de IDs únicos
    - _Requisitos: 6.1, 6.2, 6.5_
  
  - [x] 13.3 Escribir test de propiedad para Repositorio - Round trip
    - **Propiedad 9: Persistencia round trip**
    - *Para cualquier* apuesta válida, guardarla y luego recuperarla debe producir una apuesta equivalente (mismos números, motor, fecha)
    - **Valida: Requisitos 6.1, 6.2, 6.3**
  
  - [x] 13.4 Escribir tests unitarios para Repositorio
    - Probar guardado de apuestas
    - Probar recuperación ordenada por fecha (más recientes primero)
    - Probar eliminación de apuestas
    - Probar que los datos permanecen locales
    - _Requisitos: 6.1, 6.3, 6.4, 6.5_

- [x] 14. Implementar componente UI - El Orbe (pantalla principal)
  - [x] 14.1 Crear componente OrbeScreen
    - Implementar círculo brillante con animación de pulso
    - Implementar paleta de colores: fondo #0B0E14, acentos #D4AF37
    - Implementar interacción táctil para mostrar selector de columnas
    - Implementar selector de número de columnas (1-8)
    - Implementar selector de motor por columna
    - _Requisitos: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 14.2 Escribir tests de componente para OrbeScreen
    - Probar renderizado del orbe
    - Probar interacción táctil
    - Probar selector de columnas
    - _Requisitos: 7.1, 7.2, 7.4_

- [x] 15. Implementar componente UI - La Mesa de Buffon
  - [x] 15.1 Crear componente MesaBuffonScreen
    - Implementar texturas visuales de madera y metal
    - Implementar animación 3D de agujas cayendo sobre rejilla
    - Implementar resaltado visual de 6 espacios seleccionados
    - Implementar visualización de números generados
    - _Requisitos: 8.1, 8.2, 8.3, 8.4_
  
  - [x] 15.2 Escribir tests de componente para MesaBuffonScreen
    - Probar renderizado de la mesa
    - Probar animación de agujas
    - Probar visualización de resultados
    - _Requisitos: 8.2, 8.3, 8.4_

- [x] 16. Implementar componente UI - El Altar de Datos
  - [x] 16.1 Crear componente AltarDatosScreen
    - Implementar formulario con campos: signo zodiacal, color favorito, equipo de fútbol
    - Implementar animaciones de partículas de luz
    - Implementar guardado de configuración
    - Mantener estética de misticismo moderno con paleta definida
    - _Requisitos: 9.1, 9.2, 9.3, 9.4_
  
  - [x] 16.2 Escribir tests de componente para AltarDatosScreen
    - Probar renderizado del formulario
    - Probar validación de campos
    - Probar guardado de configuración
    - _Requisitos: 9.1, 9.3_

- [x] 17. Implementar pantalla de resultados oficiales
  - [x] 17.1 Crear componente ResultadosScreen
    - Implementar consulta a API de Bonoloto
    - Mostrar combinación ganadora (6 números)
    - Mostrar número complementario
    - Mostrar número de reintegro
    - Mostrar distribución de premios por categoría
    - Implementar manejo de errores de red
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 17.2 Escribir tests de componente para ResultadosScreen
    - Probar renderizado de resultados
    - Probar manejo de errores de API
    - Probar visualización de premios
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 18. Implementar pantalla de apuestas guardadas
  - [x] 18.1 Crear componente ApuestasGuardadasScreen
    - Implementar lista de apuestas guardadas
    - Mostrar números, motor usado, y fecha de generación
    - Implementar funcionalidad de eliminación
    - Implementar comparación con últimos resultados
    - _Requisitos: 6.3, 6.4_
  
  - [x] 18.2 Escribir tests de componente para ApuestasGuardadasScreen
    - Probar renderizado de lista
    - Probar eliminación de apuestas
    - Probar comparación con resultados
    - _Requisitos: 6.3, 6.4_

- [x] 19. Implementar aviso legal y cumplimiento normativo
  - [x] 19.1 Crear componente AvisoLegal
    - Implementar texto de disclaimer en pie de página
    - Implementar modal de aviso legal completo en primer uso
    - Implementar aceptación explícita de términos
    - Guardar estado de aceptación localmente
    - _Requisitos: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 19.2 Escribir tests de componente para AvisoLegal
    - Probar visualización de disclaimer
    - Probar modal de primer uso
    - Probar guardado de aceptación
    - _Requisitos: 10.1, 10.2_

- [x] 20. Integrar navegación y flujo de la aplicación
  - [x] 20.1 Configurar React Navigation
    - Definir stack de navegación principal
    - Implementar transiciones entre pantallas
    - Configurar pantalla inicial (OrbeScreen)
    - _Requisitos: Todos los requisitos de UI_
  
  - [x] 20.2 Conectar componentes con servicios
    - Inyectar dependencias (motores, repositorios, API client)
    - Implementar manejo de estado global (Context API o Redux)
    - Conectar eventos de UI con lógica de negocio
    - _Requisitos: Todos los requisitos funcionales_

- [x] 21. Checkpoint final - Testing integral
  - Ejecutar suite completa de tests (unitarios + property-based)
  - Verificar que todos los requisitos están cubiertos
  - Probar flujo completo de usuario en simulador/dispositivo
  - Preguntar al usuario si hay ajustes finales necesarios

- [x] 22. Optimización y pulido
  - [x] 22.1 Optimizar rendimiento
    - Verificar que generación de apuestas toma < 2 segundos
    - Optimizar animaciones para 60 FPS
    - Implementar lazy loading de componentes pesados
    - _Requisitos: Objetivos de diseño - Rendimiento_
  
  - [x] 22.2 Pulir experiencia de usuario
    - Ajustar animaciones y transiciones
    - Verificar accesibilidad (tamaños de fuente, contraste)
    - Implementar feedback visual para todas las acciones
    - _Requisitos: 7.3, 8.1, 9.2, 9.4_

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los checkpoints aseguran validación incremental
- Los tests de propiedades validan corrección universal con mínimo 100 iteraciones
- Los tests unitarios validan ejemplos específicos y casos borde
- La implementación usa TypeScript con React Native para soporte multiplataforma
- Se recomienda usar fast-check como librería de property-based testing para TypeScript
