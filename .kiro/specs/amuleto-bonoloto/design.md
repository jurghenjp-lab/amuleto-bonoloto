# Documento de Diseño: Amuleto Bonoloto

## Visión General

Amuleto Bonoloto es una aplicación móvil multiplataforma que genera apuestas para la lotería Bonoloto española mediante tres motores algorítmicos distintos. El sistema combina análisis estadístico, simulación matemática y personalización basada en datos del usuario para crear una experiencia lúdica de "amuleto digital".

### Objetivos de Diseño

- **Modularidad**: Cada motor de generación es independiente y puede evolucionar sin afectar a los demás
- **Extensibilidad**: Facilitar la adición de nuevos motores de generación en el futuro
- **Rendimiento**: Generación de apuestas en menos de 2 segundos
- **Experiencia de Usuario**: Interfaces visuales atractivas con animaciones fluidas
- **Confiabilidad**: Validación rigurosa de todas las apuestas generadas

## Arquitectura

### Arquitectura de Alto Nivel

El sistema sigue una arquitectura en capas con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────┐
│                    Capa de Presentación                  │
│  (UI Components: Orbe, Mesa Buffon, Altar de Datos)     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                   Capa de Aplicación                     │
│         (Coordinador de Motores, Validador)              │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    Capa de Dominio                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Motor     │  │    Motor     │  │    Motor     │  │
│  │  Histórico   │  │   Buffon     │  │   Amuleto    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                 Capa de Infraestructura                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  API Client  │  │   SQLite     │  │ Acelerómetro │  │
│  │   Bonoloto   │  │   Storage    │  │   Service    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Decisiones Arquitectónicas

1. **Patrón Strategy para Motores**: Cada motor implementa una interfaz común `IGeneradorApuestas`, permitiendo intercambiarlos dinámicamente
2. **Repository Pattern para Persistencia**: Abstracción del almacenamiento SQLite para facilitar testing y posibles migraciones
3. **Service Layer para API**: Encapsulación de la lógica de comunicación con la API de Bonoloto
4. **Observer Pattern para Acelerómetro**: Desacoplamiento entre la detección de movimiento y la generación de apuestas

## Componentes e Interfaces

### 1. Interfaz IGeneradorApuestas

Contrato común para todos los motores de generación:

```typescript
interface IGeneradorApuestas {
  /**
   * Genera una apuesta válida de 6 números únicos entre 1 y 49
   * @returns Array de 6 números ordenados de menor a mayor
   */
  generarApuesta(): Promise<number[]>;
  
  /**
   * Nombre identificativo del motor
   */
  readonly nombre: string;
  
  /**
   * Indica si el motor requiere configuración previa del usuario
   */
  readonly requiereConfiguracion: boolean;
}
```

### 2. Motor Histórico

**Responsabilidad**: Generar apuestas basadas en análisis estadístico de resultados históricos.

```typescript
class MotorHistorico implements IGeneradorApuestas {
  constructor(
    private apiClient: IBonolotoApiClient,
    private cache: IResultadosCache
  ) {}
  
  async generarApuesta(): Promise<number[]> {
    // 1. Obtener resultados del último año
    const resultados = await this.obtenerResultadosUltimoAno();
    
    // 2. Calcular frecuencias
    const frecuencias = this.calcularFrecuencias(resultados);
    
    // 3. Identificar números calientes (top 15)
    const numerosCalientes = this.obtenerNumerosCalientes(frecuencias, 15);
    
    // 4. Identificar números fríos (>20 sorteos sin aparecer)
    const numerosFrios = this.obtenerNumerosFrios(resultados, 20);
    
    // 5. Seleccionar 4-5 números calientes
    const seleccionCalientes = this.seleccionarAleatorios(numerosCalientes, 4 + Math.random() < 0.5 ? 1 : 0);
    
    // 6. Seleccionar 1 número frío
    const seleccionFrios = this.seleccionarAleatorios(numerosFrios, 1);
    
    // 7. Completar hasta 6 con números restantes
    const apuesta = this.completarApuesta(seleccionCalientes, seleccionFrios);
    
    // 8. Ajustar distribución par/impar
    return this.ajustarDistribucionParImpar(apuesta);
  }
  
  private ajustarDistribucionParImpar(apuesta: number[]): number[] {
    const pares = apuesta.filter(n => n % 2 === 0).length;
    const impares = 6 - pares;
    
    // Distribuciones válidas: 3:3, 4:2, 2:4
    if ((pares === 3 && impares === 3) ||
        (pares === 4 && impares === 2) ||
        (pares === 2 && impares === 4)) {
      return apuesta.sort((a, b) => a - b);
    }
    
    // Reemplazar números para ajustar distribución
    return this.reemplazarParaDistribucion(apuesta);
  }
}
```

