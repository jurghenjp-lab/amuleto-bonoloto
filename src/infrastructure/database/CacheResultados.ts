/**
 * Sistema de caché para resultados de sorteos
 * Requisito: 12.5
 */

import { ResultadoSorteo, CacheResultados as ICacheResultados } from '../../types';

export class CacheResultados {
  private readonly CACHE_KEY = 'bonoloto_resultados_cache';
  private readonly VALIDEZ_HORAS = 24;

  /**
   * Guarda resultados en el caché local
   * @param resultados Array de resultados a cachear
   * Requisito: 12.5
   */
  async guardar(resultados: ResultadoSorteo[]): Promise<void> {
    const fechaCache = new Date();
    const validoHasta = new Date(fechaCache.getTime() + this.VALIDEZ_HORAS * 60 * 60 * 1000);

    const cache: ICacheResultados = {
      resultados,
      fechaCache,
      validoHasta,
    };

    try {
      // En React Native, usamos AsyncStorage
      const cacheString = JSON.stringify(cache, this.serializadorFechas);
      await this.guardarEnStorage(this.CACHE_KEY, cacheString);
    } catch (error) {
      console.error('Error al guardar caché:', error);
      throw new Error('No se pudo guardar el caché de resultados');
    }
  }

  /**
   * Obtiene resultados del caché si están disponibles y son válidos
   * @returns Array de resultados o null si no hay caché válido
   * Requisito: 12.5
   */
  async obtener(): Promise<ResultadoSorteo[] | null> {
    try {
      const cacheString = await this.obtenerDeStorage(this.CACHE_KEY);

      if (!cacheString) {
        return null;
      }

      const cache: ICacheResultados = JSON.parse(cacheString, this.deserializadorFechas);

      if (!this.esValido(cache)) {
        // Caché expirado, eliminarlo
        await this.limpiar();
        return null;
      }

      return cache.resultados;
    } catch (error) {
      console.error('Error al obtener caché:', error);
      return null;
    }
  }

  /**
   * Verifica si el caché es válido (no ha expirado)
   * @param cache Objeto de caché a validar
   * @returns true si el caché es válido, false si ha expirado
   * Requisito: 12.5
   */
  esValido(cache: ICacheResultados): boolean {
    const ahora = new Date();
    return ahora < cache.validoHasta;
  }

  /**
   * Limpia el caché eliminando todos los datos almacenados
   */
  async limpiar(): Promise<void> {
    try {
      await this.eliminarDeStorage(this.CACHE_KEY);
    } catch (error) {
      console.error('Error al limpiar caché:', error);
    }
  }

  /**
   * Serializador personalizado para convertir fechas a strings en JSON
   */
  private serializadorFechas = (_key: string, value: any): any => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  };

  /**
   * Deserializador personalizado para convertir strings a fechas desde JSON
   */
  private deserializadorFechas = (key: string, value: any): any => {
    // Campos conocidos que son fechas
    if ((key === 'fechaCache' || key === 'validoHasta' || key === 'fecha') && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  /**
   * Abstracción de almacenamiento para facilitar testing
   * En producción, esto usará AsyncStorage de React Native
   */
  private async guardarEnStorage(key: string, value: string): Promise<void> {
    // Implementación temporal usando localStorage para testing
    // En producción, reemplazar con AsyncStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      // Para entorno Node.js en tests
      (global as any).__storage = (global as any).__storage || {};
      (global as any).__storage[key] = value;
    }
  }

  /**
   * Abstracción de obtención de almacenamiento
   */
  private async obtenerDeStorage(key: string): Promise<string | null> {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    } else {
      // Para entorno Node.js en tests
      return (global as any).__storage?.[key] || null;
    }
  }

  /**
   * Abstracción de eliminación de almacenamiento
   */
  private async eliminarDeStorage(key: string): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      // Para entorno Node.js en tests
      if ((global as any).__storage) {
        delete (global as any).__storage[key];
      }
    }
  }
}
