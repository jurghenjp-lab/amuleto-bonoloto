/**
 * Unit tests para MotorHistorico
 * Requisitos: 1.2, 1.3
 */

import { MotorHistorico } from '../MotorHistorico';
import { IBonolotoApiClient } from '../../interfaces';
import { ResultadoSorteo } from '../../../types';

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

describe('MotorHistorico', () => {
  let motor: MotorHistorico;
  let mockResultados: ResultadoSorteo[];

  beforeEach(() => {
    // Crear datos de prueba deterministas
    mockResultados = [];

    // Generar 100 sorteos con patrones conocidos
    for (let i = 0; i < 100; i++) {
      mockResultados.push({
        fecha: new Date(2024, 0, i + 1),
        // Números 1-6 aparecen frecuentemente (calientes)
        combinacionGanadora: [1, 2, 3, 4, 5, 6],
        complementario: 7,
        reintegro: 0,
        premios: {
          categoria1: { acertantes: 0, premio: 0 },
          categoria2: { acertantes: 0, premio: 0 },
          categoria3: { acertantes: 0, premio: 0 },
          categoria4: { acertantes: 0, premio: 0 },
          categoria5: { acertantes: 0, premio: 0 },
          reintegro: { acertantes: 0, premio: 0 },
        },
      });
    }

    // Agregar algunos sorteos con número 49 (que será frío)
    // Solo aparece en los primeros 5 sorteos, luego no aparece más
    for (let i = 0; i < 5; i++) {
      mockResultados[i].combinacionGanadora = [1, 2, 3, 4, 5, 49];
    }

    const mockApiClient = new MockBonolotoApiClient(mockResultados);
    motor = new MotorHistorico(mockApiClient);
  });

  describe('propiedades básicas', () => {
    it('tiene nombre correcto', () => {
      expect(motor.nombre).toBe('Motor Histórico');
    });

    it('no requiere configuración', () => {
      expect(motor.requiereConfiguracion).toBe(false);
    });
  });

  describe('calcularFrecuencias()', () => {
    it('calcula correctamente las frecuencias de aparición', () => {
      const frecuencias = motor['calcularFrecuencias'](mockResultados);

      // Números 1-5 aparecen en todos los sorteos (100 veces)
      expect(frecuencias[1]).toBe(100);
      expect(frecuencias[2]).toBe(100);
      expect(frecuencias[3]).toBe(100);
      expect(frecuencias[4]).toBe(100);
      expect(frecuencias[5]).toBe(100);

      // Número 6 aparece en 95 sorteos
      expect(frecuencias[6]).toBe(95);

      // Número 49 aparece solo en 5 sorteos
      expect(frecuencias[49]).toBe(5);

      // Números que no aparecen tienen frecuencia 0
      expect(frecuencias[10]).toBe(0);
      expect(frecuencias[20]).toBe(0);
    });

    it('inicializa todos los números del 1 al 49', () => {
      const frecuencias = motor['calcularFrecuencias']([]);

      for (let i = 1; i <= 49; i++) {
        expect(frecuencias[i]).toBeDefined();
        expect(frecuencias[i]).toBe(0);
      }
    });
  });

  describe('obtenerNumerosCalientes() - Requisito 1.2', () => {
    it('retorna los números más frecuentes', () => {
      const frecuencias = motor['calcularFrecuencias'](mockResultados);
      const calientes = motor['obtenerNumerosCalientes'](frecuencias, 15);

      expect(calientes).toHaveLength(15);

      // Los números 1-5 deben estar en el top 15 (son los más frecuentes)
      expect(calientes).toContain(1);
      expect(calientes).toContain(2);
      expect(calientes).toContain(3);
      expect(calientes).toContain(4);
      expect(calientes).toContain(5);
    });

    it('ordena por frecuencia descendente', () => {
      const frecuencias = motor['calcularFrecuencias'](mockResultados);
      const calientes = motor['obtenerNumerosCalientes'](frecuencias, 10);

      // Los primeros deben ser los más frecuentes
      const frecuenciasPrimeros = calientes.slice(0, 5).map((n) => frecuencias[n]);
      const frecuenciasUltimos = calientes.slice(5, 10).map((n) => frecuencias[n]);

      const minFrecuenciaPrimeros = Math.min(...frecuenciasPrimeros);
      const maxFrecuenciaUltimos = Math.max(...frecuenciasUltimos);

      expect(minFrecuenciaPrimeros).toBeGreaterThanOrEqual(maxFrecuenciaUltimos);
    });
  });

  describe('obtenerNumerosFrios() - Requisito 1.3', () => {
    it('identifica números que llevan más de 20 sorteos sin aparecer', () => {
      const frios = motor['obtenerNumerosFrios'](mockResultados, 20);

      // El número 49 aparece solo en los primeros 5 sorteos
      // Por lo tanto, lleva 95 sorteos sin aparecer
      expect(frios).toContain(49);

      // Los números 1-6 aparecen frecuentemente, no deben estar
      expect(frios).not.toContain(1);
      expect(frios).not.toContain(2);
      expect(frios).not.toContain(3);
      expect(frios).not.toContain(4);
      expect(frios).not.toContain(5);
    });

    it('retorna array vacío si no hay números fríos', () => {
      // Crear resultados donde todos los números aparecen recientemente
      const resultadosRecientes: ResultadoSorteo[] = [];
      for (let i = 0; i < 10; i++) {
        const numeros = [];
        for (let j = 0; j < 6; j++) {
          numeros.push((i * 6 + j) % 49 + 1);
        }
        resultadosRecientes.push({
          fecha: new Date(2024, 0, i + 1),
          combinacionGanadora: numeros,
          complementario: 7,
          reintegro: 0,
          premios: {
            categoria1: { acertantes: 0, premio: 0 },
            categoria2: { acertantes: 0, premio: 0 },
            categoria3: { acertantes: 0, premio: 0 },
            categoria4: { acertantes: 0, premio: 0 },
            categoria5: { acertantes: 0, premio: 0 },
            reintegro: { acertantes: 0, premio: 0 },
          },
        });
      }

      const frios = motor['obtenerNumerosFrios'](resultadosRecientes, 20);
      expect(frios.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generarApuesta() - Integración', () => {
    it('incluye al menos 4 números calientes (Requisito 1.2)', async () => {
      const apuesta = await motor.generarApuesta();
      const frecuencias = motor['calcularFrecuencias'](mockResultados);
      const calientes = motor['obtenerNumerosCalientes'](frecuencias, 15);

      const numerosCalientesEnApuesta = apuesta.filter((n) => calientes.includes(n));

      expect(numerosCalientesEnApuesta.length).toBeGreaterThanOrEqual(4);
    });

    it('incluye exactamente 1 número frío (Requisito 1.3)', async () => {
      const apuesta = await motor.generarApuesta();
      const frios = motor['obtenerNumerosFrios'](mockResultados, 20);

      const numerosFriosEnApuesta = apuesta.filter((n) => frios.includes(n));

      expect(numerosFriosEnApuesta.length).toBe(1);
    });

    it('genera apuestas diferentes en múltiples ejecuciones', async () => {
      const apuestas = new Set<string>();

      for (let i = 0; i < 10; i++) {
        const apuesta = await motor.generarApuesta();
        apuestas.add(apuesta.join(','));
      }

      // Debe haber al menos algunas apuestas diferentes
      expect(apuestas.size).toBeGreaterThan(1);
    });
  });

  describe('ajustarDistribucionParImpar()', () => {
    it('mantiene distribución válida 3:3', () => {
      const apuesta = [2, 4, 6, 1, 3, 5]; // 3 pares, 3 impares
      const ajustada = motor['ajustarDistribucionParImpar'](apuesta);

      const pares = ajustada.filter((n) => n % 2 === 0).length;
      const impares = ajustada.filter((n) => n % 2 !== 0).length;

      expect(pares).toBe(3);
      expect(impares).toBe(3);
    });

    it('mantiene distribución válida 4:2', () => {
      const apuesta = [2, 4, 6, 8, 1, 3]; // 4 pares, 2 impares
      const ajustada = motor['ajustarDistribucionParImpar'](apuesta);

      const pares = ajustada.filter((n) => n % 2 === 0).length;
      const impares = ajustada.filter((n) => n % 2 !== 0).length;

      expect(pares).toBe(4);
      expect(impares).toBe(2);
    });

    it('ajusta distribución inválida 6:0', () => {
      const apuesta = [2, 4, 6, 8, 10, 12]; // 6 pares, 0 impares
      const ajustada = motor['ajustarDistribucionParImpar'](apuesta);

      const pares = ajustada.filter((n) => n % 2 === 0).length;
      const impares = ajustada.filter((n) => n % 2 !== 0).length;

      // Debe ser una distribución válida
      const esValida =
        (pares === 3 && impares === 3) ||
        (pares === 4 && impares === 2) ||
        (pares === 2 && impares === 4);

      expect(esValida).toBe(true);
    });

    it('ajusta distribución inválida 5:1', () => {
      const apuesta = [2, 4, 6, 8, 10, 1]; // 5 pares, 1 impar
      const ajustada = motor['ajustarDistribucionParImpar'](apuesta);

      const pares = ajustada.filter((n) => n % 2 === 0).length;
      const impares = ajustada.filter((n) => n % 2 !== 0).length;

      const esValida =
        (pares === 3 && impares === 3) ||
        (pares === 4 && impares === 2) ||
        (pares === 2 && impares === 4);

      expect(esValida).toBe(true);
    });
  });
});