**Dependencias**:
- `IBonolotoApiClient`: Cliente para consultar API oficial
- `IResultadosCache`: Caché local de resultados (24 horas)

### 3. Motor Buffon

**Responsabilidad**: Generar apuestas mediante simulación del experimento de la Aguja de Buffon.

**Fundamento Matemático**: El experimento de Buffon estima π lanzando agujas sobre líneas paralelas. Adaptamos este concepto creando una rejilla de 49 espacios y simulando lanzamientos donde las agujas que cruzan líneas con mayor "precisión matemática" determinan los números.

```typescript
class MotorBuffon implements IGeneradorApuestas {
  constructor(
    private acelerometroService: IAcelerometroService
  ) {}
  
  async generarApuesta(): Promise<number[]> {
    // 1. Obtener fuerza de aceleración
    const aceleracion = await this.acelerometroService.obtenerAceleracion();
    
    // 2. Calcular número de agujas basado en fuerza
    const numAgujas = this.calcularNumeroAgujas(aceleracion);
    
    // 3. Simular lanzamientos
    const lanzamientos = this.simularLanzamientos(numAgujas);
    
    // 4. Calcular intersecciones con rejilla de 49 espacios
    const intersecciones = this.calcularIntersecciones(lanzamientos);
    
    // 5. Seleccionar 6 espacios con mayor precisión
    const espaciosSeleccionados = this.seleccionarMejoresIntersecciones(intersecciones, 6);
    
    // 6. Convertir espacios a números (1-49)
    return espaciosSeleccionados.map(e => e + 1).sort((a, b) => a - b);
  }
  
  private simularLanzamientos(numAgujas: number): Aguja[] {
    const agujas: Aguja[] = [];
    const longitudAguja = 1.0;
    const separacionLineas = 2.0;
    
    for (let i = 0; i < numAgujas; i++) {
      // Posición aleatoria en rejilla 7x7 (49 espacios)
      const x = Math.random() * 7;
      const y = Math.random() * 7;
      
      // Ángulo aleatorio
      const angulo = Math.random() * Math.PI;
      
      agujas.push({
        x, y, angulo,
        longitudAguja,
        separacionLineas
      });
    }
    
    return agujas;
  }
  
  private calcularIntersecciones(agujas: Aguja[]): Map<number, number> {
    const intersecciones = new Map<number, number>();
    
    for (const aguja of agujas) {
      // Calcular extremos de la aguja
      const x1 = aguja.x;
      const y1 = aguja.y;
      const x2 = aguja.x + aguja.longitudAguja * Math.cos(aguja.angulo);
      const y2 = aguja.y + aguja.longitudAguja * Math.sin(aguja.angulo);
      
      // Determinar espacio de la rejilla (0-48)
      const espacioX = Math.floor(aguja.x);
      const espacioY = Math.floor(aguja.y);
      const espacio = espacioY * 7 + espacioX;
      
      if (espacio >= 0 && espacio < 49) {
        // Calcular "precisión" de intersección (distancia a líneas)
        const precision = this.calcularPrecisionInterseccion(x1, y1, x2, y2);
        
        // Acumular precisión para este espacio
        const precisionActual = intersecciones.get(espacio) || 0;
        intersecciones.set(espacio, precisionActual + precision);
      }
    }
    
    return intersecciones;
  }
  
  private calcularPrecisionInterseccion(x1: number, y1: number, x2: number, y2: number): number {
    // Calcular distancia mínima a líneas horizontales y verticales
    const distanciaHorizontal = Math.min(
      Math.abs(y1 - Math.floor(y1)),
      Math.abs(y1 - Math.ceil(y1)),
      Math.abs(y2 - Math.floor(y2)),
      Math.abs(y2 - Math.ceil(y2))
    );
    
    const distanciaVertical = Math.min(
      Math.abs(x1 - Math.floor(x1)),
      Math.abs(x1 - Math.ceil(x1)),
      Math.abs(x2 - Math.floor(x2)),
      Math.abs(x2 - Math.ceil(x2))
    );
    
    // Menor distancia = mayor precisión
    return 1.0 / (Math.min(distanciaHorizontal, distanciaVertical) + 0.01);
  }
}

interface Aguja {
  x: number;
  y: number;
  angulo: number;
  longitudAguja: number;
  separacionLineas: number;
}
```

