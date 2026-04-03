/**
 * Unit tests para RepositorioApuestasSQLite
 * Requisitos: 6.1, 6.3, 6.4, 6.5
 */

import { RepositorioApuestasSQLite } from '../RepositorioApuestasSQLite';
import { Apuesta } from '../../../types';

describe('RepositorioApuestasSQLite', () => {
  let repositorio: RepositorioApuestasSQLite;
  let mockApuesta: Apuesta;

  beforeEach(() => {
    repositorio = new RepositorioApuestasSQLite();

    // Limpiar storage global para tests
    (global as any).__storage = {};

    // Datos de prueba
    mockApuesta = {
      numeros: [1, 12, 23, 34, 41, 49],
      motor: 'Motor Histórico',
      fechaGeneracion: new Date('2024-01-15'),
    };
  });

  afterEach(async () => {
    await repositorio.limpiarTodas();
  });

  describe('guardar() - Requisitos 6.1, 6.2', () => {
    it('guarda apuesta correctamente', async () => {
      await repositorio.guardar(mockApuesta);

      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas).toHaveLength(1);
      expect(apuestas[0].numeros).toEqual(mockApuesta.numeros);
      expect(apuestas[0].motor).toBe(mockApuesta.motor);
    });

    it('genera ID único si no existe (Requisito 6.5)', async () => {
      await repositorio.guardar(mockApuesta);

      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas[0].id).toBeDefined();
      expect(typeof apuestas[0].id).toBe('string');
      expect(apuestas[0].id!.length).toBeGreaterThan(0);
    });

    it('preserva ID si ya existe', async () => {
      const apuestaConId: Apuesta = {
        ...mockApuesta,
        id: 'id-personalizado-123',
      };

      await repositorio.guardar(apuestaConId);

      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas[0].id).toBe('id-personalizado-123');
    });

    it('serializa números correctamente (Requisito 6.2)', async () => {
      await repositorio.guardar(mockApuesta);

      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas[0].numeros).toEqual([1, 12, 23, 34, 41, 49]);
      expect(Array.isArray(apuestas[0].numeros)).toBe(true);
    });

    it('preserva fechas correctamente', async () => {
      await repositorio.guardar(mockApuesta);

      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas[0].fechaGeneracion).toEqual(new Date('2024-01-15'));
      expect(apuestas[0].fechaGeneracion).toBeInstanceOf(Date);
    });

    it('permite guardar múltiples apuestas', async () => {
      await repositorio.guardar(mockApuesta);

      const apuesta2: Apuesta = {
        numeros: [5, 10, 15, 20, 25, 30],
        motor: 'Motor Buffon',
        fechaGeneracion: new Date('2024-01-16'),
      };

      await repositorio.guardar(apuesta2);

      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas).toHaveLength(2);
    });
  });

  describe('obtenerTodas() - Requisito 6.3', () => {
    it('retorna array vacío cuando no hay apuestas', async () => {
      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas).toEqual([]);
    });

    it('retorna todas las apuestas guardadas', async () => {
      await repositorio.guardar(mockApuesta);

      const apuesta2: Apuesta = {
        numeros: [2, 4, 6, 8, 10, 12],
        motor: 'Motor Amuleto',
        fechaGeneracion: new Date('2024-01-16'),
      };

      await repositorio.guardar(apuesta2);

      const apuestas = await repositorio.obtenerTodas();

      expect(apuestas).toHaveLength(2);
    });

    it('ordena por fecha descendente (más recientes primero) - Requisito 6.3', async () => {
      const apuesta1: Apuesta = {
        numeros: [1, 2, 3, 4, 5, 6],
        motor: 'Motor Histórico',
        fechaGeneracion: new Date('2024-01-10'),
      };

      const apuesta2: Apuesta = {
        numeros: [7, 8, 9, 10, 11, 12],
        motor: 'Motor Buffon',
        fechaGeneracion: new Date('2024-01-15'),
      };

      const apuesta3: Apuesta = {
        numeros: [13, 14, 15, 16, 17, 18],
        motor: 'Motor Amuleto',
        fechaGeneracion: new Date('2024-01-12'),
      };

      await repositorio.guardar(apuesta1);
      await repositorio.guardar(apuesta2);
      await repositorio.guardar(apuesta3);

      const apuestas = await repositorio.obtenerTodas();

      // Orden esperado: apuesta2 (15), apuesta3 (12), apuesta1 (10)
      expect(apuestas[0].fechaGeneracion).toEqual(new Date('2024-01-15'));
      expect(apuestas[1].fechaGeneracion).toEqual(new Date('2024-01-12'));
      expect(apuestas[2].fechaGeneracion).toEqual(new Date('2024-01-10'));
    });
  });

  describe('eliminar() - Requisito 6.4', () => {
    it('elimina apuesta por ID', async () => {
      await repositorio.guardar(mockApuesta);

      const apuestas = await repositorio.obtenerTodas();
      const id = apuestas[0].id!;

      await repositorio.eliminar(id);

      const apuestasDespues = await repositorio.obtenerTodas();

      expect(apuestasDespues).toHaveLength(0);
    });

    it('elimina solo la apuesta especificada', async () => {
      await repositorio.guardar(mockApuesta);

      const apuesta2: Apuesta = {
        numeros: [2, 4, 6, 8, 10, 12],
        motor: 'Motor Buffon',
        fechaGeneracion: new Date('2024-01-16'),
      };

      await repositorio.guardar(apuesta2);

      const apuestas = await repositorio.obtenerTodas();
      const idAEliminar = apuestas[0].id!;

      await repositorio.eliminar(idAEliminar);

      const apuestasDespues = await repositorio.obtenerTodas();

      expect(apuestasDespues).toHaveLength(1);
      expect(apuestasDespues[0].id).not.toBe(idAEliminar);
    });

    it('no lanza error si ID no existe', async () => {
      await expect(repositorio.eliminar('id-inexistente')).resolves.not.toThrow();
    });
  });

  describe('persistencia de datos - Requisito 6.5', () => {
    it('mantiene datos entre múltiples operaciones', async () => {
      await repositorio.guardar(mockApuesta);

      // Leer múltiples veces
      const apuestas1 = await repositorio.obtenerTodas();
      const apuestas2 = await repositorio.obtenerTodas();
      const apuestas3 = await repositorio.obtenerTodas();

      expect(apuestas1).toEqual(apuestas2);
      expect(apuestas2).toEqual(apuestas3);
    });

    it('los datos permanecen locales (Requisito 6.5)', async () => {
      await repositorio.guardar(mockApuesta);

      // Verificar que los datos están en storage local
      const storage = (global as any).__storage;
      const keys = Object.keys(storage);

      // Debe haber al menos una clave con el prefijo de apuesta
      const apuestaKeys = keys.filter((k) => k.startsWith('bonoloto_apuesta_'));
      expect(apuestaKeys.length).toBeGreaterThan(0);
    });
  });

  describe('limpiarTodas()', () => {
    it('elimina todas las apuestas', async () => {
      await repositorio.guardar(mockApuesta);

      const apuesta2: Apuesta = {
        numeros: [2, 4, 6, 8, 10, 12],
        motor: 'Motor Buffon',
        fechaGeneracion: new Date('2024-01-16'),
      };

      await repositorio.guardar(apuesta2);

      // Verificar que hay apuestas
      let apuestas = await repositorio.obtenerTodas();
      expect(apuestas.length).toBeGreaterThan(0);

      // Limpiar
      await repositorio.limpiarTodas();

      // Verificar que ya no hay apuestas
      apuestas = await repositorio.obtenerTodas();
      expect(apuestas).toHaveLength(0);
    });
  });

  describe('generación de IDs - Requisito 6.5', () => {
    it('genera IDs únicos para múltiples apuestas', async () => {
      const apuestas: Apuesta[] = [];

      for (let i = 0; i < 10; i++) {
        const apuesta: Apuesta = {
          numeros: [i + 1, i + 2, i + 3, i + 4, i + 5, i + 6],
          motor: 'Motor Histórico',
          fechaGeneracion: new Date(),
        };

        await repositorio.guardar(apuesta);
      }

      const guardadas = await repositorio.obtenerTodas();
      const ids = guardadas.map((a) => a.id);
      const idsUnicos = new Set(ids);

      expect(idsUnicos.size).toBe(10);
    });

    it('IDs contienen timestamp y componente aleatorio', async () => {
      await repositorio.guardar(mockApuesta);

      const apuestas = await repositorio.obtenerTodas();
      const id = apuestas[0].id!;

      // El ID debe contener un guión separando timestamp y parte aleatoria
      expect(id).toContain('-');

      const partes = id.split('-');
      expect(partes).toHaveLength(2);

      // Primera parte debe ser numérica (timestamp)
      expect(!isNaN(Number(partes[0]))).toBe(true);
    });
  });

  describe('manejo de errores', () => {
    it('maneja JSON inválido en storage', async () => {
      // Guardar JSON inválido manualmente
      (global as any).__storage['bonoloto_apuesta_invalid'] = 'invalid json {';
      (global as any).__storage['bonoloto_apuestas_index'] = '["invalid"]';

      const apuestas = await repositorio.obtenerTodas();

      // Debe retornar array vacío sin lanzar error
      expect(Array.isArray(apuestas)).toBe(true);
    });
  });
});
