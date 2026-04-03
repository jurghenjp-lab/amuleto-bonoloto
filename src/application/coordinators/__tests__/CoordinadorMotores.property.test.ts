/**
 * Property-based tests para CoordinadorMotores
 * Requisito: 4.4
 */

import * as fc from 'fast-check';
import { CoordinadorMotores } from '../CoordinadorMotores';
import { IGeneradorApuestas } from '../../../domain/interfaces';

// Motor mock simple que genera números aleatorios
class MotorMock implements IGeneradorApuestas {
  constructor(public readonly nombre: string) {}

  readonly requiereConfiguracion = false;

  async generarApuesta(): Promise<number[]> {
    const numeros = new Set<number>();

    while (numeros.size < 6) {
      const numero = Math.floor(Math.random() * 49) + 1;
      numeros.add(numero);
    }

    return Array.from(numeros).sort((a, b) => a - b);
  }
}

describe('CoordinadorMotores - Property-Based Tests', () => {
  /**
   * Propiedad 8: Columnas únicas
   * **Valida: Requisito 4.4**
   *
   * Para cualquier número de columnas (1-8) y configuración de motores,
   * todas las columnas generadas deben tener combinaciones diferentes
   */
  describe('Propiedad 8: Columnas únicas', () => {
    it('genera columnas con combinaciones únicas para cualquier número de columnas', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 8 }), async (numeroColumnas) => {
          const motores = [
            new MotorMock('Motor 1'),
            new MotorMock('Motor 2'),
            new MotorMock('Motor 3'),
          ];

          const coordinador = new CoordinadorMotores(motores);

          // Configurar motores para cada columna (puede repetirse)
          const configuracion = Array(numeroColumnas).fill('Motor 1');

          const apuestas = await coordinador.generarColumnas(numeroColumnas, configuracion);

          // Verificar que todas las combinaciones son únicas
          const combinaciones = new Set(apuestas.map((a) => a.numeros.join(',')));

          expect(combinaciones.size).toBe(numeroColumnas);
          expect(apuestas).toHaveLength(numeroColumnas);
        }),
        { numRuns: 100 }
      );
    });

    it('genera columnas únicas con mezcla de motores', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 8 }),
          async (numeroColumnas) => {
            const motores = [
              new MotorMock('Motor 1'),
              new MotorMock('Motor 2'),
              new MotorMock('Motor 3'),
            ];

            const coordinador = new CoordinadorMotores(motores);

            // Configuración con exactamente numeroColumnas elementos
            const nombres = ['Motor 1', 'Motor 2', 'Motor 3'];
            const configuracion = Array(numeroColumnas)
              .fill(0)
              .map((_, i) => nombres[i % nombres.length]);

            const apuestas = await coordinador.generarColumnas(numeroColumnas, configuracion);

            // Verificar unicidad
            const combinaciones = new Set(apuestas.map((a) => a.numeros.join(',')));

            expect(combinaciones.size).toBe(numeroColumnas);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('mantiene unicidad incluso con el mismo motor repetido', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 2, max: 6 }), async (numeroColumnas) => {
          const motor = new MotorMock('Motor Único');
          const coordinador = new CoordinadorMotores([motor]);

          // Usar el mismo motor para todas las columnas
          const configuracion = Array(numeroColumnas).fill('Motor Único');

          const apuestas = await coordinador.generarColumnas(numeroColumnas, configuracion);

          // Todas las combinaciones deben ser diferentes
          const combinaciones = new Set(apuestas.map((a) => a.numeros.join(',')));

          expect(combinaciones.size).toBe(numeroColumnas);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Propiedades adicionales del Coordinador', () => {
    it('todas las apuestas generadas son válidas', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 8 }), async (numeroColumnas) => {
          const motores = [new MotorMock('Motor 1'), new MotorMock('Motor 2')];
          const coordinador = new CoordinadorMotores(motores);

          const configuracion = Array(numeroColumnas).fill('Motor 1');
          const apuestas = await coordinador.generarColumnas(numeroColumnas, configuracion);

          for (const apuesta of apuestas) {
            expect(apuesta.numeros).toHaveLength(6);
            expect(new Set(apuesta.numeros).size).toBe(6);
            expect(apuesta.numeros.every((n) => n >= 1 && n <= 49)).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });

    it('asigna correctamente el motor a cada apuesta', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 8 }),
          async (numeroColumnas) => {
            const motores = [
              new MotorMock('Motor A'),
              new MotorMock('Motor B'),
              new MotorMock('Motor C'),
            ];
            const coordinador = new CoordinadorMotores(motores);

            // Alternar entre motores
            const configuracion = Array(numeroColumnas)
              .fill(0)
              .map((_, i) => ['Motor A', 'Motor B', 'Motor C'][i % 3]);

            const apuestas = await coordinador.generarColumnas(numeroColumnas, configuracion);

            for (let i = 0; i < apuestas.length; i++) {
              expect(apuestas[i].motor).toBe(configuracion[i]);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
