/**
 * Unit tests para AcelerometroService
 * Requisitos: 2.1, 2.2
 */

import { AcelerometroService } from '../AcelerometroService';
import { DatosAceleracion } from '../../../domain/interfaces';

describe('AcelerometroService', () => {
  let service: AcelerometroService;

  beforeEach(() => {
    service = new AcelerometroService();
    // Limpiar mock global
    delete (global as any).__mockAcelerometro;
  });

  describe('obtenerAceleracion() - Requisito 2.1', () => {
    it('obtiene datos de aceleración correctamente', async () => {
      const aceleracion = await service.obtenerAceleracion();

      expect(aceleracion).toHaveProperty('x');
      expect(aceleracion).toHaveProperty('y');
      expect(aceleracion).toHaveProperty('z');
      expect(aceleracion).toHaveProperty('timestamp');
      expect(typeof aceleracion.x).toBe('number');
      expect(typeof aceleracion.y).toBe('number');
      expect(typeof aceleracion.z).toBe('number');
      expect(typeof aceleracion.timestamp).toBe('number');
    });

    it('retorna valores por defecto cuando no hay mock', async () => {
      const aceleracion = await service.obtenerAceleracion();

      // Valores por defecto simulan gravedad en reposo
      expect(aceleracion.x).toBe(0);
      expect(aceleracion.y).toBe(0);
      expect(aceleracion.z).toBe(9.81);
    });

    it('usa valores mock cuando están disponibles', async () => {
      (global as any).__mockAcelerometro = {
        x: 5.0,
        y: 3.0,
        z: 12.0,
      };

      const aceleracion = await service.obtenerAceleracion();

      expect(aceleracion.x).toBe(5.0);
      expect(aceleracion.y).toBe(3.0);
      expect(aceleracion.z).toBe(12.0);
    });

    it('incluye timestamp actual', async () => {
      const antes = Date.now();
      const aceleracion = await service.obtenerAceleracion();
      const despues = Date.now();

      expect(aceleracion.timestamp).toBeGreaterThanOrEqual(antes);
      expect(aceleracion.timestamp).toBeLessThanOrEqual(despues);
    });
  });

  describe('calcularMagnitud()', () => {
    it('calcula correctamente la magnitud de la aceleración', () => {
      const datos: DatosAceleracion = {
        x: 3,
        y: 4,
        z: 0,
        timestamp: Date.now(),
      };

      const magnitud = service.calcularMagnitud(datos);

      // sqrt(3² + 4² + 0²) = sqrt(9 + 16) = sqrt(25) = 5
      expect(magnitud).toBe(5);
    });

    it('calcula magnitud para aceleración en reposo', () => {
      const datos: DatosAceleracion = {
        x: 0,
        y: 0,
        z: 9.81,
        timestamp: Date.now(),
      };

      const magnitud = service.calcularMagnitud(datos);

      expect(magnitud).toBeCloseTo(9.81, 2);
    });

    it('calcula magnitud para valores negativos', () => {
      const datos: DatosAceleracion = {
        x: -3,
        y: -4,
        z: 0,
        timestamp: Date.now(),
      };

      const magnitud = service.calcularMagnitud(datos);

      expect(magnitud).toBe(5);
    });

    it('retorna 0 para aceleración nula', () => {
      const datos: DatosAceleracion = {
        x: 0,
        y: 0,
        z: 0,
        timestamp: Date.now(),
      };

      const magnitud = service.calcularMagnitud(datos);

      expect(magnitud).toBe(0);
    });
  });

  describe('detectarMovimientoSignificativo() - Requisito 2.2', () => {
    it('detecta movimiento cuando supera el umbral', () => {
      const datos: DatosAceleracion = {
        x: 10,
        y: 10,
        z: 10,
        timestamp: Date.now(),
      };

      // Magnitud = sqrt(10² + 10² + 10²) = sqrt(300) ≈ 17.32
      const esSignificativo = service.detectarMovimientoSignificativo(datos);

      expect(esSignificativo).toBe(true);
    });

    it('no detecta movimiento cuando está por debajo del umbral', () => {
      const datos: DatosAceleracion = {
        x: 1,
        y: 1,
        z: 1,
        timestamp: Date.now(),
      };

      // Magnitud = sqrt(1² + 1² + 1²) = sqrt(3) ≈ 1.73
      const esSignificativo = service.detectarMovimientoSignificativo(datos);

      expect(esSignificativo).toBe(false);
    });

    it('no detecta movimiento en reposo', () => {
      const datos: DatosAceleracion = {
        x: 0,
        y: 0,
        z: 9.81,
        timestamp: Date.now(),
      };

      const esSignificativo = service.detectarMovimientoSignificativo(datos);

      expect(esSignificativo).toBe(false);
    });

    it('detecta movimiento justo en el umbral', () => {
      // Crear aceleración con magnitud exactamente en el umbral
      const umbral = service.getUmbral();
      const datos: DatosAceleracion = {
        x: umbral,
        y: 0,
        z: 0,
        timestamp: Date.now(),
      };

      const esSignificativo = service.detectarMovimientoSignificativo(datos);

      expect(esSignificativo).toBe(false); // Debe ser > umbral, no >=
    });

    it('detecta movimiento justo por encima del umbral', () => {
      const umbral = service.getUmbral();
      const datos: DatosAceleracion = {
        x: umbral + 0.1,
        y: 0,
        z: 0,
        timestamp: Date.now(),
      };

      const esSignificativo = service.detectarMovimientoSignificativo(datos);

      expect(esSignificativo).toBe(true);
    });
  });

  describe('umbral personalizado', () => {
    it('permite configurar umbral personalizado', () => {
      const umbralPersonalizado = 20.0;
      const servicePersonalizado = new AcelerometroService(umbralPersonalizado);

      expect(servicePersonalizado.getUmbral()).toBe(umbralPersonalizado);
    });

    it('usa umbral personalizado para detección', () => {
      const umbralBajo = 5.0;
      const serviceUmbralBajo = new AcelerometroService(umbralBajo);

      const datos: DatosAceleracion = {
        x: 3,
        y: 4,
        z: 0,
        timestamp: Date.now(),
      };

      // Magnitud = 5, que es igual al umbral
      const esSignificativo = serviceUmbralBajo.detectarMovimientoSignificativo(datos);

      expect(esSignificativo).toBe(false);
    });
  });

  describe('esperarMovimiento()', () => {
    it('retorna cuando detecta movimiento significativo', async () => {
      // Configurar mock con movimiento significativo
      (global as any).__mockAcelerometro = {
        x: 10,
        y: 10,
        z: 10,
      };

      const aceleracion = await service.esperarMovimiento(1000);

      expect(aceleracion.x).toBe(10);
      expect(aceleracion.y).toBe(10);
      expect(aceleracion.z).toBe(10);
    });

    it('lanza error cuando hay timeout sin movimiento', async () => {
      // Configurar mock sin movimiento significativo
      (global as any).__mockAcelerometro = {
        x: 0,
        y: 0,
        z: 9.81,
      };

      await expect(service.esperarMovimiento(500)).rejects.toThrow(
        'Timeout esperando movimiento del dispositivo'
      );
    }, 1000);
  });

  describe('integración con diferentes escenarios', () => {
    it('maneja aceleración en múltiples ejes', async () => {
      (global as any).__mockAcelerometro = {
        x: 5.5,
        y: -3.2,
        z: 12.8,
      };

      const aceleracion = await service.obtenerAceleracion();
      const magnitud = service.calcularMagnitud(aceleracion);

      expect(magnitud).toBeGreaterThan(0);
      expect(aceleracion.x).toBe(5.5);
      expect(aceleracion.y).toBe(-3.2);
      expect(aceleracion.z).toBe(12.8);
    });

    it('maneja valores decimales correctamente', async () => {
      (global as any).__mockAcelerometro = {
        x: 1.23,
        y: 4.56,
        z: 7.89,
      };

      const aceleracion = await service.obtenerAceleracion();

      expect(aceleracion.x).toBe(1.23);
      expect(aceleracion.y).toBe(4.56);
      expect(aceleracion.z).toBe(7.89);
    });
  });
});
