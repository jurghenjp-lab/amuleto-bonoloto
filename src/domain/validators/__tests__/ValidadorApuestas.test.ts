/**
 * Unit tests para ValidadorApuestas
 * Requisitos: 11.1, 11.2, 11.3, 11.5
 */

import { ValidadorApuestas } from '../index';

describe('ValidadorApuestas', () => {
  let validador: ValidadorApuestas;

  beforeEach(() => {
    validador = new ValidadorApuestas();
  });

  describe('validar()', () => {
    it('acepta una apuesta válida', () => {
      const apuestaValida = [1, 12, 23, 34, 45, 49];
      expect(() => validador.validar(apuestaValida)).not.toThrow();
    });

    it('rechaza apuesta vacía', () => {
      expect(() => validador.validar([])).toThrow('Apuesta debe tener 6 números, tiene 0');
    });

    it('rechaza apuesta con menos de 6 números', () => {
      expect(() => validador.validar([1, 2, 3])).toThrow('Apuesta debe tener 6 números, tiene 3');
    });

    it('rechaza apuesta con más de 6 números', () => {
      expect(() => validador.validar([1, 2, 3, 4, 5, 6, 7])).toThrow('Apuesta debe tener 6 números, tiene 7');
    });

    it('rechaza números negativos', () => {
      expect(() => validador.validar([-1, 2, 3, 4, 5, 6])).toThrow('Número -1 fuera de rango (1-49)');
    });

    it('rechaza número 0', () => {
      expect(() => validador.validar([0, 2, 3, 4, 5, 6])).toThrow('Número 0 fuera de rango (1-49)');
    });

    it('rechaza números mayores a 49', () => {
      expect(() => validador.validar([1, 2, 3, 4, 5, 50])).toThrow('Número 50 fuera de rango (1-49)');
    });

    it('rechaza números duplicados', () => {
      expect(() => validador.validar([1, 2, 3, 3, 5, 6])).toThrow('La apuesta contiene números duplicados');
    });

    it('rechaza todos los números duplicados', () => {
      expect(() => validador.validar([5, 5, 5, 5, 5, 5])).toThrow('La apuesta contiene números duplicados');
    });

    it('rechaza números decimales', () => {
      expect(() => validador.validar([1.5, 2, 3, 4, 5, 6])).toThrow('Número 1.5 no es entero');
    });

    it('rechaza números con decimales pequeños', () => {
      expect(() => validador.validar([1, 2, 3, 4, 5, 6.1])).toThrow('Número 6.1 no es entero');
    });
  });

  describe('estaOrdenada()', () => {
    it('retorna true para array ordenado ascendente', () => {
      expect(validador.estaOrdenada([1, 2, 3, 4, 5, 6])).toBe(true);
    });

    it('retorna true para array con saltos ordenados', () => {
      expect(validador.estaOrdenada([1, 10, 20, 30, 40, 49])).toBe(true);
    });

    it('retorna false para array desordenado', () => {
      expect(validador.estaOrdenada([3, 1, 2, 4, 5, 6])).toBe(false);
    });

    it('retorna false para array ordenado descendente', () => {
      expect(validador.estaOrdenada([6, 5, 4, 3, 2, 1])).toBe(false);
    });

    it('retorna false para array con números iguales consecutivos', () => {
      expect(validador.estaOrdenada([1, 2, 3, 3, 5, 6])).toBe(false);
    });

    it('retorna true para array vacío', () => {
      expect(validador.estaOrdenada([])).toBe(true);
    });

    it('retorna true para array con un solo elemento', () => {
      expect(validador.estaOrdenada([5])).toBe(true);
    });
  });
});
