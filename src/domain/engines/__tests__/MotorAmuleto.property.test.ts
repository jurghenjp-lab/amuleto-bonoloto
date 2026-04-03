/**
 * Property-based tests para MotorAmuleto
 * Requisitos: 3.5, 3.6, 3.7, 11.1, 11.2, 11.3
 */

import * as fc from 'fast-check';
import { MotorAmuleto } from '../MotorAmuleto';
import { IConfiguracionUsuario } from '../../interfaces';
import { ConfiguracionUsuario, SignoZodiacal } from '../../../types';
import { ValidadorApuestas } from '../../validators';

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

describe('MotorAmuleto - Property-Based Tests', () => {
  const validador = new ValidadorApuestas();

  /**
   * Generador de signos zodiacales
   */
  const generadorSignoZodiacal = fc.constantFrom<SignoZodiacal>(
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
    'Piscis'
  );

  /**
   * Generador de colores
   */
  const generadorColor = fc.constantFrom(
    'Rojo',
    'Naranja',
    'Amarillo',
    'Verde',
    'Azul',
    'Añil',
    'Violeta',
    'Rosa',
    'Blanco',
    'Negro'
  );

  /**
   * Generador de equipos de fútbol
   */
  const generadorEquipo = fc.constantFrom(
    'Real Madrid',
    'Barcelona',
    'Atlético Madrid',
    'Valencia',
    'Sevilla',
    'Athletic Bilbao',
    'Real Sociedad',
    'Betis'
  );

  /**
   * Generador de configuración de usuario
   */
  const generadorConfiguracion = fc.record({
    signoZodiacal: generadorSignoZodiacal,
    colorFavorito: generadorColor,
    equipoFutbol: generadorEquipo,
    fechaConfiguracion: fc.date(),
  });

  /**
   * Propiedad 5: Determinismo en el mismo día
   * **Valida: Requisito 3.5**
   *
   * Para cualquier configuración de usuario, generar apuestas múltiples veces
   * en el mismo día debe producir la misma combinación
   */
  describe('Propiedad 5: Determinismo en el mismo día', () => {
    it('genera la misma apuesta múltiples veces en el mismo día', async () => {
      await fc.assert(
        fc.asyncProperty(generadorConfiguracion, async (config) => {
          const mockRepo = new MockConfiguracionUsuario();
          await mockRepo.guardar(config);

          const motor = new MotorAmuleto(mockRepo);

          // Generar múltiples apuestas en el mismo día
          const apuesta1 = await motor.generarApuesta();
          const apuesta2 = await motor.generarApuesta();
          const apuesta3 = await motor.generarApuesta();

          // Todas deben ser idénticas
          expect(apuesta1).toEqual(apuesta2);
          expect(apuesta2).toEqual(apuesta3);
        }),
        { numRuns: 100 }
      );
    });

    it('genera la misma apuesta para la misma fecha específica', async () => {
      await fc.assert(
        fc.asyncProperty(
          generadorConfiguracion,
          fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }),
          async (config, fecha) => {
            const mockRepo = new MockConfiguracionUsuario();
            await mockRepo.guardar(config);

            const motor = new MotorAmuleto(mockRepo);

            // Generar múltiples apuestas para la misma fecha
            const apuesta1 = await motor.generarApuestaParaFecha(fecha);
            const apuesta2 = await motor.generarApuestaParaFecha(fecha);
            const apuesta3 = await motor.generarApuestaParaFecha(fecha);

            expect(apuesta1).toEqual(apuesta2);
            expect(apuesta2).toEqual(apuesta3);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Propiedad 6: Variación entre días diferentes
   * **Valida: Requisito 3.6**
   *
   * Para cualquier configuración de usuario, generar apuestas en días diferentes
   * debe producir combinaciones diferentes
   */
  describe('Propiedad 6: Variación entre días diferentes', () => {
    it('genera apuestas diferentes para fechas diferentes', async () => {
      await fc.assert(
        fc.asyncProperty(
          generadorConfiguracion,
          fc.date({ min: new Date('2020-01-01'), max: new Date('2029-12-31') }),
          fc.date({ min: new Date('2020-01-01'), max: new Date('2029-12-31') }),
          async (config, fecha1, fecha2) => {
            // Asegurar que las fechas son diferentes (al menos un día de diferencia)
            if (fecha1.toISOString().split('T')[0] === fecha2.toISOString().split('T')[0]) {
              return; // Skip si son el mismo día
            }

            const mockRepo = new MockConfiguracionUsuario();
            await mockRepo.guardar(config);

            const motor = new MotorAmuleto(mockRepo);

            const apuesta1 = await motor.generarApuestaParaFecha(fecha1);
            const apuesta2 = await motor.generarApuestaParaFecha(fecha2);

            // Las apuestas deben ser diferentes
            expect(apuesta1).not.toEqual(apuesta2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('genera apuestas diferentes para días consecutivos', async () => {
      await fc.assert(
        fc.asyncProperty(
          generadorConfiguracion,
          fc.date({ min: new Date('2020-01-01'), max: new Date('2029-12-30') }),
          async (config, fecha) => {
            const mockRepo = new MockConfiguracionUsuario();
            await mockRepo.guardar(config);

            const motor = new MotorAmuleto(mockRepo);

            // Día actual y día siguiente
            const fechaSiguiente = new Date(fecha);
            fechaSiguiente.setDate(fechaSiguiente.getDate() + 1);

            const apuestaHoy = await motor.generarApuestaParaFecha(fecha);
            const apuestaMañana = await motor.generarApuestaParaFecha(fechaSiguiente);

            expect(apuestaHoy).not.toEqual(apuestaMañana);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Propiedad 7: Apuestas del Motor Amuleto son válidas
   * **Valida: Requisitos 3.7, 11.1, 11.2, 11.3**
   *
   * Para cualquier configuración de usuario, la apuesta generada
   * debe pasar todas las validaciones (6 números únicos, rango 1-49, ordenados)
   */
  describe('Propiedad 7: Apuestas del Motor Amuleto son válidas', () => {
    it('genera apuestas válidas para cualquier configuración', async () => {
      await fc.assert(
        fc.asyncProperty(generadorConfiguracion, async (config) => {
          const mockRepo = new MockConfiguracionUsuario();
          await mockRepo.guardar(config);

          const motor = new MotorAmuleto(mockRepo);

          const apuesta = await motor.generarApuesta();

          // Validar que cumple todas las reglas
          expect(() => validador.validar(apuesta)).not.toThrow();

          // Verificar propiedades específicas
          expect(apuesta).toHaveLength(6);
          expect(new Set(apuesta).size).toBe(6); // Sin duplicados
          expect(apuesta.every((n) => n >= 1 && n <= 49)).toBe(true);
          expect(apuesta.every((n) => Number.isInteger(n))).toBe(true);
          expect(validador.estaOrdenada(apuesta)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('genera apuestas válidas para todas las combinaciones de signos y colores', async () => {
      await fc.assert(
        fc.asyncProperty(
          generadorSignoZodiacal,
          generadorColor,
          generadorEquipo,
          async (signo, color, equipo) => {
            const config: ConfiguracionUsuario = {
              signoZodiacal: signo,
              colorFavorito: color,
              equipoFutbol: equipo,
              fechaConfiguracion: new Date(),
            };

            const mockRepo = new MockConfiguracionUsuario();
            await mockRepo.guardar(config);

            const motor = new MotorAmuleto(mockRepo);

            const apuesta = await motor.generarApuesta();

            expect(() => validador.validar(apuesta)).not.toThrow();
            expect(apuesta).toHaveLength(6);
            expect(new Set(apuesta).size).toBe(6);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Propiedades adicionales del Motor Amuleto', () => {
    it('configuraciones diferentes producen apuestas diferentes (mismo día)', async () => {
      await fc.assert(
        fc.asyncProperty(
          generadorConfiguracion,
          generadorConfiguracion,
          async (config1, config2) => {
            // Asegurar que las configuraciones son diferentes
            if (
              config1.signoZodiacal === config2.signoZodiacal &&
              config1.colorFavorito === config2.colorFavorito &&
              config1.equipoFutbol === config2.equipoFutbol
            ) {
              return; // Skip si son iguales
            }

            const mockRepo1 = new MockConfiguracionUsuario();
            await mockRepo1.guardar(config1);
            const motor1 = new MotorAmuleto(mockRepo1);

            const mockRepo2 = new MockConfiguracionUsuario();
            await mockRepo2.guardar(config2);
            const motor2 = new MotorAmuleto(mockRepo2);

            const apuesta1 = await motor1.generarApuesta();
            const apuesta2 = await motor2.generarApuesta();

            // Configuraciones diferentes deben producir apuestas diferentes
            expect(apuesta1).not.toEqual(apuesta2);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
