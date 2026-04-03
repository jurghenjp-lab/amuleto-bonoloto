/**
 * Property-based tests para MotorHistorico
 * Requisitos: 1.5, 11.1, 11.2, 11.3, 1.4
 */

import * as fc from 'fast-check';
import { MotorHistorico } from '../MotorHistorico';
import { IBonolotoApiClient } from '../../interfaces';
import { ResultadoSorteo } from '../../../types';
import { ValidadorApuestas } from '../../validators';

// Mock del API client
class MockBonolotoApiClient implements IBonolotoApiClient {
  constructor(private mockResultados: ResultadoSorteo[]) {}

  async obtenerUltimoSorteo(): Promise<ResultadoSorteo> {
    return this.mockResultados[0];
  }

  async obtenerResultadosRango(): Promise<ResultadoSorteo[]> {
    return this.mockResultados;
  }
}

describe('MotorHistorico - Property-Based Tests', () => {
  const validador = new ValidadorApuestas();

  /**
   * Generador de resultados de sorteo aleatorios
   */
  const generadorResultadoSorteo = fc.record({
    fecha: fc.date(),
    combinacionGanadora: fc
      .array(fc.integer({ min: 1, max: 49 }), { minLength: 6, maxLength: 6 })
      .map((arr) => {
        // Asegurar que sean únicos
        const unicos = Array.from(new Set(arr));
        while (unicos.length < 6) {
          const nuevo = Math.floor(Math.random() * 49) + 1;
          if (!unicos.includes(nuevo)) {
            unicos.push(nuevo);
          }
        }
        return unicos.slice(0, 6).sort((a, b) => a - b);
      }),
    complementario: fc.integer({ min: 1, max: 49 }),
    reintegro: fc.integer({ min: 0, max: 9 }),
    premios: fc.constant({
      categoria1: { acertantes: 0, premio: 0 },
      categoria2: { acertantes: 0, premio: 0 },
      categoria3: { acertantes: 0, premio: 0 },
      categoria4: { acertantes: 0, premio: 0 },
      categoria5: { acertantes: 0, premio: 0 },
      reintegro: { acertantes: 0, premio: 0 },
    }),
  });

  /**
   * Propiedad 2: Apuestas del Motor Histórico son válidas
   * **Valida: Requisitos 1.5, 11.1, 11.2, 11.3**
   *
   * Para cualquier ejecución del Motor Histórico, la apuesta generada
   * debe pasar todas las validaciones (6 números únicos, rango 1-49, ordenados)
   */
  describe('Propiedad 2: Apuestas del Motor Histórico son válidas', () => {
    it('genera apuestas válidas para cualquier conjunto de resultados históricos', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(generadorResultadoSorteo, { minLength: 50, maxLength: 200 }),
          async (resultados) => {
            const mockApiClient = new MockBonolotoApiClient(resultados);
            const motor = new MotorHistorico(mockApiClient);

            const apuesta = await motor.generarApuesta();

            // Validar que cumple todas las reglas
            expect(() => validador.validar(apuesta)).not.toThrow();

            // Verificar propiedades específicas
            expect(apuesta).toHaveLength(6);
            expect(new Set(apuesta).size).toBe(6); // Sin duplicados
            expect(apuesta.every((n) => n >= 1 && n <= 49)).toBe(true);
            expect(apuesta.every((n) => Number.isInteger(n))).toBe(true);
            expect(validador.estaOrdenada(apuesta)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('genera apuestas válidas con diferentes tamaños de histórico', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 30, max: 500 }),
          fc.array(generadorResultadoSorteo, { minLength: 500, maxLength: 500 }),
          async (cantidadResultados, todosResultados) => {
            const resultados = todosResultados.slice(0, cantidadResultados);
            const mockApiClient = new MockBonolotoApiClient(resultados);
            const motor = new MotorHistorico(mockApiClient);

            const apuesta = await motor.generarApuesta();

            expect(() => validador.validar(apuesta)).not.toThrow();
            expect(apuesta).toHaveLength(6);
            expect(validador.estaOrdenada(apuesta)).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Propiedad 3: Distribución par/impar correcta
   * **Valida: Requisito 1.4**
   *
   * Para cualquier apuesta generada por el Motor Histórico,
   * debe tener distribución 3:3, 4:2, o 2:4 de pares e impares
   */
  describe('Propiedad 3: Distribución par/impar correcta', () => {
    it('mantiene distribución par/impar válida para cualquier histórico', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(generadorResultadoSorteo, { minLength: 50, maxLength: 200 }),
          async (resultados) => {
            const mockApiClient = new MockBonolotoApiClient(resultados);
            const motor = new MotorHistorico(mockApiClient);

            const apuesta = await motor.generarApuesta();

            const pares = apuesta.filter((n) => n % 2 === 0).length;
            const impares = apuesta.filter((n) => n % 2 !== 0).length;

            // Verificar que es una de las distribuciones válidas
            const esDistribucionValida =
              (pares === 3 && impares === 3) ||
              (pares === 4 && impares === 2) ||
              (pares === 2 && impares === 4);

            expect(esDistribucionValida).toBe(true);
            expect(pares + impares).toBe(6);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('genera múltiples apuestas con distribución válida', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(generadorResultadoSorteo, { minLength: 100, maxLength: 100 }),
          fc.integer({ min: 5, max: 20 }),
          async (resultados, cantidadApuestas) => {
            const mockApiClient = new MockBonolotoApiClient(resultados);
            const motor = new MotorHistorico(mockApiClient);

            for (let i = 0; i < cantidadApuestas; i++) {
              const apuesta = await motor.generarApuesta();

              const pares = apuesta.filter((n) => n % 2 === 0).length;
              const impares = apuesta.filter((n) => n % 2 !== 0).length;

              const esDistribucionValida =
                (pares === 3 && impares === 3) ||
                (pares === 4 && impares === 2) ||
                (pares === 2 && impares === 4);

              expect(esDistribucionValida).toBe(true);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
