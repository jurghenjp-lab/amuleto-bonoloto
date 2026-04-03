/**
 * Property-based tests para ValidadorApuestas
 * Requisitos: 11.1, 11.2, 11.3
 */

import * as fc from 'fast-check';
import { ValidadorApuestas } from '../index';

describe('ValidadorApuestas - Property-Based Tests', () => {
  const validador = new ValidadorApuestas();

  /**
   * Propiedad 1: Validación rechaza apuestas inválidas
   * **Valida: Requisitos 11.1, 11.2, 11.3**
   *
   * Para cualquier array de números que no cumpla las reglas
   * (longitud ≠ 6, números fuera de rango 1-49, duplicados, no enteros),
   * el validador debe lanzar un error
   */
  describe('Propiedad 1: Validación rechaza apuestas inválidas', () => {
    it('rechaza arrays con longitud diferente de 6', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 49 }), { minLength: 0, maxLength: 20 }).filter(arr => arr.length !== 6),
          (numeros) => {
            expect(() => validador.validar(numeros)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rechaza arrays con números fuera de rango 1-49', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer(), { minLength: 6, maxLength: 6 }).filter(arr => {
            return arr.some(n => n < 1 || n > 49);
          }),
          (numeros) => {
            expect(() => validador.validar(numeros)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rechaza arrays con números duplicados', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 1, max: 49 }), { minLength: 6, maxLength: 6 }).filter(arr => {
            const unicos = new Set(arr);
            return unicos.size < 6;
          }),
          (numeros) => {
            expect(() => validador.validar(numeros)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rechaza arrays con números no enteros', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.array(fc.integer({ min: 1, max: 49 }), { minLength: 5, maxLength: 5 }),
            fc.float({ min: Math.fround(1.1), max: Math.fround(48.9) }).filter(n => !Number.isInteger(n))
          ),
          ([enteros, decimal]) => {
            const numeros = [...enteros, decimal];
            expect(() => validador.validar(numeros)).toThrow();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
