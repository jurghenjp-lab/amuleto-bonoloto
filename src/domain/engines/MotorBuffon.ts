/**
 * Motor Buffon - Generación basada en simulación del experimento de la Aguja de Buffon
 * Requisitos: 2.2, 2.3, 2.4, 2.5, 2.6
 */

import { IGeneradorApuestas, IAcelerometroService } from '../interfaces';

interface Aguja {
  x: number;
  y: number;
  angulo: number;
  longitudAguja: number;
  separacionLineas: number;
}

interface Interseccion {
  espacio: number;
  precision: number;
}

export class MotorBuffon implements IGeneradorApuestas {
  readonly nombre = 'Motor Buffon';
  readonly requiereConfiguracion = false;

  private readonly longitudAguja = 1.0;
  private readonly separacionLineas = 2.0;
  private readonly tamanoRejilla = 7; // Rejilla 7x7 = 49 espacios

  constructor(private acelerometroService: IAcelerometroService) {}

  /**
   * Genera una apuesta mediante simulación del experimento de Buffon
   * Requisitos: 2.2, 2.3, 2.4, 2.5, 2.6
   */
  async generarApuesta(): Promise<number[]> {
    // 1. Obtener fuerza de aceleración
    const aceleracion = await this.acelerometroService.obtenerAceleracion();

    // 2. Calcular número de agujas basado en fuerza (Requisito 2.2)
    const numAgujas = this.calcularNumeroAgujas(aceleracion);

    // 3. Simular lanzamientos (Requisito 2.3)
    const lanzamientos = this.simularLanzamientos(numAgujas);

    // 4. Calcular intersecciones con rejilla de 49 espacios (Requisito 2.4)
    const intersecciones = this.calcularIntersecciones(lanzamientos);

    // 5. Seleccionar 6 espacios con mayor precisión (Requisito 2.5)
    const espaciosSeleccionados = this.seleccionarMejoresIntersecciones(intersecciones, 6);

    // 6. Convertir espacios a números (1-49) y ordenar (Requisito 2.6)
    return espaciosSeleccionados.map((e) => e + 1).sort((a, b) => a - b);
  }

  /**
   * Calcula el número de agujas a lanzar basado en la aceleración
   * Mayor aceleración = más agujas
   * Requisito: 2.2
   */
  calcularNumeroAgujas(aceleracion: { x: number; y: number; z: number }): number {
    // Calcular magnitud de la aceleración
    const magnitud = Math.sqrt(
      aceleracion.x * aceleracion.x +
        aceleracion.y * aceleracion.y +
        aceleracion.z * aceleracion.z
    );

    // Mapear magnitud a número de agujas (entre 100 y 1000)
    // Magnitud típica en reposo: ~9.81 m/s²
    // Magnitud con movimiento: 15-30 m/s²
    const minAgujas = 100;
    const maxAgujas = 1000;

    // Normalizar magnitud (asumiendo rango 0-50 m/s²)
    const magnitudNormalizada = Math.min(magnitud / 50, 1);

    return Math.floor(minAgujas + magnitudNormalizada * (maxAgujas - minAgujas));
  }

  /**
   * Simula lanzamientos de agujas sobre una rejilla 7x7
   * Requisito: 2.3
   */
  simularLanzamientos(numAgujas: number): Aguja[] {
    const agujas: Aguja[] = [];

    for (let i = 0; i < numAgujas; i++) {
      // Posición aleatoria en rejilla 7x7
      const x = Math.random() * this.tamanoRejilla;
      const y = Math.random() * this.tamanoRejilla;

      // Ángulo aleatorio (0 a π radianes)
      const angulo = Math.random() * Math.PI;

      agujas.push({
        x,
        y,
        angulo,
        longitudAguja: this.longitudAguja,
        separacionLineas: this.separacionLineas,
      });
    }

    return agujas;
  }

