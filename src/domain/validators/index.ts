/**
 * Validador de apuestas para Bonoloto
 * Requisitos: 11.1, 11.2, 11.3, 11.5
 */

export class ValidadorApuestas {
  /**
   * Valida que una apuesta cumpla todas las reglas de Bonoloto
   * @param numeros Array de números a validar
   * @throws Error si la apuesta no es válida
   * Requisitos: 11.1, 11.2, 11.3
   */
  validar(numeros: number[]): void {
    // Regla 1: Exactamente 6 números
    if (numeros.length !== 6) {
      throw new Error(`Apuesta debe tener 6 números, tiene ${numeros.length}`);
    }

    // Regla 2: Todos en rango 1-49
    for (const num of numeros) {
      if (num < 1 || num > 49) {
        throw new Error(`Número ${num} fuera de rango (1-49)`);
      }
    }

    // Regla 3: Sin duplicados
    const unicos = new Set(numeros);
    if (unicos.size !== 6) {
      throw new Error('La apuesta contiene números duplicados');
    }

    // Regla 4: Números deben ser enteros
    for (const num of numeros) {
      if (!Number.isInteger(num)) {
        throw new Error(`Número ${num} no es entero`);
      }
    }
  }

  /**
   * Verifica si un array de números está ordenado de menor a mayor
   * @param numeros Array de números a verificar
   * @returns true si está ordenado, false en caso contrario
   * Requisito: 11.5
   */
  estaOrdenada(numeros: number[]): boolean {
    for (let i = 0; i < numeros.length - 1; i++) {
      if (numeros[i] >= numeros[i + 1]) {
        return false;
      }
    }
    return true;
  }
}
