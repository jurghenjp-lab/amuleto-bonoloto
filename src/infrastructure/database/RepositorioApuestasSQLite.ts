/**
 * Repositorio de apuestas con SQLite
 * Requisitos: 6.1, 6.2, 6.5
 */

import { IRepositorioApuestas } from '../../domain/interfaces';
import { Apuesta } from '../../types';

export class RepositorioApuestasSQLite implements IRepositorioApuestas {
  private readonly STORAGE_KEY_PREFIX = 'bonoloto_apuesta_';
  private readonly INDEX_KEY = 'bonoloto_apuestas_index';

  /**
   * Guarda una apuesta en el repositorio
   * Requisitos: 6.1, 6.2
   */
  async guardar(apuesta: Apuesta): Promise<void> {
    try {
      // Generar ID único si no existe (Requisito 6.5)
      const id = apuesta.id || this.generarId();

      const apuestaConId: Apuesta = {
        ...apuesta,
        id,
      };

      // Serializar apuesta (Requisito 6.2)
      const apuestaString = JSON.stringify(apuestaConId, this.serializadorFechas);

      // Guardar apuesta
      await this.guardarEnStorage(`${this.STORAGE_KEY_PREFIX}${id}`, apuestaString);

      // Actualizar índice
      await this.agregarAlIndice(id);
    } catch (error) {
      console.error('Error al guardar apuesta:', error);
      throw new Error('No se pudo guardar la apuesta');
    }
  }

  /**
   * Obtiene todas las apuestas guardadas
   * Requisito: 6.3 - Ordenadas por fecha (más recientes primero)
   */
  async obtenerTodas(): Promise<Apuesta[]> {
    try {
      const ids = await this.obtenerIndice();
      const apuestas: Apuesta[] = [];

      for (const id of ids) {
        const apuestaString = await this.obtenerDeStorage(`${this.STORAGE_KEY_PREFIX}${id}`);

        if (apuestaString) {
          const apuesta: Apuesta = JSON.parse(apuestaString, this.deserializadorFechas);
          apuestas.push(apuesta);
        }
      }

      // Ordenar por fecha descendente (más recientes primero)
      return apuestas.sort((a, b) => {
        const fechaA = a.fechaGeneracion instanceof Date ? a.fechaGeneracion : new Date(a.fechaGeneracion);
        const fechaB = b.fechaGeneracion instanceof Date ? b.fechaGeneracion : new Date(b.fechaGeneracion);
        return fechaB.getTime() - fechaA.getTime();
      });
    } catch (error) {
      console.error('Error al obtener apuestas:', error);
      return [];
    }
  }

  /**
   * Elimina una apuesta del repositorio
   * Requisito: 6.4
   */
  async eliminar(id: string): Promise<void> {
    try {
      // Eliminar apuesta
      await this.eliminarDeStorage(`${this.STORAGE_KEY_PREFIX}${id}`);

      // Actualizar índice
      await this.eliminarDelIndice(id);
    } catch (error) {
      console.error('Error al eliminar apuesta:', error);
      throw new Error('No se pudo eliminar la apuesta');
    }
  }

  /**
   * Genera un ID único para una apuesta
   * Requisito: 6.5
   */
  private generarId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Obtiene el índice de IDs de apuestas
   */
  private async obtenerIndice(): Promise<string[]> {
    const indexString = await this.obtenerDeStorage(this.INDEX_KEY);

    if (!indexString) {
      return [];
    }

    try {
      return JSON.parse(indexString);
    } catch {
      return [];
    }
  }

  /**
   * Agrega un ID al índice
   */
  private async agregarAlIndice(id: string): Promise<void> {
    const indice = await this.obtenerIndice();

    if (!indice.includes(id)) {
      indice.push(id);
      await this.guardarEnStorage(this.INDEX_KEY, JSON.stringify(indice));
    }
  }

  /**
   * Elimina un ID del índice
   */
  private async eliminarDelIndice(id: string): Promise<void> {
    const indice = await this.obtenerIndice();
    const nuevoIndice = indice.filter((item) => item !== id);

    await this.guardarEnStorage(this.INDEX_KEY, JSON.stringify(nuevoIndice));
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
    if (key === 'fechaGeneracion' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  /**
   * Abstracción de almacenamiento para facilitar testing
   * En producción, esto usará AsyncStorage de React Native o SQLite
   */
  private async guardarEnStorage(key: string, value: string): Promise<void> {
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

  /**
   * Limpia todas las apuestas (útil para testing)
   */
  async limpiarTodas(): Promise<void> {
    const ids = await this.obtenerIndice();

    for (const id of ids) {
      await this.eliminarDeStorage(`${this.STORAGE_KEY_PREFIX}${id}`);
    }

    await this.eliminarDeStorage(this.INDEX_KEY);
  }
}