  /**
   * Calcula las intersecciones de las agujas con las líneas de la rejilla
   * Requisito: 2.4
   */
  calcularIntersecciones(agujas: Aguja[]): Map<number, number> {
    const intersecciones = new Map<number, number>();

    // Inicializar todos los espacios con precisión 0
    for (let i = 0; i < 49; i++) {
      intersecciones.set(i, 0);
    }

    for (const aguja of agujas) {
      // Calcular extremos de la aguja
      const x1 = aguja.x;
      const y1 = aguja.y;
      const x2 = aguja.x + aguja.longitudAguja * Math.cos(aguja.angulo);
      const y2 = aguja.y + aguja.longitudAguja * Math.sin(aguja.angulo);

      // Determinar espacio de la rejilla (0-48)
      const espacioX = Math.floor(aguja.x);
      const espacioY = Math.floor(aguja.y);

      // Validar que está dentro de la rejilla
      if (
        espacioX >= 0 &&
        espacioX < this.tamanoRejilla &&
        espacioY >= 0 &&
        espacioY < this.tamanoRejilla
      ) {
        const espacio = espacioY * this.tamanoRejilla + espacioX;

        // Calcular "precisión" de intersección (Requisito 2.5)
        const precision = this.calcularPrecisionInterseccion(x1, y1, x2, y2);

        // Acumular precisión para este espacio
        const precisionActual = intersecciones.get(espacio) || 0;
        intersecciones.set(espacio, precisionActual + precision);
      }
    }

    return intersecciones;
  }

  /**
   * Calcula la precisión de intersección de una aguja con las líneas
   * Menor distancia a líneas = mayor precisión
   * Requisito: 2.5
   */
  calcularPrecisionInterseccion(x1: number, y1: number, x2: number, y2: number): number {
    // Calcular distancia mínima a líneas horizontales
    const distanciaHorizontal = Math.min(
      Math.abs(y1 - Math.floor(y1)),
      Math.abs(y1 - Math.ceil(y1)),
      Math.abs(y2 - Math.floor(y2)),
      Math.abs(y2 - Math.ceil(y2))
    );

    // Calcular distancia mínima a líneas verticales
    const distanciaVertical = Math.min(
      Math.abs(x1 - Math.floor(x1)),
      Math.abs(x1 - Math.ceil(x1)),
      Math.abs(x2 - Math.floor(x2)),
      Math.abs(x2 - Math.ceil(x2))
    );

    // Menor distancia = mayor precisión
    // Usar inverso de la distancia (con offset para evitar división por cero)
    const distanciaMinima = Math.min(distanciaHorizontal, distanciaVertical);
    return 1.0 / (distanciaMinima + 0.01);
  }

  /**
   * Selecciona los espacios con mayor precisión de intersección
   * Requisito: 2.5
   */
  seleccionarMejoresIntersecciones(
    intersecciones: Map<number, number>,
    cantidad: number
  ): number[] {
    // Convertir a array y ordenar por precisión descendente
    const espaciosOrdenados = Array.from(intersecciones.entries())
      .map(([espacio, precision]) => ({ espacio, precision }))
      .sort((a, b) => b.precision - a.precision);

    // Tomar los top N espacios
    const mejores = espaciosOrdenados.slice(0, cantidad);

    // Si hay empates o no hay suficientes espacios con intersecciones,
    // completar con espacios aleatorios
    const espaciosSeleccionados = mejores.map((item) => item.espacio);

    // Asegurar que tenemos exactamente 6 espacios únicos
    while (espaciosSeleccionados.length < cantidad) {
      const espacioAleatorio = Math.floor(Math.random() * 49);
      if (!espaciosSeleccionados.includes(espacioAleatorio)) {
        espaciosSeleccionados.push(espacioAleatorio);
      }
    }

    return espaciosSeleccionados.slice(0, cantidad);
  }

  /**
   * Obtiene información de configuración del motor
   */
  getConfiguracion(): {
    longitudAguja: number;
    separacionLineas: number;
    tamanoRejilla: number;
  } {
    return {
      longitudAguja: this.longitudAguja,
      separacionLineas: this.separacionLineas,
      tamanoRejilla: this.tamanoRejilla,
    };
  }
}
