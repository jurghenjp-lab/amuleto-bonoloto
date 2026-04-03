/**
 * Coordinador de Motores - Orquesta la generación de múltiples columnas
 * Requisitos: 4.1, 4.2, 4.3, 4.4
 */

import { IGeneradorApuestas } from '../../domain/interfaces';
import { ValidadorApuestas } from '../../domain/validators';
import { Apuesta } from '../../types';

export class CoordinadorMotores {
  private motores: Map<string, IGeneradorApuestas>;
  private validador: ValidadorApuestas;

  constructor(motores: IGeneradorApuestas[]) {
    this.motores = new Map();
    this.validador = new ValidadorApuestas();

    // Registrar motores por nombre
    for (const motor of motores) {
      this.motores.set(motor.nombre, motor);
    }
  }

  /**
   * Genera múltiples columnas de apuestas
   * Requisitos: 4.1, 4.2, 4.3, 4.4
   */
  async generarColumnas(
    numeroColumnas: number,
    configuracionMotores: string[]
  ): Promise<Apuesta[]> {
    // Validar número de columnas (Requisito 4.1)
    if (numeroColumnas < 1 || numeroColumnas > 8) {
      throw new Error('Número de columnas debe estar entre 1 y 8');
    }

    // Validar que se especifica un motor para cada columna (Requisito 4.3)
    if (configuracionMotores.length !== numeroColumnas) {
      throw new Error('Debe especificar un motor para cada columna');
    }

    const apuestas: Apuesta[] = [];
    const combinacionesGeneradas = new Set<string>();

    // Generar cada columna (Requisito 4.2)
    for (let i = 0; i < numeroColumnas; i++) {
      const nombreMotor = configuracionMotores[i];
      const motor = this.motores.get(nombreMotor);

      if (!motor) {
        throw new Error(`Motor desconocido: ${nombreMotor}`);
      }

      // Generar apuesta única (Requisito 4.4)
      let numeros: number[];
      let intentos = 0;
      const maxIntentos = 100;

      do {
        numeros = await motor.generarApuesta();
        intentos++;

        if (intentos >= maxIntentos) {
          throw new Error('No se pudo generar una combinación única después de 100 intentos');
        }
      } while (combinacionesGeneradas.has(numeros.join(',')));

      // Validar apuesta
      this.validador.validar(numeros);

      // Registrar combinación
      combinacionesGeneradas.add(numeros.join(','));

      // Crear apuesta
      apuestas.push({
        numeros,
        motor: nombreMotor,
        fechaGeneracion: new Date(),
      });
    }

    return apuestas;
  }

  /**
   * Obtiene la lista de motores disponibles
   */
  getMotoresDisponibles(): string[] {
    return Array.from(this.motores.keys());
  }

  /**
   * Verifica si un motor está registrado
   */
  tieneMotor(nombreMotor: string): boolean {
    return this.motores.has(nombreMotor);
  }

  /**
   * Obtiene un motor por nombre
   */
  getMotor(nombreMotor: string): IGeneradorApuestas | undefined {
    return this.motores.get(nombreMotor);
  }

  /**
   * Registra un nuevo motor
   */
  registrarMotor(motor: IGeneradorApuestas): void {
    this.motores.set(motor.nombre, motor);
  }

  /**
   * Elimina un motor registrado
   */
  eliminarMotor(nombreMotor: string): boolean {
    return this.motores.delete(nombreMotor);
  }
}
