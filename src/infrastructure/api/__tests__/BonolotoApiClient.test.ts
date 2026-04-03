/**
 * Unit tests para BonolotoApiClient
 * Requisitos: 12.2, 12.3, 12.4
 */

import { BonolotoApiClient } from '../index';

// Mock de fetch global
global.fetch = jest.fn();

describe('BonolotoApiClient', () => {
  let client: BonolotoApiClient;

  beforeEach(() => {
    client = new BonolotoApiClient();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('obtenerUltimoSorteo()', () => {
    it('obtiene y parsea correctamente un resultado válido', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: [5, 12, 23, 34, 41, 49],
        complementario: 7,
        reintegro: 3,
        premios: {
          categoria1: { acertantes: 1, premio: 500000 },
          categoria2: { acertantes: 3, premio: 50000 },
          categoria3: { acertantes: 45, premio: 1000 },
          categoria4: { acertantes: 890, premio: 50 },
          categoria5: { acertantes: 12000, premio: 5 },
          reintegro: { acertantes: 50000, premio: 1 },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const resultado = await client.obtenerUltimoSorteo();

      expect(resultado.fecha).toEqual(new Date('2024-01-15'));
      expect(resultado.combinacionGanadora).toEqual([5, 12, 23, 34, 41, 49]);
      expect(resultado.complementario).toBe(7);
      expect(resultado.reintegro).toBe(3);
      expect(resultado.premios.categoria1.acertantes).toBe(1);
      expect(resultado.premios.categoria1.premio).toBe(500000);
    });

    it('lanza error cuando la API devuelve error HTTP', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow('Error HTTP: 500');
    });

    it('lanza error cuando hay timeout (Requisito 12.2)', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        (_url: string, options: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () =>
                reject(Object.assign(new Error('AbortError'), { name: 'AbortError' }))
              );
            }
          })
      );

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow(
        'Timeout al consultar API de Bonoloto'
      );
    }, 20000);

    it('lanza error cuando falta el campo combinacion (Requisito 12.4)', async () => {
      const mockData = {
        fecha: '2024-01-15',
        complementario: 7,
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow(
        'Estructura de datos inválida de la API: falta combinacion'
      );
    });

    it('lanza error cuando combinacion no es un array (Requisito 12.4)', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: 'invalid',
        complementario: 7,
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow(
        'Estructura de datos inválida de la API: falta combinacion'
      );
    });

    it('lanza error cuando combinacion tiene menos de 6 números (Requisito 12.4)', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: [1, 2, 3],
        complementario: 7,
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow(
        'Estructura de datos inválida de la API: combinacion incompleta'
      );
    });

    it('lanza error cuando falta complementario (Requisito 12.4)', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: [1, 2, 3, 4, 5, 6],
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow(
        'Estructura de datos inválida de la API: falta complementario'
      );
    });

    it('lanza error cuando falta reintegro (Requisito 12.4)', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: [1, 2, 3, 4, 5, 6],
        complementario: 7,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow(
        'Estructura de datos inválida de la API: falta reintegro'
      );
    });

    it('lanza error cuando falta fecha (Requisito 12.4)', async () => {
      const mockData = {
        combinacion: [1, 2, 3, 4, 5, 6],
        complementario: 7,
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await expect(client.obtenerUltimoSorteo()).rejects.toThrow(
        'Estructura de datos inválida de la API: falta fecha'
      );
    });

    it('maneja correctamente datos sin premios', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: [1, 2, 3, 4, 5, 6],
        complementario: 7,
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const resultado = await client.obtenerUltimoSorteo();

      expect(resultado.premios.categoria1.acertantes).toBe(0);
      expect(resultado.premios.categoria1.premio).toBe(0);
    });
  });

  describe('obtenerResultadosRango()', () => {
    it('obtiene múltiples resultados en un rango de fechas', async () => {
      const mockData = [
        {
          fecha: '2024-01-15',
          combinacion: [1, 2, 3, 4, 5, 6],
          complementario: 7,
          reintegro: 3,
        },
        {
          fecha: '2024-01-16',
          combinacion: [7, 8, 9, 10, 11, 12],
          complementario: 13,
          reintegro: 4,
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const fechaInicio = new Date('2024-01-15');
      const fechaFin = new Date('2024-01-16');

      const resultados = await client.obtenerResultadosRango(fechaInicio, fechaFin);

      expect(resultados).toHaveLength(2);
      expect(resultados[0].combinacionGanadora).toEqual([1, 2, 3, 4, 5, 6]);
      expect(resultados[1].combinacionGanadora).toEqual([7, 8, 9, 10, 11, 12]);
    });

    it('maneja un solo resultado como array', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: [1, 2, 3, 4, 5, 6],
        complementario: 7,
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const fechaInicio = new Date('2024-01-15');
      const fechaFin = new Date('2024-01-15');

      const resultados = await client.obtenerResultadosRango(fechaInicio, fechaFin);

      expect(resultados).toHaveLength(1);
      expect(resultados[0].combinacionGanadora).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('formatea correctamente las fechas en la URL', async () => {
      const mockData = {
        fecha: '2024-01-15',
        combinacion: [1, 2, 3, 4, 5, 6],
        complementario: 7,
        reintegro: 3,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const fechaInicio = new Date('2024-01-15');
      const fechaFin = new Date('2024-01-31');

      await client.obtenerResultadosRango(fechaInicio, fechaFin);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('fecha_inicio=20240115&fecha_fin=20240131'),
        expect.any(Object)
      );
    });

    it('lanza error cuando hay timeout en rango (Requisito 12.2)', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        (_url: string, options: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () =>
                reject(Object.assign(new Error('AbortError'), { name: 'AbortError' }))
              );
            }
          })
      );

      const fechaInicio = new Date('2024-01-15');
      const fechaFin = new Date('2024-01-31');

      await expect(client.obtenerResultadosRango(fechaInicio, fechaFin)).rejects.toThrow(
        'Timeout al consultar API de Bonoloto'
      );
    }, 20000);
  });
});
