/**
 * Cliente API para Bonoloto
 * Requisitos: 12.1, 12.2, 12.3, 12.4
 */

import { IBonolotoApiClient } from '../../domain/interfaces';
import { ResultadoSorteo } from '../../types';

export class BonolotoApiClient implements IBonolotoApiClient {
  private readonly baseUrl = 'https://www.loteriasyapuestas.es/servicios/buscadorSorteos';
  private readonly timeout = 10000; // 10 segundos (Requisito 12.2)

  /**
   * Obtiene el resultado del último sorteo oficial
   * Requisitos: 12.1, 12.2, 12.3, 12.4
   */
  async obtenerUltimoSorteo(): Promise<ResultadoSorteo> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}?game_id=BONO`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return this.parsearResultado(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout al consultar API de Bonoloto');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Obtiene resultados de sorteos en un rango de fechas
   * Requisitos: 12.1, 12.2, 12.3, 12.4
   */
  async obtenerResultadosRango(
    fechaInicio: Date,
    fechaFin: Date
  ): Promise<ResultadoSorteo[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fechaInicioStr = this.formatearFecha(fechaInicio);
      const fechaFinStr = this.formatearFecha(fechaFin);

      const response = await fetch(
        `${this.baseUrl}?game_id=BONO&fecha_inicio=${fechaInicioStr}&fecha_fin=${fechaFinStr}`,
        {
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      // La API puede devolver un solo resultado o un array
      if (Array.isArray(data)) {
        return data.map((item) => this.parsearResultado(item));
      } else {
        return [this.parsearResultado(data)];
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout al consultar API de Bonoloto');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parsea y valida la estructura de un resultado de sorteo
   * Requisito: 12.4
   */
  private parsearResultado(data: any): ResultadoSorteo {
    // Validar estructura de datos
    if (!data.combinacion || !Array.isArray(data.combinacion)) {
      throw new Error('Estructura de datos inválida de la API: falta combinacion');
    }

    if (data.combinacion.length < 6) {
      throw new Error('Estructura de datos inválida de la API: combinacion incompleta');
    }

    if (typeof data.complementario !== 'number') {
      throw new Error('Estructura de datos inválida de la API: falta complementario');
    }

    if (typeof data.reintegro !== 'number') {
      throw new Error('Estructura de datos inválida de la API: falta reintegro');
    }

    if (!data.fecha) {
      throw new Error('Estructura de datos inválida de la API: falta fecha');
    }

    return {
      fecha: new Date(data.fecha),
      combinacionGanadora: data.combinacion.slice(0, 6),
      complementario: data.complementario,
      reintegro: data.reintegro,
      premios: this.parsearPremios(data.premios),
    };
  }

  /**
   * Parsea la distribución de premios
   */
  private parsearPremios(premios: any): any {
    if (!premios) {
      // Si no hay datos de premios, devolver estructura vacía
      return {
        categoria1: { acertantes: 0, premio: 0 },
        categoria2: { acertantes: 0, premio: 0 },
        categoria3: { acertantes: 0, premio: 0 },
        categoria4: { acertantes: 0, premio: 0 },
        categoria5: { acertantes: 0, premio: 0 },
        reintegro: { acertantes: 0, premio: 0 },
      };
    }

    return {
      categoria1: premios.categoria1 || { acertantes: 0, premio: 0 },
      categoria2: premios.categoria2 || { acertantes: 0, premio: 0 },
      categoria3: premios.categoria3 || { acertantes: 0, premio: 0 },
      categoria4: premios.categoria4 || { acertantes: 0, premio: 0 },
      categoria5: premios.categoria5 || { acertantes: 0, premio: 0 },
      reintegro: premios.reintegro || { acertantes: 0, premio: 0 },
    };
  }

  /**
   * Formatea una fecha al formato esperado por la API (YYYYMMDD)
   */
  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
