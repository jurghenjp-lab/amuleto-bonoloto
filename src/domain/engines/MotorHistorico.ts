/**
 * Motor Histórico - Generación basada en análisis estadístico
 * Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { IGeneradorApuestas, IBonolotoApiClient } from '../interfaces';
import { ResultadoSorteo } from '../../types';

interface FrecuenciasNumeros {
  [numero: number]: number;
}

interface UltimaAparicion {
  [numero: number]: number; // Número de sorteos desde última aparición
}

export class MotorHistorico implements IGeneradorApuestas {
  readonly nombre = 'Motor Histórico';
  readonly requiereConfiguracion = false;

  constructor(
    private apiClient: IBonolotoApiClient,
    private cache?: any // CacheResultados opcional
  ) {}

  /**
   * Genera una apuesta basada en análisis estadístico histórico
   * Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5
   */
  async generarApuesta(): Promise<number[]> {
    // 1. Obtener resultados del último año
    const resultados = await this.obtenerResultadosUltimoAno();

    // 2. Calcular frecuencias
    const frecuencias = this.calcularFrecuencias(resultados);

    // 3. Identificar números calientes (top 15) y todos los no-fríos
    const todosCalientes = this.obtenerNumerosCalientes(frecuencias, 15);

    // 4. Identificar números fríos (>20 sorteos sin aparecer)
    const numerosFrios = this.obtenerNumerosFrios(resultados, 20);
    const conjuntoFrios = new Set(numerosFrios);

    // Filtrar calientes para excluir fríos
    const numerosCalientes = todosCalientes.filter(n => !conjuntoFrios.has(n));

    // Pool de números no-fríos para completar (todos los no-fríos ordenados por frecuencia)
    const noFrios = this.obtenerNumerosCalientes(frecuencias, 49).filter(n => !conjuntoFrios.has(n));

    // 5. Seleccionar 4-5 números calientes (Requisito 1.2)
    const cantidadCalientes = Math.random() < 0.5 ? 4 : 5;
    const seleccionCalientes = this.seleccionarAleatorios(numerosCalientes, cantidadCalientes);

    // 6. Seleccionar 1 número frío (Requisito 1.3)
    const seleccionFrios = this.seleccionarAleatorios(numerosFrios, 1);

    // 7. Completar hasta 6 con números no-fríos
    const apuesta = this.completarApuesta(seleccionCalientes, seleccionFrios, conjuntoFrios, noFrios);

    // 8. Ajustar distribución par/impar (Requisito 1.4)
    const apuestaAjustada = this.ajustarDistribucionParImpar(apuesta, conjuntoFrios);

    // 9. Ordenar y retornar
    return apuestaAjustada.sort((a, b) => a - b);
  }

  /**
   * Obtiene resultados del último año
   * Requisito: 1.1
   */
  private async obtenerResultadosUltimoAno(): Promise<ResultadoSorteo[]> {
    // Intentar obtener del caché primero
    if (this.cache) {
      const resultadosCacheados = await this.cache.obtener();
      if (resultadosCacheados) {
        return resultadosCacheados;
      }
    }

    // Si no hay caché, consultar API
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);

    const resultados = await this.apiClient.obtenerResultadosRango(fechaInicio, fechaFin);

    // Guardar en caché si está disponible
    if (this.cache) {
      await this.cache.guardar(resultados);
    }

    return resultados;
  }

  /**
   * Calcula la frecuencia de aparición de cada número
   * Requisito: 1.2
   */
  calcularFrecuencias(resultados: ResultadoSorteo[]): FrecuenciasNumeros {
    const frecuencias: FrecuenciasNumeros = {};

    // Inicializar todos los números (1-49) con frecuencia 0
    for (let i = 1; i <= 49; i++) {
      frecuencias[i] = 0;
    }

    // Contar apariciones
    for (const resultado of resultados) {
      for (const numero of resultado.combinacionGanadora) {
        frecuencias[numero]++;
      }
    }

    return frecuencias;
  }

  /**
   * Obtiene los números más frecuentes (calientes)
   * Requisito: 1.2
   */
  obtenerNumerosCalientes(frecuencias: FrecuenciasNumeros, cantidad: number): number[] {
    // Convertir a array y ordenar por frecuencia descendente
    const numerosOrdenados = Object.entries(frecuencias)
      .map(([numero, freq]) => ({ numero: parseInt(numero), frecuencia: freq }))
      .sort((a, b) => b.frecuencia - a.frecuencia);

    // Tomar los top N
    return numerosOrdenados.slice(0, cantidad).map((item) => item.numero);
  }

  /**
   * Obtiene números que llevan muchos sorteos sin aparecer (fríos)
   * Requisito: 1.3
   * Asume que resultados[length-1] es el más reciente
   */
  obtenerNumerosFrios(resultados: ResultadoSorteo[], umbralSorteos: number): number[] {
    const sorteosDesdUltimaAparicion: UltimaAparicion = {};

    // Inicializar todos los números como si nunca hubieran aparecido
    for (let i = 1; i <= 49; i++) {
      sorteosDesdUltimaAparicion[i] = resultados.length;
    }

    // Recorrer desde el más reciente (último índice) hacia el más antiguo
    // sorteosDesdeFin = 0 significa que apareció en el sorteo más reciente
    for (let i = resultados.length - 1; i >= 0; i--) {
      const sorteosDesdeFin = resultados.length - 1 - i;
      const resultado = resultados[i];
      for (const numero of resultado.combinacionGanadora) {
        if (sorteosDesdUltimaAparicion[numero] === resultados.length) {
          sorteosDesdUltimaAparicion[numero] = sorteosDesdeFin;
        }
      }
    }

    // Filtrar números que llevan más del umbral sin aparecer
    const numerosFrios: number[] = [];
    for (let numero = 1; numero <= 49; numero++) {
      if (sorteosDesdUltimaAparicion[numero] >= umbralSorteos) {
        numerosFrios.push(numero);
      }
    }

    return numerosFrios;
  }

  /**
   * Selecciona números aleatorios de un array
   */
  private seleccionarAleatorios(numeros: number[], cantidad: number): number[] {
    if (numeros.length === 0) {
      return [];
    }

    const seleccionados: number[] = [];
    const disponibles = [...numeros];

    for (let i = 0; i < cantidad && disponibles.length > 0; i++) {
      const indice = Math.floor(Math.random() * disponibles.length);
      seleccionados.push(disponibles[indice]);
      disponibles.splice(indice, 1);
    }

    return seleccionados;
  }

  /**
   * Completa la apuesta hasta 6 números evitando fríos adicionales
   */
  private completarApuesta(calientes: number[], frios: number[], conjuntoFrios: Set<number> = new Set(), noFrios: number[] = []): number[] {
    const numerosUsados = new Set<number>();
    const apuesta: number[] = [];

    for (const n of [...calientes, ...frios]) {
      if (!numerosUsados.has(n)) {
        apuesta.push(n);
        numerosUsados.add(n);
      }
    }

    // Completar con no-fríos disponibles (en orden aleatorio)
    const disponibles = noFrios.filter(n => !numerosUsados.has(n));
    for (let i = disponibles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [disponibles[i], disponibles[j]] = [disponibles[j], disponibles[i]];
    }

    for (const n of disponibles) {
      if (apuesta.length >= 6) break;
      apuesta.push(n);
      numerosUsados.add(n);
    }

    // Último recurso: cualquier número no usado
    for (let n = 1; n <= 49 && apuesta.length < 6; n++) {
      if (!numerosUsados.has(n) && !conjuntoFrios.has(n)) {
        apuesta.push(n);
        numerosUsados.add(n);
      }
    }
    for (let n = 1; n <= 49 && apuesta.length < 6; n++) {
      if (!numerosUsados.has(n)) {
        apuesta.push(n);
        numerosUsados.add(n);
      }
    }

    return apuesta;
  }

  /**
   * Ajusta la distribución de números pares e impares
   * Distribuciones válidas: 3:3, 4:2, 2:4
   * Requisito: 1.4
   */
  ajustarDistribucionParImpar(apuesta: number[], numerosExcluidos: Set<number> = new Set()): number[] {
    const pares = apuesta.filter((n) => n % 2 === 0);
    const impares = apuesta.filter((n) => n % 2 !== 0);

    const cantidadPares = pares.length;
    const cantidadImpares = impares.length;

    // Verificar si ya tiene una distribución válida
    if (
      (cantidadPares === 3 && cantidadImpares === 3) ||
      (cantidadPares === 4 && cantidadImpares === 2) ||
      (cantidadPares === 2 && cantidadImpares === 4)
    ) {
      return apuesta;
    }

    // Solo ajustar si hay suficientes no-excluidos con la paridad necesaria
    const paresDisponibles = Array.from({length: 49}, (_, i) => i + 2).filter(
      n => n % 2 === 0 && !new Set(apuesta).has(n) && !numerosExcluidos.has(n)
    );
    const imparesDisponibles = Array.from({length: 49}, (_, i) => i + 1).filter(
      n => n % 2 !== 0 && !new Set(apuesta).has(n) && !numerosExcluidos.has(n)
    );

    // Si no hay suficientes disponibles para ajustar, devolver sin cambios
    if (paresDisponibles.length === 0 || imparesDisponibles.length === 0) {
      return apuesta;
    }

    return this.reemplazarParaDistribucion(apuesta, numerosExcluidos);
  }

  /**
   * Reemplaza números para lograr una distribución par/impar válida
   */
  private reemplazarParaDistribucion(apuesta: number[], numerosExcluidos: Set<number> = new Set()): number[] {
    const pares = apuesta.filter((n) => n % 2 === 0);
    const impares = apuesta.filter((n) => n % 2 !== 0);
    const numerosUsados = new Set(apuesta);

    let cantidadPares = pares.length;
    let cantidadImpares = impares.length;

    // Determinar distribución objetivo (elegir aleatoriamente entre las válidas)
    const distribucionesValidas = [
      { pares: 3, impares: 3 },
      { pares: 4, impares: 2 },
      { pares: 2, impares: 4 },
    ];
    const objetivo = distribucionesValidas[Math.floor(Math.random() * distribucionesValidas.length)];

    const nuevaApuesta = [...apuesta];

    // Ajustar pares
    while (cantidadPares < objetivo.pares) {
      const indiceImpar = nuevaApuesta.findIndex((n) => n % 2 !== 0);
      if (indiceImpar !== -1) {
        const numeroAReemplazar = nuevaApuesta[indiceImpar];
        numerosUsados.delete(numeroAReemplazar);
        // Verificar si hay pares disponibles sin usar fríos
        const hayParDisponible = Array.from({length: 49}, (_, i) => i + 1)
          .some(n => n % 2 === 0 && !numerosUsados.has(n) && !numerosExcluidos.has(n));
        if (!hayParDisponible) {
          numerosUsados.add(numeroAReemplazar);
          return apuesta; // No se puede ajustar sin usar fríos
        }
        const nuevoPar = this.generarNumeroAleatorio(true, numerosUsados, numerosExcluidos);
        nuevaApuesta[indiceImpar] = nuevoPar;
        numerosUsados.add(nuevoPar);
        cantidadPares++;
        cantidadImpares--;
      }
    }

    while (cantidadPares > objetivo.pares) {
      const indicePar = nuevaApuesta.findIndex((n) => n % 2 === 0);
      if (indicePar !== -1) {
        const numeroAReemplazar = nuevaApuesta[indicePar];
        numerosUsados.delete(numeroAReemplazar);
        const hayImparDisponible = Array.from({length: 49}, (_, i) => i + 1)
          .some(n => n % 2 !== 0 && !numerosUsados.has(n) && !numerosExcluidos.has(n));
        if (!hayImparDisponible) {
          numerosUsados.add(numeroAReemplazar);
          return apuesta;
        }
        const nuevoImpar = this.generarNumeroAleatorio(false, numerosUsados, numerosExcluidos);
        nuevaApuesta[indicePar] = nuevoImpar;
        numerosUsados.add(nuevoImpar);
        cantidadPares--;
        cantidadImpares++;
      }
    }

    return nuevaApuesta;
  }

  /**
   * Genera un número aleatorio par o impar que no esté en uso
   */
  private generarNumeroAleatorio(par: boolean, numerosUsados: Set<number>, numerosExcluidos: Set<number> = new Set()): number {
    let numero: number;
    let intentos = 0;
    const maxIntentos = 100;

    do {
      numero = Math.floor(Math.random() * 49) + 1;
      intentos++;

      if (intentos >= maxIntentos) {
        // Fallback: buscar secuencialmente ignorando exclusiones si es necesario
        for (let i = 1; i <= 49; i++) {
          if (!numerosUsados.has(i) && !numerosExcluidos.has(i) && (par ? i % 2 === 0 : i % 2 !== 0)) {
            return i;
          }
        }
        // Si no hay disponibles sin excluidos, ignorar exclusiones
        for (let i = 1; i <= 49; i++) {
          if (!numerosUsados.has(i) && (par ? i % 2 === 0 : i % 2 !== 0)) {
            return i;
          }
        }
        throw new Error('No se pudo generar número con paridad requerida');
      }
    } while (numerosUsados.has(numero) || numerosExcluidos.has(numero) || (par ? numero % 2 !== 0 : numero % 2 === 0));

    return numero;
  }
}