**Dependencias**:
- `IAcelerometroService`: Servicio para acceder al acelerómetro del dispositivo

### 4. Motor Amuleto

**Responsabilidad**: Generar apuestas personalizadas basadas en datos del usuario.

```typescript
class MotorAmuleto implements IGeneradorApuestas {
  constructor(
    private configuracionUsuario: IConfiguracionUsuario
  ) {}
  
  async generarApuesta(): Promise<number[]> {
    // 1. Obtener datos del usuario
    const config = await this.configuracionUsuario.obtener();
    
    if (!config) {
      throw new Error('Motor Amuleto requiere configuración del usuario');
    }
    
    // 2. Calcular semillas
    const semillaZodiacal = this.calcularSemillaZodiacal(config.signoZodiacal);
    const semillaColor = this.calcularSemillaColor(config.colorFavorito);
    const semillaEquipo = this.calcularSemillaEquipo(config.equipoFutbol);
    
    // 3. Combinar con fecha actual
    const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 4. Generar hash determinista
    const semillaCombinada = `${semillaZodiacal}-${semillaColor}-${semillaEquipo}-${fechaActual}`;
    const hash = this.generarHash(semillaCombinada);
    
    // 5. Convertir hash a 6 números únicos
    return this.hashANumeros(hash);
  }
  
  private calcularSemillaZodiacal(signo: SignoZodiacal): number {
    const mapeoSignos: Record<SignoZodiacal, number> = {
      'Aries': 9, 'Tauro': 6, 'Géminis': 5,
      'Cáncer': 2, 'Leo': 1, 'Virgo': 5,
      'Libra': 6, 'Escorpio': 9, 'Sagitario': 3,
      'Capricornio': 8, 'Acuario': 4, 'Piscis': 7
    };
    return mapeoSignos[signo];
  }
  
  private calcularSemillaColor(color: string): number {
    // Mapeo basado en longitud de onda del espectro visible
    const coloresBase: Record<string, number> = {
      'Rojo': 1, 'Naranja': 8, 'Amarillo': 15,
      'Verde': 22, 'Azul': 29, 'Añil': 36,
      'Violeta': 43, 'Rosa': 10, 'Blanco': 25,
      'Negro': 49
    };
    
    return coloresBase[color] || 25; // Default: blanco
  }
  
  private calcularSemillaEquipo(nombreEquipo: string): number {
    // Sumar valores ASCII y aplicar módulo 49
    let suma = 0;
    for (let i = 0; i < nombreEquipo.length; i++) {
      suma += nombreEquipo.charCodeAt(i);
    }
    return (suma % 49) + 1; // Rango 1-49
  }
  
  private generarHash(entrada: string): string {
    // Implementación de hash simple pero determinista
    // En producción, usar crypto.subtle.digest('SHA-256', ...)
    let hash = 0;
    for (let i = 0; i < entrada.length; i++) {
      const char = entrada.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    return Math.abs(hash).toString(16);
  }
  
  private hashANumeros(hash: string): number[] {
    const numeros = new Set<number>();
    let indice = 0;
    
    while (numeros.size < 6 && indice < hash.length - 1) {
      // Tomar pares de caracteres hexadecimales
      const par = hash.substring(indice, indice + 2);
      const valor = parseInt(par, 16);
      
      // Mapear a rango 1-49
      const numero = (valor % 49) + 1;
      numeros.add(numero);
      
      indice += 2;
    }
    
    // Si no hay suficientes números únicos, generar más con semilla derivada
    while (numeros.size < 6) {
      const hashExtendido = this.generarHash(hash + numeros.size);
      const valor = parseInt(hashExtendido.substring(0, 2), 16);
      const numero = (valor % 49) + 1;
      numeros.add(numero);
    }
    
    return Array.from(numeros).sort((a, b) => a - b);
  }
}

type SignoZodiacal = 'Aries' | 'Tauro' | 'Géminis' | 'Cáncer' | 'Leo' | 'Virgo' |
                     'Libra' | 'Escorpio' | 'Sagitario' | 'Capricornio' | 'Acuario' | 'Piscis';
```

