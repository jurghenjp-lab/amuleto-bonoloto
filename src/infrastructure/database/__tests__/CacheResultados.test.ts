/**
 * Unit tests para CacheResultados
 * Requisito: 12.5
 */

import { CacheResultados } from '../CacheResultados';
import { ResultadoSorteo } from '../../../types';

describe('CacheResultados', () => {
  let cache: CacheResultados;
  let mockResultados: ResultadoSorteo[];

  beforeEach(() => {
    cache = new CacheResultados();
    
    // Limpiar storage global para tests
    (global as any).__storage = {};

    // Datos de prueba
    mockResultados = [
      {
        fecha: new Date('2024-01-15'),
        combinacionGanadora: [1, 12, 23, 34, 41, 49],
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
      },
      {
        fecha: new Date('2024-01-16'),
        combinacionGanadora: [5, 10, 15, 20, 25, 30],
        complementario: 35,
        reintegro: 8,
        premios: {
          categoria1: { acertantes: 0, premio: 0 },
          categoria2: { acertantes: 2, premio: 75000 },
          categoria3: { acertantes: 30, premio: 1500 },
          categoria4: { acertantes: 750, premio: 60 },
          categoria5: { acertantes: 10000, premio: 5 },
          reintegro: { acertantes: 45000, premio: 1 },
        },
      },
    ];
  });

  afterEach(async () => {
    await cache.limpiar();
  });

  describe('guardar() y obtener()', () => {
    it('guarda y recupera resultados correctamente', async () => {
      await cache.guardar(mockResultados);
      const resultados = await cache.obtener();

      expect(resultados).not.toBeNull();
      expect(resultados).toHaveLength(2);
      expect(resultados![0].combinacionGanadora).toEqual([1, 12, 23, 34, 41, 49]);
      expect(resultados![1].combinacionGanadora).toEqual([5, 10, 15, 20, 25, 30]);
    });

    it('preserva las fechas correctamente', async () => {
      await cache.guardar(mockResultados);
      const resultados = await cache.obtener();

      expect(resultados![0].fecha).toEqual(new Date('2024-01-15'));
      expect(resultados![1].fecha).toEqual(new Date('2024-01-16'));
      expect(resultados![0].fecha).toBeInstanceOf(Date);
    });

    it('preserva los datos de premios correctamente', async () => {
      await cache.guardar(mockResultados);
      const resultados = await cache.obtener();

      expect(resultados![0].premios.categoria1.acertantes).toBe(1);
      expect(resultados![0].premios.categoria1.premio).toBe(500000);
      expect(resultados![1].premios.categoria2.premio).toBe(75000);
    });

    it('retorna null cuando no hay caché', async () => {
      const resultados = await cache.obtener();
      expect(resultados).toBeNull();
    });

    it('permite sobrescribir caché existente', async () => {
      await cache.guardar(mockResultados);
      
      const nuevosResultados: ResultadoSorteo[] = [
        {
          fecha: new Date('2024-02-01'),
          combinacionGanadora: [2, 4, 6, 8, 10, 12],
          complementario: 14,
          reintegro: 5,
          premios: {
            categoria1: { acertantes: 2, premio: 300000 },
            categoria2: { acertantes: 5, premio: 40000 },
            categoria3: { acertantes: 50, premio: 900 },
            categoria4: { acertantes: 900, premio: 45 },
            categoria5: { acertantes: 11000, premio: 5 },
            reintegro: { acertantes: 48000, premio: 1 },
          },
        },
      ];

      await cache.guardar(nuevosResultados);
      const resultados = await cache.obtener();

      expect(resultados).toHaveLength(1);
      expect(resultados![0].combinacionGanadora).toEqual([2, 4, 6, 8, 10, 12]);
    });
  });

  describe('esValido()', () => {
    it('retorna true para caché recién creado', async () => {
      await cache.guardar(mockResultados);
      
      // Obtener el caché directamente del storage para probarlo
      const cacheString = (global as any).__storage['bonoloto_resultados_cache'];
      const cacheData = JSON.parse(cacheString, (key: string, value: any) => {
        if ((key === 'fechaCache' || key === 'validoHasta' || key === 'fecha') && typeof value === 'string') {
          return new Date(value);
        }
        return value;
      });

      expect(cache.esValido(cacheData)).toBe(true);
    });

    it('retorna false para caché expirado (Requisito 12.5)', async () => {
      const fechaCache = new Date();
      const validoHasta = new Date(fechaCache.getTime() - 1000); // Expirado hace 1 segundo

      const cacheExpirado = {
        resultados: mockResultados,
        fechaCache,
        validoHasta,
      };

      expect(cache.esValido(cacheExpirado)).toBe(false);
    });

    it('retorna false para caché que expira exactamente ahora', async () => {
      const fechaCache = new Date();
      const validoHasta = new Date(); // Expira ahora

      const cacheExpirado = {
        resultados: mockResultados,
        fechaCache,
        validoHasta,
      };

      // Esperar un milisegundo para asegurar que ha expirado
      await new Promise(resolve => setTimeout(resolve, 1));

      expect(cache.esValido(cacheExpirado)).toBe(false);
    });

    it('retorna true para caché que expira en el futuro', async () => {
      const fechaCache = new Date();
      const validoHasta = new Date(fechaCache.getTime() + 24 * 60 * 60 * 1000); // Válido por 24 horas

      const cacheValido = {
        resultados: mockResultados,
        fechaCache,
        validoHasta,
      };

      expect(cache.esValido(cacheValido)).toBe(true);
    });
  });

  describe('obtener() con caché expirado', () => {
    it('retorna null y limpia caché expirado (Requisito 12.5)', async () => {
      // Guardar caché manualmente con fecha expirada
      const fechaCache = new Date();
      const validoHasta = new Date(fechaCache.getTime() - 1000); // Expirado

      const cacheExpirado = {
        resultados: mockResultados,
        fechaCache,
        validoHasta,
      };

      const cacheString = JSON.stringify(cacheExpirado, (key: string, value: any) => {
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });

      (global as any).__storage['bonoloto_resultados_cache'] = cacheString;

      // Intentar obtener caché expirado
      const resultados = await cache.obtener();

      expect(resultados).toBeNull();
      
      // Verificar que el caché fue limpiado
      expect((global as any).__storage['bonoloto_resultados_cache']).toBeUndefined();
    });
  });

  describe('limpiar()', () => {
    it('elimina el caché almacenado', async () => {
      await cache.guardar(mockResultados);
      
      // Verificar que existe
      let resultados = await cache.obtener();
      expect(resultados).not.toBeNull();

      // Limpiar
      await cache.limpiar();

      // Verificar que ya no existe
      resultados = await cache.obtener();
      expect(resultados).toBeNull();
    });

    it('no lanza error si no hay caché para limpiar', async () => {
      await expect(cache.limpiar()).resolves.not.toThrow();
    });
  });

  describe('manejo de errores', () => {
    it('maneja errores de JSON inválido', async () => {
      // Guardar JSON inválido manualmente
      (global as any).__storage['bonoloto_resultados_cache'] = 'invalid json {';

      const resultados = await cache.obtener();
      expect(resultados).toBeNull();
    });
  });
});
