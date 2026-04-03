/**
 * Unit tests para MotorAmuleto
 * Requisitos: 3.1, 3.2, 3.3, 3.4
 */

import { MotorAmuleto } from '../MotorAmuleto';
import { IConfiguracionUsuario } from '../../interfaces';
import { ConfiguracionUsuario } from '../../../types';

// Mock del repositorio de configuración
class MockConfiguracionUsuario implements IConfiguracionUsuario {
  private config: ConfiguracionUsuario | null = null;

  async guardar(config: ConfiguracionUsuario): Promise<void> {
    this.config = config;
  }

  async obtener(): Promise<ConfiguracionUsuario | null> {
    return this.config;
  }

  async existe(): Promise<boolean> {
    return this.config !== null;
  }
}

describe('MotorAmuleto', () => {
  let motor: MotorAmuleto;
  let mockRepo: MockConfiguracionUsuario;
  let mockConfig: ConfiguracionUsuario;

  beforeEach(() => {
    mockRepo = new MockConfiguracionUsuario();
    motor = new MotorAmuleto(mockRepo);

    mockConfig = {
      signoZodiacal: 'Leo',
      colorFavorito: 'Azul',
      equipoFutbol: 'Real Madrid',
      fechaConfiguracion: new Date(),
    };
  });

  describe('propiedades básicas', () => {
    it('tiene nombre correcto', () => {
      expect(motor.nombre).toBe('Motor Amuleto');
    });

    it('requiere configuración', () => {
      expect(motor.requiereConfiguracion).toBe(true);
    });
  });

  describe('calcularSemillaZodiacal() - Requisito 3.1', () => {
    it('calcula semillas para todos los signos zodiacales', () => {
      const signos = [
        { signo: 'Aries', esperado: 9 },
        { signo: 'Tauro', esperado: 6 },
        { signo: 'Géminis', esperado: 5 },
        { signo: 'Cáncer', esperado: 2 },
        { signo: 'Leo', esperado: 1 },
        { signo: 'Virgo', esperado: 5 },
        { signo: 'Libra', esperado: 6 },
        { signo: 'Escorpio', esperado: 9 },
        { signo: 'Sagitario', esperado: 3 },
        { signo: 'Capricornio', esperado: 8 },
        { signo: 'Acuario', esperado: 4 },
        { signo: 'Piscis', esperado: 7 },
      ];

      for (const { signo, esperado } of signos) {
        const semilla = motor['calcularSemillaZodiacal'](signo as any);
        expect(semilla).toBe(esperado);
      }
    });

    it('retorna valores consistentes para el mismo signo', () => {
      const semilla1 = motor['calcularSemillaZodiacal']('Leo');
      const semilla2 = motor['calcularSemillaZodiacal']('Leo');

      expect(semilla1).toBe(semilla2);
    });
  });

  describe('calcularSemillaColor() - Requisito 3.2', () => {
    it('calcula semillas para colores del espectro', () => {
      const colores = [
        { color: 'Rojo', esperado: 1 },
        { color: 'Naranja', esperado: 8 },
        { color: 'Amarillo', esperado: 15 },
        { color: 'Verde', esperado: 22 },
        { color: 'Azul', esperado: 29 },
        { color: 'Añil', esperado: 36 },
        { color: 'Violeta', esperado: 43 },
      ];

      for (const { color, esperado } of colores) {
        const semilla = motor['calcularSemillaColor'](color);
        expect(semilla).toBe(esperado);
      }
    });

    it('calcula semillas para colores adicionales', () => {
      expect(motor['calcularSemillaColor']('Rosa')).toBe(10);
      expect(motor['calcularSemillaColor']('Blanco')).toBe(25);
      expect(motor['calcularSemillaColor']('Negro')).toBe(49);
    });

    it('retorna valor por defecto para colores desconocidos', () => {
      const semilla = motor['calcularSemillaColor']('ColorInexistente');
      expect(semilla).toBe(25); // Default: blanco
    });

    it('normaliza mayúsculas y minúsculas', () => {
      expect(motor['calcularSemillaColor']('azul')).toBe(29);
      expect(motor['calcularSemillaColor']('AZUL')).toBe(29);
      expect(motor['calcularSemillaColor']('Azul')).toBe(29);
    });
  });

  describe('calcularSemillaEquipo() - Requisito 3.3', () => {
    it('calcula semilla basada en suma ASCII', () => {
      const semilla = motor['calcularSemillaEquipo']('Real Madrid');

      expect(semilla).toBeGreaterThanOrEqual(1);
      expect(semilla).toBeLessThanOrEqual(49);
    });

    it('retorna valores diferentes para equipos diferentes', () => {
      const semilla1 = motor['calcularSemillaEquipo']('Real Madrid');
      const semilla2 = motor['calcularSemillaEquipo']('Barcelona');

      expect(semilla1).not.toBe(semilla2);
    });

    it('retorna valores consistentes para el mismo equipo', () => {
      const semilla1 = motor['calcularSemillaEquipo']('Real Madrid');
      const semilla2 = motor['calcularSemillaEquipo']('Real Madrid');

      expect(semilla1).toBe(semilla2);
    });

    it('maneja equipos con caracteres especiales', () => {
      const semilla = motor['calcularSemillaEquipo']('Atlético Madrid');

      expect(semilla).toBeGreaterThanOrEqual(1);
      expect(semilla).toBeLessThanOrEqual(49);
    });

    it('maneja nombres de equipos largos', () => {
      const semilla = motor['calcularSemillaEquipo']('Real Club Deportivo Espanyol de Barcelona');

      expect(semilla).toBeGreaterThanOrEqual(1);
      expect(semilla).toBeLessThanOrEqual(49);
    });
  });

  describe('generarHash() - Requisito 3.4', () => {
    it('genera hash determinista', () => {
      const hash1 = motor['generarHash']('test-input');
      const hash2 = motor['generarHash']('test-input');

      expect(hash1).toBe(hash2);
    });

    it('genera hashes diferentes para entradas diferentes', () => {
      const hash1 = motor['generarHash']('input1');
      const hash2 = motor['generarHash']('input2');

      expect(hash1).not.toBe(hash2);
    });

    it('genera hash con longitud suficiente', () => {
      const hash = motor['generarHash']('test');

      expect(hash.length).toBeGreaterThanOrEqual(12);
    });

    it('genera hash hexadecimal válido', () => {
      const hash = motor['generarHash']('test');

      // Verificar que solo contiene caracteres hexadecimales
      expect(/^[0-9a-f]+$/i.test(hash)).toBe(true);
    });
  });

  describe('hashANumeros() - Requisito 3.7', () => {
    it('convierte hash a exactamente 6 números', () => {
      const hash = motor['generarHash']('test');
      const numeros = motor['hashANumeros'](hash);

      expect(numeros).toHaveLength(6);
    });

    it('genera números en rango 1-49', () => {
      const hash = motor['generarHash']('test');
      const numeros = motor['hashANumeros'](hash);

      expect(numeros.every((n) => n >= 1 && n <= 49)).toBe(true);
    });

    it('genera números únicos', () => {
      const hash = motor['generarHash']('test');
      const numeros = motor['hashANumeros'](hash);

      const unicos = new Set(numeros);
      expect(unicos.size).toBe(6);
    });

    it('retorna números ordenados', () => {
      const hash = motor['generarHash']('test');
      const numeros = motor['hashANumeros'](hash);

      for (let i = 0; i < numeros.length - 1; i++) {
        expect(numeros[i]).toBeLessThan(numeros[i + 1]);
      }
    });

    it('genera números diferentes para hashes diferentes', () => {
      const hash1 = motor['generarHash']('input1');
      const hash2 = motor['generarHash']('input2');

      const numeros1 = motor['hashANumeros'](hash1);
      const numeros2 = motor['hashANumeros'](hash2);

      expect(numeros1).not.toEqual(numeros2);
    });
  });

  describe('generarApuesta() - Integración', () => {
    it('lanza error si no hay configuración', async () => {
      await expect(motor.generarApuesta()).rejects.toThrow(
        'Motor Amuleto requiere configuración del usuario'
      );
    });

    it('genera apuesta con configuración válida', async () => {
      await mockRepo.guardar(mockConfig);

      const apuesta = await motor.generarApuesta();

      expect(apuesta).toHaveLength(6);
      expect(new Set(apuesta).size).toBe(6);
      expect(apuesta.every((n) => n >= 1 && n <= 49)).toBe(true);
    });

    it('genera la misma apuesta múltiples veces en el mismo día', async () => {
      await mockRepo.guardar(mockConfig);

      const apuesta1 = await motor.generarApuesta();
      const apuesta2 = await motor.generarApuesta();
      const apuesta3 = await motor.generarApuesta();

      expect(apuesta1).toEqual(apuesta2);
      expect(apuesta2).toEqual(apuesta3);
    });

    it('genera apuestas diferentes para configuraciones diferentes', async () => {
      await mockRepo.guardar(mockConfig);
      const apuesta1 = await motor.generarApuesta();

      const config2: ConfiguracionUsuario = {
        signoZodiacal: 'Aries',
        colorFavorito: 'Rojo',
        equipoFutbol: 'Barcelona',
        fechaConfiguracion: new Date(),
      };

      await mockRepo.guardar(config2);
      const apuesta2 = await motor.generarApuesta();

      expect(apuesta1).not.toEqual(apuesta2);
    });
  });

  describe('generarApuestaParaFecha()', () => {
    it('genera apuestas diferentes para fechas diferentes', async () => {
      await mockRepo.guardar(mockConfig);

      const fecha1 = new Date('2024-01-15');
      const fecha2 = new Date('2024-01-16');

      const apuesta1 = await motor.generarApuestaParaFecha(fecha1);
      const apuesta2 = await motor.generarApuestaParaFecha(fecha2);

      expect(apuesta1).not.toEqual(apuesta2);
    });

    it('genera la misma apuesta para la misma fecha', async () => {
      await mockRepo.guardar(mockConfig);

      const fecha = new Date('2024-01-15');

      const apuesta1 = await motor.generarApuestaParaFecha(fecha);
      const apuesta2 = await motor.generarApuestaParaFecha(fecha);

      expect(apuesta1).toEqual(apuesta2);
    });

    it('lanza error si no hay configuración', async () => {
      const fecha = new Date('2024-01-15');

      await expect(motor.generarApuestaParaFecha(fecha)).rejects.toThrow(
        'Motor Amuleto requiere configuración del usuario'
      );
    });
  });
});