**Dependencias**:
- `IConfiguracionUsuario`: Repositorio de configuración personal del usuario

### 5. Coordinador de Motores

**Responsabilidad**: Orquestar la generación de múltiples columnas y validar resultados.

```typescript
class CoordinadorMotores {
  constructor(
    private motores: Map<string, IGeneradorApuestas>,
    private validador: ValidadorApuestas
  ) {}
  
  async generarColumnas(
    numeroColumnas: number,
    configuracionMotores: string[]
  ): Promise<Apuesta[]> {
    if (numeroColumnas < 1 || numeroColumnas > 8) {
      throw new Error('Número de columnas debe estar entre 1 y 8');
    }
    
    if (configuracionMotores.length !== numeroColumnas) {
      throw new Error('Debe especificar un motor para cada columna');
    }
    
    const apuestas: Apuesta[] = [];
    const combinacionesGeneradas = new Set<string>();
    
    for (let i = 0; i < numeroColumnas; i++) {
      const nombreMotor = configuracionMotores[i];
      const motor = this.motores.get(nombreMotor);
      
      if (!motor) {
        throw new Error(`Motor desconocido: ${nombreMotor}`);
      }
      
      // Generar apuesta única
      let numeros: number[];
      let intentos = 0;
      const maxIntentos = 100;
      
      do {
        numeros = await motor.generarApuesta();
        intentos++;
        
        if (intentos >= maxIntentos) {
          throw new Error('No se pudo generar una combinación única');
        }
      } while (combinacionesGeneradas.has(numeros.join(',')));
      
      // Validar apuesta
      this.validador.validar(numeros);
      
      combinacionesGeneradas.add(numeros.join(','));
      apuestas.push({
        numeros,
        motor: nombreMotor,
        fechaGeneracion: new Date()
      });
    }
    
    return apuestas;
  }
}
```

### 6. Validador de Apuestas

**Responsabilidad**: Verificar que las apuestas cumplan todas las reglas de Bonoloto.

```typescript
class ValidadorApuestas {
  validar(numeros: number[]): void {
    // Regla 1: Exactamente 6 números
    if (numeros.length !== 6) {
      throw new Error(`Apuesta debe tener 6 números, tiene ${numeros.length}`);
    }
    
    // Regla 2: Todos en rango 1-49
    for (const num of numeros) {
      if (num < 1 || num > 49) {
        throw new Error(`Número ${num} fuera de rango (1-49)`);
      }
    }
    
    // Regla 3: Sin duplicados
    const unicos = new Set(numeros);
    if (unicos.size !== 6) {
      throw new Error('La apuesta contiene números duplicados');
    }
    
    // Regla 4: Números deben ser enteros
    for (const num of numeros) {
      if (!Number.isInteger(num)) {
        throw new Error(`Número ${num} no es entero`);
      }
    }
  }
  
  estaOrdenada(numeros: number[]): boolean {
    for (let i = 0; i < numeros.length - 1; i++) {
      if (numeros[i] >= numeros[i + 1]) {
        return false;
      }
    }
    return true;
  }
}
```

### 7. Cliente API Bonoloto

**Responsabilidad**: Comunicación con la API oficial de SELAE.

