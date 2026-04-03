/**
 * Unit tests para MotorBuffon
 * Requisitos: 2.3, 2.4, 2.5
 */

import { MotorBuffon } from '../MotorBuffon';
import { IAcelerometroService, DatosAceleracion } from '../../interfaces';

// Mock del servicio de acelerómetro
class MockAcelerometroService implements IAcelerometroService {
  constructor(private mockDatos: DatosAceleracion) {}

  async obtenerAceleracion(): Promise<DatosAceleracion> {
    return this.mockDatos;
  }
}

describe('MotorBuffon', () => {
  let motor: MotorBuffon;
  let mockService: MockAcelerometroService;

  beforeEach(() => {
    const aceleracionDefault: DatosAceleracion = {
      x: 10,
      y: 10,
      z: 10,
      timestamp: Date.now(),
    };
    mockService = new MockAcelerometroService(aceleracionDefault);
    motor = new MotorBuffon(mockService);
  });

  describe('propiedades básicas', () => {
    it('tiene nombre correcto', () => {
      expect(motor.nombre).toBe('Motor Buffon');
    });

    it('no requiere configuración', () => {
      expect(motor.requiereConfiguracion).toBe(false);
    });

    it('tiene configuración correcta de rejilla', () => {
      const config = motor.getConfiguracion();

      expect(config.longitudAguja).toBe(1.0);
      expect(config.separacionLineas).toBe(2.0);
      expect(config.tamanoRejilla).toBe(7);
    });
  });

  describe('calcularNumeroAgujas() - Requisito 2.2', () => {
    it('calcula número de agujas basado en magnitud de aceleración', () => {
      const aceleracionBaja = { x: 0, y: 0, z: 9.81 };
      const numAgujasBaja = motor['calcularNumeroAgujas'](aceleracionBaja);

      const aceleracionAlta = { x: 20, y: 20, z: 20 };
      const numAgujasAlta = motor['calcularNumeroAgujas'](aceleracionAlta);

      expect(numAgujasAlta).toBeGreaterThan(numAgujasBaja);
    });

    it('retorna al menos 100 agujas', () => {
      const aceleracionMinima = { x: 0, y: 0, z: 0 };
      const numAgujas = motor['calcularNumeroAgujas'](aceleracionMinima);

      expect(numAgujas).toBeGreaterThanOrEqual(100);
    });

    it('retorna máximo 1000 agujas', () => {
      const aceleracionMaxima = { x: 100, y: 100, z: 100 };
      const numAgujas = motor['calcularNumeroAgujas'](aceleracionMaxima);

      expect(numAgujas).toBeLessThanOrEqual(1000);
    });

    it('retorna valores consistentes para misma aceleración', () => {
      const aceleracion = { x: 15, y: 15, z: 15 };
      const numAgujas1 = motor['calcularNumeroAgujas'](aceleracion);
      const numAgujas2 = motor['calcularNumeroAgujas'](aceleracion);

      expect(numAgujas1).toBe(numAgujas2);
    });
  });

  describe('simularLanzamientos() - Requisito 2.3', () => {
    it('genera el número correcto de agujas', () => {
      const numAgujas = 500;
      const agujas = motor['simularLanzamientos'](numAgujas);

      expect(agujas).toHaveLength(numAgujas);
    });

    it('genera agujas con posiciones dentro de la rejilla', () => {
      const agujas = motor['simularLanzamientos'](100);

      for (const aguja of agujas) {
        expect(aguja.x).toBeGreaterThanOrEqual(0);
        expect(aguja.x).toBeLessThanOrEqual(7);
        expect(aguja.y).toBeGreaterThanOrEqual(0);
        expect(aguja.y).toBeLessThanOrEqual(7);
      }
    });

    it('genera agujas con ángulos válidos (0 a π)', () => {
      const agujas = motor['simularLanzamientos'](100);

      for (const aguja of agujas) {
        expect(aguja.angulo).toBeGreaterThanOrEqual(0);
        expect(aguja.angulo).toBeLessThanOrEqual(Math.PI);
      }
    });

    it('genera agujas con propiedades correctas', () => {
      const agujas = motor['simularLanzamientos'](10);

      for (const aguja of agujas) {
        expect(aguja.longitudAguja).toBe(1.0);
        expect(aguja.separacionLineas).toBe(2.0);
      }
    });

    it('genera agujas con posiciones diferentes', () => {
      const agujas = motor['simularLanzamientos'](50);

      const posiciones = new Set(agujas.map((a) => `${a.x},${a.y}`));

      // Debe haber al menos algunas posiciones diferentes
      expect(posiciones.size).toBeGreaterThan(1);
    });
  });

  describe('calcularIntersecciones() - Requisito 2.4', () => {
    it('inicializa todos los espacios (0-48)', () => {
      const agujas = motor['simularLanzamientos'](100);
      const intersecciones = motor['calcularIntersecciones'](agujas);

      expect(intersecciones.size).toBe(49);

      for (let i = 0; i < 49; i++) {
        expect(intersecciones.has(i)).toBe(true);
      }
    });

    it('acumula precisión para espacios con agujas', () => {
      const agujas = motor['simularLanzamientos'](500);
      const intersecciones = motor['calcularIntersecciones'](agujas);

      // Debe haber al menos algunos espacios con precisión > 0
      const espaciosConPrecision = Array.from(intersecciones.values()).filter((p) => p > 0);

      expect(espaciosConPrecision.length).toBeGreaterThan(0);
    });

    it('ignora agujas fuera de la rejilla', () => {
      const agujasFuera = [
        {
          x: -1,
          y: 3,
          angulo: 0,
          longitudAguja: 1.0,
          separacionLineas: 2.0,
        },
        {
          x: 3,
          y: 10,
          angulo: 0,
          longitudAguja: 1.0,
          separacionLineas: 2.0,
        },
      ];

      const intersecciones = motor['calcularIntersecciones'](agujasFuera);

      // Todos los espacios deben tener precisión 0
      const todasCero = Array.from(intersecciones.values()).every((p) => p === 0);
      expect(todasCero).toBe(true);
    });

    it('mapea correctamente posiciones a espacios', () => {
      const agujas = [
        {
          x: 0.5,
          y: 0.5,
          angulo: 0,
          longitudAguja: 1.0,
          separacionLineas: 2.0,
        }, // Espacio 0
        {
          x: 6.5,
          y: 6.5,
          angulo: 0,
          longitudAguja: 1.0,
          separacionLineas: 2.0,
        }, // Espacio 48
      ];

      const intersecciones = motor['calcularIntersecciones'](agujas);

      expect(intersecciones.get(0)).toBeGreaterThan(0);
      expect(intersecciones.get(48)).toBeGreaterThan(0);
    });
  });

  describe('calcularPrecisionInterseccion() - Requisito 2.5', () => {
    it('retorna mayor precisión para agujas cerca de líneas', () => {
      // Aguja muy cerca de una línea horizontal (y=1)
      const precisionCerca = motor['calcularPrecisionInterseccion'](0.5, 1.01, 1.5, 1.01);

      // Aguja lejos de líneas
      const precisionLejos = motor['calcularPrecisionInterseccion'](0.5, 0.5, 1.5, 0.5);

      expect(precisionCerca).toBeGreaterThan(precisionLejos);
    });

    it('nunca retorna infinito (maneja división por cero)', () => {
      // Aguja exactamente sobre una línea
      const precision = motor['calcularPrecisionInterseccion'](0, 1, 1, 1);

      expect(precision).toBeDefined();
      expect(isFinite(precision)).toBe(true);
    });

    it('retorna valores positivos', () => {
      const precision = motor['calcularPrecisionInterseccion'](0.5, 0.5, 1.5, 1.5);

      expect(precision).toBeGreaterThan(0);
    });
  });

  describe('seleccionarMejoresIntersecciones() - Requisito 2.5', () => {
    it('selecciona exactamente 6 espacios', () => {
      const intersecciones = new Map<number, number>();
      for (let i = 0; i < 49; i++) {
        intersecciones.set(i, Math.random() * 100);
      }

      const seleccionados = motor['seleccionarMejoresIntersecciones'](intersecciones, 6);

      expect(seleccionados).toHaveLength(6);
    });

    it('selecciona espacios con mayor precisión', () => {
      const intersecciones = new Map<number, number>();
      for (let i = 0; i < 49; i++) {
        intersecciones.set(i, i); // Precisión = número del espacio
      }

      const seleccionados = motor['seleccionarMejoresIntersecciones'](intersecciones, 6);

      // Los 6 espacios con mayor precisión son 48, 47, 46, 45, 44, 43
      expect(seleccionados).toContain(48);
      expect(seleccionados).toContain(47);
      expect(seleccionados).toContain(46);
    });

    it('retorna espacios únicos', () => {
      const intersecciones = new Map<number, number>();
      for (let i = 0; i < 49; i++) {
        intersecciones.set(i, 100); // Todos con misma precisión
      }

      const seleccionados = motor['seleccionarMejoresIntersecciones'](intersecciones, 6);

      const unicos = new Set(seleccionados);
      expect(unicos.size).toBe(6);
    });

    it('completa con espacios aleatorios si no hay suficientes', () => {
      const intersecciones = new Map<number, number>();
      for (let i = 0; i < 49; i++) {
        intersecciones.set(i, 0); // Todos con precisión 0
      }

      const seleccionados = motor['seleccionarMejoresIntersecciones'](intersecciones, 6);

      expect(seleccionados).toHaveLength(6);
      expect(new Set(seleccionados).size).toBe(6);
    });
  });

  describe('generarApuesta() - Integración', () => {
    it('genera apuesta con diferentes niveles de aceleración', async () => {
      const aceleraciones = [
        { x: 0, y: 0, z: 9.81, timestamp: Date.now() },
        { x: 15, y: 15, z: 15, timestamp: Date.now() },
        { x: 30, y: 30, z: 30, timestamp: Date.now() },
      ];

      for (const aceleracion of aceleraciones) {
        const service = new MockAcelerometroService(aceleracion);
        const motorTest = new MotorBuffon(service);

        const apuesta = await motorTest.generarApuesta();

        expect(apuesta).toHaveLength(6);
        expect(new Set(apuesta).size).toBe(6);
        expect(apuesta.every((n) => n >= 1 && n <= 49)).toBe(true);
      }
    });

    it('convierte espacios a números correctamente (1-49)', async () => {
      const apuesta = await motor.generarApuesta();

      // Todos los números deben estar en rango 1-49
      expect(apuesta.every((n) => n >= 1 && n <= 49)).toBe(true);
    });

    it('retorna números ordenados', async () => {
      const apuesta = await motor.generarApuesta();

      for (let i = 0; i < apuesta.length - 1; i++) {
        expect(apuesta[i]).toBeLessThan(apuesta[i + 1]);
      }
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
});
