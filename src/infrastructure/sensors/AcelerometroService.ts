/**
 * Servicio de Acelerómetro para React Native
 * Requisitos: 2.1, 2.2
 */

import { IAcelerometroService, DatosAceleracion } from '../../domain/interfaces';

/**
 * Umbral de aceleración para detectar movimiento significativo (m/s²)
 * Requisito: 2.2
 */
const UMBRAL_ACELERACION = 15.0;

export class AcelerometroService implements IAcelerometroService {
  private readonly umbralAceleracion: number;

  constructor(umbralAceleracion: number = UMBRAL_ACELERACION) {
    this.umbralAceleracion = umbralAceleracion;
  }

  /**
   * Obtiene la aceleración actual del dispositivo
   * Requisito: 2.1
   */
  async obtenerAceleracion(): Promise<DatosAceleracion> {
    try {
      // En React Native, usaremos react-native-sensors
      // Para testing, usamos una implementación mock
      const aceleracion = await this.leerAcelerometro();

      return {
        x: aceleracion.x,
        y: aceleracion.y,
        z: aceleracion.z,
        timestamp: Date.now(),
      };
    } catch (error) {
      throw new Error('No se pudo acceder al acelerómetro del dispositivo');
    }
  }

  /**
   * Calcula la magnitud de la aceleración
   * @param datos Datos de aceleración
   * @returns Magnitud de la aceleración en m/s²
   */
  calcularMagnitud(datos: DatosAceleracion): number {
    return Math.sqrt(datos.x * datos.x + datos.y * datos.y + datos.z * datos.z);
  }

  /**
   * Detecta si la aceleración supera el umbral definido
   * Requisito: 2.2
   */
  detectarMovimientoSignificativo(datos: DatosAceleracion): boolean {
    const magnitud = this.calcularMagnitud(datos);
    return magnitud > this.umbralAceleracion;
  }

  /**
   * Espera hasta detectar un movimiento significativo
   * @param timeoutMs Tiempo máximo de espera en milisegundos
   * @returns Promise que resuelve cuando se detecta movimiento
   */
  async esperarMovimiento(timeoutMs: number = 30000): Promise<DatosAceleracion> {
    const inicio = Date.now();

    while (Date.now() - inicio < timeoutMs) {
      const aceleracion = await this.obtenerAceleracion();

      if (this.detectarMovimientoSignificativo(aceleracion)) {
        return aceleracion;
      }

      // Esperar un poco antes de la siguiente lectura
      await this.esperar(100);
    }

    throw new Error('Timeout esperando movimiento del dispositivo');
  }

  /**
   * Lee datos del acelerómetro
   * En producción, esto usará react-native-sensors
   * En testing, retorna valores mock
   */
  private async leerAcelerometro(): Promise<{ x: number; y: number; z: number }> {
    // Implementación temporal para testing
    // En producción, reemplazar con:
    // import { accelerometer } from 'react-native-sensors';
    // return new Promise((resolve) => {
    //   const subscription = accelerometer.subscribe(({ x, y, z }) => {
    //     subscription.unsubscribe();
    //     resolve({ x, y, z });
    //   });
    // });

    if (typeof (global as any).__mockAcelerometro !== 'undefined') {
      return (global as any).__mockAcelerometro;
    }

    // Valores por defecto para testing (simulan gravedad en reposo)
    return {
      x: 0,
      y: 0,
      z: 9.81, // Gravedad estándar
    };
  }

  /**
   * Utilidad para esperar un tiempo determinado
   */
  private esperar(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Obtiene el umbral de aceleración configurado
   */
  getUmbral(): number {
    return this.umbralAceleracion;
  }
}
