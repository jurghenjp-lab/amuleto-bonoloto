/**
 * Unit tests para ConfiguracionUsuarioSQLite
 * Requisitos: 3.1, 3.2, 3.3, 9.3
 */

import { ConfiguracionUsuarioSQLite } from '../ConfiguracionUsuarioSQLite';
import { ConfiguracionUsuario } from '../../../types';

describe('ConfiguracionUsuarioSQLite', () => {
  let repositorio: ConfiguracionUsuarioSQLite;
  let mockConfig: ConfiguracionUsuario;

  beforeEach(() => {
    repositorio = new ConfiguracionUsuarioSQLite();

    // Limpiar storage global para tests
    (global as any).__storage = {};

    // Datos de prueba
    mockConfig = {
      signoZodiacal: 'Leo',
      colorFavorito: 'Azul',
      equipoFutbol: 'Real Madrid',
      fechaConfiguracion: new Date('2024-01-15'),
    };
  });

  afterEach(async () => {
    await repositorio.eliminar();
  });

  describe('guardar() - Requisitos 3.1, 3.2, 3.3', () => {
    it('guarda configuración correctamente', async () => {
      await repositorio.guardar(mockConfig);

      const config = await repositorio.obtener();

      expect(config).not.toBeNull();
      expect(config!.signoZodiacal).toBe('Leo');
      expect(config!.colorFavorito).toBe('Azul');
      expect(config!.equipoFutbol).toBe('Real Madrid');
    });

    it('actualiza fecha de configuración al guardar', async () => {
      const antes = new Date();
      await repositorio.guardar(mockConfig);
      const despues = new Date();

      const config = await repositorio.obtener();

      expect(config!.fechaConfiguracion).toBeInstanceOf(Date);
      expect(config!.fechaConfiguracion.getTime()).toBeGreaterThanOrEqual(antes.getTime());
      expect(config!.fechaConfiguracion.getTime()).toBeLessThanOrEqual(despues.getTime());
    });

    it('sobrescribe configuración existente', async () => {
      await repositorio.guardar(mockConfig);

      const nuevaConfig: ConfiguracionUsuario = {
        signoZodiacal: 'Aries',
        colorFavorito: 'Rojo',
        equipoFutbol: 'Barcelona',
        fechaConfiguracion: new Date(),
      };

      await repositorio.guardar(nuevaConfig);

      const config = await repositorio.obtener();

      expect(config!.signoZodiacal).toBe('Aries');
      expect(config!.colorFavorito).toBe('Rojo');
      expect(config!.equipoFutbol).toBe('Barcelona');
    });

    it('guarda todos los signos zodiacales', async () => {
      const signos = [
        'Aries',
        'Tauro',
        'Géminis',
        'Cáncer',
        'Leo',
        'Virgo',
        'Libra',
        'Escorpio',
        'Sagitario',
        'Capricornio',
        'Acuario',
        'Piscis',
      ];

      for (const signo of signos) {
        const config: ConfiguracionUsuario = {
          ...mockConfig,
          signoZodiacal: signo as any,
        };

        await repositorio.guardar(config);
        const guardada = await repositorio.obtener();

        expect(guardada!.signoZodiacal).toBe(signo);
      }
    });

    it('guarda diferentes colores', async () => {
      const colores = ['Rojo', 'Azul', 'Verde', 'Amarillo', 'Negro', 'Blanco'];

      for (const color of colores) {
        const config: ConfiguracionUsuario = {
          ...mockConfig,
          colorFavorito: color,
        };

        await repositorio.guardar(config);
        const guardada = await repositorio.obtener();

        expect(guardada!.colorFavorito).toBe(color);
      }
    });

    it('guarda diferentes equipos de fútbol', async () => {
      const equipos = ['Real Madrid', 'Barcelona', 'Atlético Madrid', 'Valencia', 'Sevilla'];

      for (const equipo of equipos) {
        const config: ConfiguracionUsuario = {
          ...mockConfig,
          equipoFutbol: equipo,
        };

        await repositorio.guardar(config);
        const guardada = await repositorio.obtener();

        expect(guardada!.equipoFutbol).toBe(equipo);
      }
    });
  });

  describe('obtener() - Requisitos 3.1, 3.2, 3.3', () => {
    it('retorna null cuando no hay configuración', async () => {
      const config = await repositorio.obtener();

      expect(config).toBeNull();
    });

    it('recupera configuración guardada', async () => {
      await repositorio.guardar(mockConfig);

      const config = await repositorio.obtener();

      expect(config).not.toBeNull();
      expect(config!.signoZodiacal).toBe(mockConfig.signoZodiacal);
      expect(config!.colorFavorito).toBe(mockConfig.colorFavorito);
      expect(config!.equipoFutbol).toBe(mockConfig.equipoFutbol);
    });

    it('preserva las fechas correctamente', async () => {
      await repositorio.guardar(mockConfig);

      const config = await repositorio.obtener();

      expect(config!.fechaConfiguracion).toBeInstanceOf(Date);
    });

    it('maneja errores de JSON inválido', async () => {
      // Guardar JSON inválido manualmente
      (global as any).__storage['bonoloto_configuracion_usuario'] = 'invalid json {';

      const config = await repositorio.obtener();

      expect(config).toBeNull();
    });
  });

  describe('existe() - Requisito 3.1', () => {
    it('retorna false cuando no hay configuración', async () => {
      const existe = await repositorio.existe();

      expect(existe).toBe(false);
    });

    it('retorna true cuando hay configuración guardada', async () => {
      await repositorio.guardar(mockConfig);

      const existe = await repositorio.existe();

      expect(existe).toBe(true);
    });

    it('retorna false después de eliminar configuración', async () => {
      await repositorio.guardar(mockConfig);
      await repositorio.eliminar();

      const existe = await repositorio.existe();

      expect(existe).toBe(false);
    });
  });

  describe('eliminar()', () => {
    it('elimina configuración guardada', async () => {
      await repositorio.guardar(mockConfig);

      // Verificar que existe
      let existe = await repositorio.existe();
      expect(existe).toBe(true);

      // Eliminar
      await repositorio.eliminar();

      // Verificar que ya no existe
      existe = await repositorio.existe();
      expect(existe).toBe(false);
    });

    it('no lanza error si no hay configuración para eliminar', async () => {
      await expect(repositorio.eliminar()).resolves.not.toThrow();
    });

    it('permite guardar nueva configuración después de eliminar', async () => {
      await repositorio.guardar(mockConfig);
      await repositorio.eliminar();

      const nuevaConfig: ConfiguracionUsuario = {
        signoZodiacal: 'Piscis',
        colorFavorito: 'Verde',
        equipoFutbol: 'Sevilla',
        fechaConfiguracion: new Date(),
      };

      await repositorio.guardar(nuevaConfig);

      const config = await repositorio.obtener();

      expect(config).not.toBeNull();
      expect(config!.signoZodiacal).toBe('Piscis');
    });
  });

  describe('persistencia de datos - Requisito 9.3', () => {
    it('mantiene datos entre múltiples operaciones', async () => {
      await repositorio.guardar(mockConfig);

      // Leer múltiples veces
      const config1 = await repositorio.obtener();
      const config2 = await repositorio.obtener();
      const config3 = await repositorio.obtener();

      expect(config1).toEqual(config2);
      expect(config2).toEqual(config3);
    });

    it('actualiza correctamente en múltiples guardados', async () => {
      const configs = [
        { signoZodiacal: 'Leo', colorFavorito: 'Azul', equipoFutbol: 'Real Madrid' },
        { signoZodiacal: 'Aries', colorFavorito: 'Rojo', equipoFutbol: 'Barcelona' },
        { signoZodiacal: 'Tauro', colorFavorito: 'Verde', equipoFutbol: 'Atlético' },
      ];

      for (const configData of configs) {
        const config: ConfiguracionUsuario = {
          ...configData,
          fechaConfiguracion: new Date(),
        } as ConfiguracionUsuario;

        await repositorio.guardar(config);

        const guardada = await repositorio.obtener();

        expect(guardada!.signoZodiacal).toBe(configData.signoZodiacal);
        expect(guardada!.colorFavorito).toBe(configData.colorFavorito);
        expect(guardada!.equipoFutbol).toBe(configData.equipoFutbol);
      }
    });
  });

  describe('casos especiales', () => {
    it('maneja nombres de equipos con caracteres especiales', async () => {
      const config: ConfiguracionUsuario = {
        ...mockConfig,
        equipoFutbol: "Atlético de Madrid's Team",
      };

      await repositorio.guardar(config);
      const guardada = await repositorio.obtener();

      expect(guardada!.equipoFutbol).toBe("Atlético de Madrid's Team");
    });

    it('maneja colores con espacios', async () => {
      const config: ConfiguracionUsuario = {
        ...mockConfig,
        colorFavorito: 'Azul Claro',
      };

      await repositorio.guardar(config);
      const guardada = await repositorio.obtener();

      expect(guardada!.colorFavorito).toBe('Azul Claro');
    });
  });
});
