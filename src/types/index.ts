/**
 * Tipos y modelos de datos para Amuleto Bonoloto
 */

// ============================================================================
// Tipos Básicos
// ============================================================================

/**
 * Signos del zodíaco
 */
export type SignoZodiacal =
  | 'Aries'
  | 'Tauro'
  | 'Géminis'
  | 'Cáncer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Escorpio'
  | 'Sagitario'
  | 'Capricornio'
  | 'Acuario'
  | 'Piscis';

/**
 * Distribución de premios por categoría
 */
export interface DistribucionPremios {
  categoria1: { acertantes: number; premio: number }; // 6 aciertos
  categoria2: { acertantes: number; premio: number }; // 5 aciertos + complementario
  categoria3: { acertantes: number; premio: number }; // 5 aciertos
  categoria4: { acertantes: number; premio: number }; // 4 aciertos
  categoria5: { acertantes: number; premio: number }; // 3 aciertos
  reintegro: { acertantes: number; premio: number };
}

// ============================================================================
// Modelos de Dominio
// ============================================================================

/**
 * Representa una apuesta de Bonoloto
 * Requisitos: 1.1, 3.1, 5.1, 6.2
 */
export interface Apuesta {
  id?: string;
  numeros: number[]; // Array de 6 números ordenados (1-49)
  motor: string; // 'historico' | 'buffon' | 'amuleto'
  fechaGeneracion: Date;
}

/**
 * Resultado de un sorteo oficial de Bonoloto
 * Requisitos: 1.1, 5.1
 */
export interface ResultadoSorteo {
  fecha: Date;
  combinacionGanadora: number[]; // 6 números
  complementario: number;
  reintegro: number;
  premios: DistribucionPremios;
}

/**
 * Configuración personal del usuario para el Motor Amuleto
 * Requisitos: 3.1
 */
export interface ConfiguracionUsuario {
  signoZodiacal: SignoZodiacal;
  colorFavorito: string;
  equipoFutbol: string;
  fechaConfiguracion: Date;
}

/**
 * Caché de resultados históricos
 * Requisitos: 6.2
 */
export interface CacheResultados {
  resultados: ResultadoSorteo[];
  fechaCache: Date;
  validoHasta: Date; // fechaCache + 24 horas
}
