/**
 * Repositorio de configuración de usuario con SQLite
 * Requisitos: 3.1, 3.2, 3.3, 9.3
 */

import { IConfiguracionUsuario } from '../../domain/interfaces';
import { ConfiguracionUsuario } from '../../types';

export class ConfiguracionUsuarioSQLite implements IConfiguracionUsuario {
  private readonly STORAGE_KEY = 'bonoloto_configuracion_usuario';

  /**
   * Guarda la configuración del usuario
   * Requisitos: 3.1, 3.2, 3.3
   */
  async guardar(config: ConfiguracionUsuario): Promise<void> {
    try {
      const configConFecha: ConfiguracionUsuario = {
        ...config,
        fechaConfiguracion: new Date(),
      };

      const configString = JSON.stringify(configConFecha, this.serializadorFechas);
      await this.guardarEnStorage(this.STORAGE_KEY, configString);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      throw new Error('No se pudo guardar la configuración del usuario');
    }
  }

  /**
   * Obtiene la configuración del usuario
   * Requisitos: 3.1, 3.2, 3.3
   */
  async obtener(): Promise<ConfiguracionUsuario | null> {
    try {
      const configString = await this.obtenerDeStorage(this.STORAGE_KEY);

      if (!configString) {
        return null;
      }

      const config: ConfiguracionUsuario = JSON.parse(configString, this.deserializadorFechas);
      return config;
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      return null;
    }
  }

  /**
   * Verifica si existe configuración guardada
   * Requisito: 3.1
   */
  async existe(): Promise<boolean> {
    const config = await this.obtener();
    return config !== null;
  }

  /**
   * Elimina la configuración guardada
   */
  async eliminar(): Promise<void> {
    try {
      await this.eliminarDeStorage(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error al eliminar configuración:', error);
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
    if (key === 'fechaConfiguracion' && typeof value === 'string') {
      return new Date(value);
    }
    return value;
  };

  /**
   * Abstracción de almacenamiento para facilitar testing
   * En producción, esto usará AsyncStorage de React Native o SQLite
   */
  private async guardarEnStorage(key: string, value: string): Promise<void> {
    // Implementación temporal usando localStorage para testing
    // En producción, reemplazar con AsyncStorage o SQLite
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