```typescript
interface IBonolotoApiClient {
  obtenerUltimoSorteo(): Promise<ResultadoSorteo>;
  obtenerResultadosRango(fechaInicio: Date, fechaFin: Date): Promise<ResultadoSorteo[]>;
}

class BonolotoApiClient implements IBonolotoApiClient {
  private readonly baseUrl = 'https://www.loteriasyapuestas.es/servicios/buscadorSorteos';
  private readonly timeout = 10000; // 10 segundos
  
  async obtenerUltimoSorteo(): Promise<ResultadoSorteo> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(`${this.baseUrl}?game_id=BONO`, {
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parsearResultado(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout al consultar API de Bonoloto');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  
  async obtenerResultadosRango(fechaInicio: Date, fechaFin: Date): Promise<ResultadoSorteo[]> {
    // Implementación similar con parámetros de fecha
    // ...
  }
  
  private parsearResultado(data: any): ResultadoSorteo {
    // Validar estructura de datos
    if (!data.combinacion || !Array.isArray(data.combinacion)) {
      throw new Error('Estructura de datos inválida de la API');
    }
    
    return {
      fecha: new Date(data.fecha),
      combinacionGanadora: data.combinacion.slice(0, 6),
      complementario: data.complementario,
      reintegro: data.reintegro,
      premios: data.premios
    };
  }
}
```

### 8. Repositorio de Apuestas

**Responsabilidad**: Persistencia local de apuestas guardadas.

```typescript
interface IRepositorioApuestas {
  guardar(apuesta: Apuesta): Promise<void>;
  obtenerTodas(): Promise<Apuesta[]>;
  eliminar(id: string): Promise<void>;
}

class RepositorioApuestasSQLite implements IRepositorioApuestas {
  constructor(private db: SQLiteDatabase) {
    this.inicializarTablas();
  }
  
  private async inicializarTablas(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS apuestas (
        id TEXT PRIMARY KEY,
        numeros TEXT NOT NULL,
        motor TEXT NOT NULL,
        fecha_generacion TEXT NOT NULL
      )
    `);
  }
  
  async guardar(apuesta: Apuesta): Promise<void> {
    const id = this.generarId();
    const numerosJson = JSON.stringify(apuesta.numeros);
    
    await this.db.run(
      'INSERT INTO apuestas (id, numeros, motor, fecha_generacion) VALUES (?, ?, ?, ?)',
      [id, numerosJson, apuesta.motor, apuesta.fechaGeneracion.toISOString()]
    );
  }
  
  async obtenerTodas(): Promise<Apuesta[]> {
    const rows = await this.db.all('SELECT * FROM apuestas ORDER BY fecha_generacion DESC');
    
    return rows.map(row => ({
      id: row.id,
      numeros: JSON.parse(row.numeros),
      motor: row.motor,
      fechaGeneracion: new Date(row.fecha_generacion)
    }));
  }
  
  async eliminar(id: string): Promise<void> {
    await this.db.run('DELETE FROM apuestas WHERE id = ?', [id]);
  }
  
  private generarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
```

## Modelos de Datos

### Apuesta

```typescript
interface Apuesta {
  id?: string;
  numeros: number[]; // Array de 6 números ordenados (1-49)
  motor: string; // 'historico' | 'buffon' | 'amuleto'
  fechaGeneracion: Date;
}
```

### ResultadoSorteo

```typescript
interface ResultadoSorteo {
  fecha: Date;
  combinacionGanadora: number[]; // 6 números
  complementario: number;
  reintegro: number;
  premios: DistribucionPremios;
}

interface DistribucionPremios {
  categoria1: { acertantes: number; premio: number }; // 6 aciertos
  categoria2: { acertantes: number; premio: number }; // 5 aciertos + complementario
  categoria3: { acertantes: number; premio: number }; // 5 aciertos
  categoria4: { acertantes: number; premio: number }; // 4 aciertos
  categoria5: { acertantes: number; premio: number }; // 3 aciertos
  reintegro: { acertantes: number; premio: number };
}
```

### ConfiguracionUsuario

```typescript
interface ConfiguracionUsuario {
  signoZodiacal: SignoZodiacal;
  colorFavorito: string;
  equipoFutbol: string;
  fechaConfiguracion: Date;
}
```

### CacheResultados

```typescript
interface CacheResultados {
  resultados: ResultadoSorteo[];
  fechaCache: Date;
  validoHasta: Date; // fechaCache + 24 horas
}
```

