/**
 * Property-based tests para RepositorioApuestasSQLite
 * Requisitos: 6.1, 6.2, 6.3
 */

import * as fc from 'fast-check';
import { RepositorioApuestasSQLite } from '../RepositorioApuestasSQLite';
import { Apuesta } from '../../../types';

describe('RepositorioApuestasSQLite - Property-Based Tests', () => {
  let repositorio: RepositorioApuestasSQLite;

  beforeEach(() => {
    repositorio = new RepositorioApuestasSQLite();
    // Limpiar storage global para tests
    (global as any).__storage = {};
  });

  afterEach(async () => {
    await repositorio.limpiarTodas();
  });

  /**
   * Generador de apuestas válidas
   */
  const generadorApuesta = fc.record({
    numeros: fc
      .array(fc.integer({ min: 1, max: 49 }), { minLength: 6, maxLength: 6 })
      .map((arr) => {
        // Asegurar que sean únicos y ordenados
        const unicos = Array.from(new Set(arr));
        while (unicos.length < 6) {
          const nuevo = Math.floor(Math.random() * 49) + 1;
          if (!unicos.includes(nuevo)) {
            unicos.push(nuevo);
          }
        }
        return unicos.slice(0, 6).sort((a, b) => a - b);
      }),
    motor: fc.constantFrom('Motor Histórico', 'Motor Buffon', 'Motor Amuleto'),
    fechaGeneracion: fc.date(),
  });

  /**
   * Propiedad 9: Persistencia round trip
   * **Valida: Requisitos 6.1, 6.2, 6.3**
   *
   * Para cualquier apuesta válida, guardarla y luego recuperarla
   * debe producir una apuesta equivalente (mismos números, motor, fecha)
   */
  describe('Propiedad 9: Persistencia round trip', () => {
    it('guarda y recupera apuestas correctamente', async () => {
      await fc.assert(
        fc.asyncProperty(generadorApuesta, async (apuestaData) => {
          const apuesta: Apuesta = {
            ...apuestaData,
            id: undefined, // El repositorio generará el ID
          };

          // Guardar
          await repositorio.guardar(apuesta);

          // Recuperar
          const apuestas = await repositorio.obtenerTodas();

          // Debe haber al menos una apuesta
          expect(apuestas.length).toBeGreaterThan(0);

          // Encontrar la apuesta guardada
          const recuperada = apuestas.find(
            (a) =>
              a.numeros.join(',') === apuesta.numeros.join(',') && a.motor === apuesta.motor
          );

          expect(recuperada).toBeDefined();
          expect(recuperada!.numeros).toEqual(apuesta.numeros);
          expect(recuperada!.motor).toBe(apuesta.motor);
          expect(recuperada!.fechaGeneracion).toEqual(apuesta.fechaGeneracion);
          expect(recuperada!.id).toBeDefined();
        }),
        { numRuns: 100 }
      );
    });

    it('preserva todos los campos de la apuesta', async () => {
      await fc.assert(
        fc.asyncProperty(generadorApuesta, async (apuestaData) => {
          (global as any).__storage = {};
          const apuesta: Apuesta = apuestaData;

          await repositorio.guardar(apuesta);
          const apuestas = await repositorio.obtenerTodas();

          const recuperada = apuestas[0];

          // Verificar cada campo
          expect(recuperada.numeros).toEqual(apuesta.numeros);
          expect(recuperada.motor).toBe(apuesta.motor);
          expect(recuperada.fechaGeneracion).toEqual(apuesta.fechaGeneracion);
        }),
        { numRuns: 100 }
      );
    });

    it('maneja múltiples apuestas correctamente', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(generadorApuesta, { minLength: 1, maxLength: 10 }),
          async (apuestasData) => {
            (global as any).__storage = {};
            // Guardar todas las apuestas
            for (const apuestaData of apuestasData) {
              const apuesta: Apuesta = apuestaData;
              await repositorio.guardar(apuesta);
            }

            // Recuperar todas
            const recuperadas = await repositorio.obtenerTodas();

            // Debe haber el mismo número de apuestas
            expect(recuperadas.length).toBe(apuestasData.length);

            // Todas deben tener ID
            expect(recuperadas.every((a) => a.id !== undefined)).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Propiedades adicionales del Repositorio', () => {
    it('genera IDs únicos para cada apuesta', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(generadorApuesta, { minLength: 2, maxLength: 10 }),
          async (apuestasData) => {
            // Guardar todas las apuestas
            for (const apuestaData of apuestasData) {
              await repositorio.guardar(apuestaData);
            }

            // Recuperar todas
            const recuperadas = await repositorio.obtenerTodas();

            // Todos los IDs deben ser únicos
            const ids = recuperadas.map((a) => a.id);
            const idsUnicos = new Set(ids);

            expect(idsUnicos.size).toBe(ids.length);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('mantiene el orden por fecha (más recientes primero)', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(generadorApuesta, { minLength: 3, maxLength: 8 }),
          async (apuestasData) => {
            // Guardar apuestas con fechas diferentes
            for (let i = 0; i < apuestasData.length; i++) {
              const apuesta: Apuesta = {
                ...apuestasData[i],
                fechaGeneracion: new Date(2024, 0, i + 1), // Fechas incrementales
              };
              await repositorio.guardar(apuesta);
            }

            // Recuperar todas
            const recuperadas = await repositorio.obtenerTodas();

            // Verificar orden descendente por fecha
            for (let i = 0; i < recuperadas.length - 1; i++) {
              expect(recuperadas[i].fechaGeneracion.getTime()).toBeGreaterThanOrEqual(
                recuperadas[i + 1].fechaGeneracion.getTime()
              );
            }
          }
        ),
        { numRuns: 30 }
      );
    });
  });
});
