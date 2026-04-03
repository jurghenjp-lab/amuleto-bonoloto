/**
 * Interfaces del dominio para Amuleto Bonoloto
 */

import { ResultadoSorteo } from '../../types';

/**
 * Contrato común para todos los motores de generación de apuestas
 * Requisitos: 1.1, 2.1, 3.1
 */
export interface IGeneradorApuestas {
  /**
   * Genera una apuesta válida de 6 números únicos entre 1 y 49
   * @returns Promise que resuelve a un array de 6 números ordenados de menor a mayor
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

/**
 * Contrato para el cliente de la API de Bonoloto
 * Requisitos: 1.1, 5.1, 12.1
 */
export interface IBonolotoApiClient {
  /**
   * Obtiene el resultado del último sorteo oficial
   * @returns Promise que resuelve al resultado del último sorteo
   * @throws Error si hay problemas de red o timeout
   */
  obtenerUltimoSorteo(): Promise<ResultadoSorteo>;

  /**
   * Obtiene resultados de sorteos en un rango de fechas
   * @param fechaInicio Fecha de inicio del rango
   * @param fechaFin Fecha de fin del rango
   * @returns Promise que resuelve a un array de resultados
   * @throws Error si hay problemas de red o timeout
   */
  obtenerResultadosRango(fechaInicio: Date, fechaFin: Date): Promise<ResultadoSorteo[]>;
}

/**
 * Datos de aceleración del dispositivo
 */
export interface DatosAceleracion {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

/**
 * Contrato para el servicio de acelerómetro
 * Requisito: 2.1
 */
export interface IAcelerometroService {
  /**
   * Obtiene la aceleración actual del dispositivo
   * @returns Promise que resuelve a los datos de aceleración
   * @throws Error si el acelerómetro no está disponible
   */
  obtenerAceleracion(): Promise<DatosAceleracion>;
}

/**
 * Contrato para el repositorio de configuración de usuario
 * Requisitos: 3.1, 3.2, 3.3
 */
export interface IConfiguracionUsuario {
  /**
   * Guarda la configuración del usuario
   * @param config Configuración a guardar
   * @returns Promise que resuelve cuando se guarda exitosamente
   */
  guardar(config: import('../../types').ConfiguracionUsuario): Promise<void>;

  /**
   * Obtiene la configuración del usuario
   * @returns Promise que resuelve a la configuración o null si no existe
   */
  obtener(): Promise<import('../../types').ConfiguracionUsuario | null>;

  /**
   * Verifica si existe configuración guardada
   * @returns Promise que resuelve a true si existe configuración
   */
  existe(): Promise<boolean>;
}

/**
 * Contrato para el repositorio de apuestas
 * Requisitos: 6.1, 6.3, 6.4
 */
export interface IRepositorioApuestas {
  /**
   * Guarda una apuesta en el repositorio
   * @param apuesta Apuesta a guardar
   * @returns Promise que resuelve cuando se guarda exitosamente
   */
  guardar(apuesta: import('../../types').Apuesta): Promise<void>;

  /**
   * Obtiene todas las apuestas guardadas
   * @returns Promise que resuelve a un array de apuestas ordenadas por fecha (más recientes primero)
   */
  obtenerTodas(): Promise<import('../../types').Apuesta[]>;

  /**
   * Elimina una apuesta del repositorio
   * @param id ID de la apuesta a eliminar
   * @returns Promise que resuelve cuando se elimina exitosamente
   */
  eliminar(id: string): Promise<void>;
}
