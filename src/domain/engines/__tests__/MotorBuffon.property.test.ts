/**
 * Property-based tests para MotorBuffon
 * Requisitos: 2.6, 11.1, 11.2, 11.3
 */

import * as fc from 'fast-check';
import { MotorBuffon } from '../MotorBuffon';
import { IAcelerometroService, DatosAceleracion } from '../../interfaces';
import { ValidadorApuestas } from '../../validators';

// Mock del servicio de acelerómetro
class MockAcelerometroService implements IAcelerometroService {
  constructor(private mockDatos: DatosAceleracion) {}

  async obtenerAceleracion(): Promise<DatosAceleracion> {
    return this.mockDatos;
  }
}

describe('MotorBuffon - Property-Based Tests', () => {
  const validador = new ValidadorApuestas();

  /**
   * Generador de datos de aceleración aleatorios
   */
  const generadorAceleracion = fc.record({
    x: fc.float({ min: -50, max: 50 }),
    y: fc.float({ min: -50, max: 50 }),
    z: fc.float({ min: -50, max: 50 }),
    timestamp: fc.integer({ min: 0, max: Date.now() }),
  });

  /**
   * Propiedad 4: Apuestas del Motor Buffon son válidas
   * **Valida: Requisitos 2.6, 11.1, 11.2, 11.3**
   *
   * Para cualquier nivel de aceleración, la apuesta generada
   * debe pasar todas las validaciones (6 números únicos, rango 1-49, ordenados)
   */
  describe('Propiedad 4: Apuestas del Motor Buffon son válidas', () => {
    it('genera apuestas válidas para cualquier nivel de aceleración', async () => {
      await fc.assert(
        fc.asyncProperty(generadorAceleracion, async (aceleracion) => {
          const mockService = new MockAcelerometroService(aceleracion);
          const motor = new MotorBuffon(mockService);

          const apuesta = await motor.generarApuesta();

          // Validar que cumple todas las reglas
          expect(() => validador.validar(apuesta)).not.toThrow();

          // Verificar propiedades específicas
          expect(apuesta).toHaveLength(6);
          expect(new Set(apuesta).size).toBe(6); // Sin duplicados
          expect(apuesta.every((n) => n >= 1 && n <= 49)).toBe(true);
          expect(apuesta.every((n) => Number.isInteger(n))).toBe(true);
          expect(validador.estaOrdenada(apuesta)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('genera apuestas válidas con aceleración en reposo', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 0, max: 15 }),
          async (magnitud) => {
            const aceleracion: DatosAceleracion = {
              x: 0,
              y: 0,
              z: magnitud,
              timestamp: Date.now(),
            };

            const mockService = new MockAcelerometroService(aceleracion);
            const motor = new MotorBuffon(mockService);

            const apuesta = await motor.generarApuesta();

            expect(() => validador.validar(apuesta)).not.toThrow();
            expect(apuesta).toHaveLength(6);
            expect(validador.estaOrdenada(apuesta)).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('genera apuestas válidas con aceleración alta', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.float({ min: 20, max: 100 }),
          fc.float({ min: 20, max: 100 }),
          fc.float({ min: 20, max: 100 }),
          async (x, y, z) => {
            const aceleracion: DatosAceleracion = {
              x,
              y,
              z,
              timestamp: Date.now(),
            };

            const mockService = new MockAcelerometroService(aceleracion);
            const motor = new MotorBuffon(mockService);

            const apuesta = await motor.generarApuesta();

            expect(() => validador.validar(apuesta)).not.toThrow();
            expect(apuesta).toHaveLength(6);
            expect(new Set(apuesta).size).toBe(6);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('genera múltiples apuestas válidas consecutivas', async () => {
      await fc.assert(
        fc.asyncProperty(
          generadorAceleracion,
          fc.integer({ min: 3, max: 10 }),
          async (aceleracion, cantidadApuestas) => {
            const mockService = new MockAcelerometroService(aceleracion);
            const motor = new MotorBuffon(mockService);

            for (let i = 0; i < cantidadApuestas; i++) {
              const apuesta = await motor.generarApuesta();

              expect(() => validador.validar(apuesta)).not.toThrow();
              expect(apuesta).toHaveLength(6);
              expect(validador.estaOrdenada(apuesta)).toBe(true);
            }
          }
        ),
        { numRuns: 30 }
      );
    });

    it('genera apuestas válidas con valores extremos de aceleración', async () => {
      const valoresExtremos = [
        { x: 0, y: 0, z: 0, timestamp: Date.now() },
        { x: 100, y: 100, z: 100, timestamp: Date.now() },
        { x: -100, y: -100, z: -100, timestamp: Date.now() },
        { x: 50, y: -50, z: 0, timestamp: Date.now() },
      ];

      for (const aceleracion of valoresExtremos) {
        const mockService = new MockAcelerometroService(aceleracion);
        const motor = new MotorBuffon(mockService);

        const apuesta = await motor.generarApuesta();

        expect(() => validador.validar(apuesta)).not.toThrow();
        expect(apuesta).toHaveLength(6);
        expect(new Set(apuesta).size).toBe(6);
        expect(validador.estaOrdenada(apuesta)).toBe(true);
      }
    });
  });

  describe('Propiedades adicionales del Motor Buffon', () => {
    it('números generados están siempre en rango 1-49', async () => {
      await fc.assert(
        fc.asyncProperty(generadorAceleracion, async (aceleracion) => {
          const mockService = new MockAcelerometroService(aceleracion);
          const motor = new MotorBuffon(mockService);

          const apuesta = await motor.generarApuesta();

          expect(apuesta.every((n) => n >= 1 && n <= 49)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('no genera números duplicados', async () => {
      await fc.assert(
        fc.asyncProperty(generadorAceleracion, async (aceleracion) => {
          const mockService = new MockAcelerometroService(aceleracion);
          const motor = new MotorBuffon(mockService);

          const apuesta = await motor.generarApuesta();

          const unicos = new Set(apuesta);
          expect(unicos.size).toBe(6);
        }),
        { numRuns: 100 }
      );
    });
  });
});
