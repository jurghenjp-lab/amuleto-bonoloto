/**
 * Unit tests para CoordinadorMotores
 * Requisitos: 4.1, 4.2, 4.3
 */

import { CoordinadorMotores } from '../CoordinadorMotores';
import { IGeneradorApuestas } from '../../../domain/interfaces';

// Motor mock determinista
class MotorMockDeterminista implements IGeneradorApuestas {
  private contador = 0;

  constructor(public readonly nombre: string) {}

  readonly requiereConfiguracion = false;

  async generarApuesta(): Promise<number[]> {
    // Generar apuesta determinista basada en contador
    const base = (this.contador * 7) % 44;
    this.contador++;

    return [base + 1, base + 2, base + 3, base + 4, base + 5, base + 6];
  }
}

describe('CoordinadorMotores', () => {
  let coordinador: CoordinadorMotores;
  let motor1: IGeneradorApuestas;
  let motor2: IGeneradorApuestas;
  let motor3: IGeneradorApuestas;

  beforeEach(() => {
    motor1 = new MotorMockDeterminista('Motor Histórico');
    motor2 = new MotorMockDeterminista('Motor Buffon');
    motor3 = new MotorMockDeterminista('Motor Amuleto');

    coordinador = new CoordinadorMotores([motor1, motor2, motor3]);
  });

  describe('constructor', () => {
    it('registra todos los motores proporcionados', () => {
      const motoresDisponibles = coordinador.getMotoresDisponibles();

      expect(motoresDisponibles).toContain('Motor Histórico');
      expect(motoresDisponibles).toContain('Motor Buffon');
      expect(motoresDisponibles).toContain('Motor Amuleto');
      expect(motoresDisponibles).toHaveLength(3);
    });

    it('permite crear coordinador sin motores', () => {
      const coordinadorVacio = new CoordinadorMotores([]);

      expect(coordinadorVacio.getMotoresDisponibles()).toHaveLength(0);
    });
  });

  describe('generarColumnas() - Requisito 4.1, 4.2, 4.3', () => {
    it('genera el número correcto de columnas', async () => {
      const apuestas = await coordinador.generarColumnas(3, [
        'Motor Histórico',
        'Motor Buffon',
        'Motor Amuleto',
      ]);

      expect(apuestas).toHaveLength(3);
    });

    it('rechaza número de columnas menor a 1 (Requisito 4.1)', async () => {
      await expect(coordinador.generarColumnas(0, [])).rejects.toThrow(
        'Número de columnas debe estar entre 1 y 8'
      );
    });

    it('rechaza número de columnas mayor a 8 (Requisito 4.1)', async () => {
      await expect(
        coordinador.generarColumnas(9, Array(9).fill('Motor Histórico'))
      ).rejects.toThrow('Número de columnas debe estar entre 1 y 8');
    });

    it('acepta 1 columna', async () => {
      const apuestas = await coordinador.generarColumnas(1, ['Motor Histórico']);

      expect(apuestas).toHaveLength(1);
    });

    it('acepta 8 columnas', async () => {
      const apuestas = await coordinador.generarColumnas(8, Array(8).fill('Motor Histórico'));

      expect(apuestas).toHaveLength(8);
    });

    it('rechaza si no se especifica motor para cada columna (Requisito 4.3)', async () => {
      await expect(
        coordinador.generarColumnas(3, ['Motor Histórico', 'Motor Buffon'])
      ).rejects.toThrow('Debe especificar un motor para cada columna');
    });

    it('rechaza motor desconocido (Requisito 4.3)', async () => {
      await expect(
        coordinador.generarColumnas(2, ['Motor Histórico', 'Motor Inexistente'])
      ).rejects.toThrow('Motor desconocido: Motor Inexistente');
    });

    it('permite usar el mismo motor múltiples veces', async () => {
      const apuestas = await coordinador.generarColumnas(3, [
        'Motor Histórico',
        'Motor Histórico',
        'Motor Histórico',
      ]);

      expect(apuestas).toHaveLength(3);
      expect(apuestas.every((a) => a.motor === 'Motor Histórico')).toBe(true);
    });

    it('permite mezclar diferentes motores', async () => {
      const apuestas = await coordinador.generarColumnas(3, [
        'Motor Histórico',
        'Motor Buffon',
        'Motor Amuleto',
      ]);

      expect(apuestas[0].motor).toBe('Motor Histórico');
      expect(apuestas[1].motor).toBe('Motor Buffon');
      expect(apuestas[2].motor).toBe('Motor Amuleto');
    });

    it('asigna fecha de generación a cada apuesta', async () => {
      const antes = new Date();
      const apuestas = await coordinador.generarColumnas(2, ['Motor Histórico', 'Motor Buffon']);
      const despues = new Date();

      for (const apuesta of apuestas) {
        expect(apuesta.fechaGeneracion).toBeInstanceOf(Date);
        expect(apuesta.fechaGeneracion.getTime()).toBeGreaterThanOrEqual(antes.getTime());
        expect(apuesta.fechaGeneracion.getTime()).toBeLessThanOrEqual(despues.getTime());
      }
    });

    it('genera apuestas válidas (6 números, rango 1-49)', async () => {
      const apuestas = await coordinador.generarColumnas(3, [
        'Motor Histórico',
        'Motor Buffon',
        'Motor Amuleto',
      ]);

      for (const apuesta of apuestas) {
        expect(apuesta.numeros).toHaveLength(6);
        expect(apuesta.numeros.every((n) => n >= 1 && n <= 49)).toBe(true);
        expect(new Set(apuesta.numeros).size).toBe(6);
      }
    });
  });

  describe('getMotoresDisponibles()', () => {
    it('retorna lista de motores registrados', () => {
      const motores = coordinador.getMotoresDisponibles();

      expect(motores).toContain('Motor Histórico');
      expect(motores).toContain('Motor Buffon');
      expect(motores).toContain('Motor Amuleto');
    });

    it('retorna array vacío si no hay motores', () => {
      const coordinadorVacio = new CoordinadorMotores([]);

      expect(coordinadorVacio.getMotoresDisponibles()).toEqual([]);
    });
  });

  describe('tieneMotor()', () => {
    it('retorna true para motor registrado', () => {
      expect(coordinador.tieneMotor('Motor Histórico')).toBe(true);
      expect(coordinador.tieneMotor('Motor Buffon')).toBe(true);
    });

    it('retorna false para motor no registrado', () => {
      expect(coordinador.tieneMotor('Motor Inexistente')).toBe(false);
    });
  });

  describe('getMotor()', () => {
    it('retorna motor registrado', () => {
      const motor = coordinador.getMotor('Motor Histórico');

      expect(motor).toBeDefined();
      expect(motor!.nombre).toBe('Motor Histórico');
    });

    it('retorna undefined para motor no registrado', () => {
      const motor = coordinador.getMotor('Motor Inexistente');

      expect(motor).toBeUndefined();
    });
  });

  describe('registrarMotor()', () => {
    it('permite registrar nuevo motor', () => {
      const nuevoMotor = new MotorMockDeterminista('Motor Nuevo');

      coordinador.registrarMotor(nuevoMotor);

      expect(coordinador.tieneMotor('Motor Nuevo')).toBe(true);
    });

    it('permite sobrescribir motor existente', () => {
      const nuevoMotor = new MotorMockDeterminista('Motor Histórico');

      coordinador.registrarMotor(nuevoMotor);

      expect(coordinador.tieneMotor('Motor Histórico')).toBe(true);
    });
  });

  describe('eliminarMotor()', () => {
    it('elimina motor registrado', () => {
      const eliminado = coordinador.eliminarMotor('Motor Histórico');

      expect(eliminado).toBe(true);
      expect(coordinador.tieneMotor('Motor Histórico')).toBe(false);
    });

    it('retorna false si motor no existe', () => {
      const eliminado = coordinador.eliminarMotor('Motor Inexistente');

      expect(eliminado).toBe(false);
    });
  });

  describe('validación de apuestas', () => {
    it('valida todas las apuestas generadas', async () => {
      const apuestas = await coordinador.generarColumnas(3, [
        'Motor Histórico',
        'Motor Buffon',
        'Motor Amuleto',
      ]);

      // Si llegamos aquí sin error, todas las apuestas fueron validadas
      expect(apuestas).toHaveLength(3);
    });
  });

  describe('unicidad de combinaciones - Requisito 4.4', () => {
    it('genera combinaciones diferentes para cada columna', async () => {
      const apuestas = await coordinador.generarColumnas(5, Array(5).fill('Motor Histórico'));

      const combinaciones = new Set(apuestas.map((a) => a.numeros.join(',')));

      expect(combinaciones.size).toBe(5);
    });

    it('no genera duplicados incluso con muchas columnas', async () => {
      const apuestas = await coordinador.generarColumnas(8, Array(8).fill('Motor Histórico'));

      const combinaciones = new Set(apuestas.map((a) => a.numeros.join(',')));

      expect(combinaciones.size).toBe(8);
    });
  });
});
