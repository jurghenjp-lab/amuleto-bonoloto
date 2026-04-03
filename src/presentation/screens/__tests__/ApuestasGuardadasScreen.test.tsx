/**
 * Tests para ApuestasGuardadasScreen
 * Requisitos: 6.3, 6.4
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApuestasGuardadasScreen } from '../ApuestasGuardadasScreen';
import { Apuesta } from '../../../types';

describe('ApuestasGuardadasScreen', () => {
  const mockApuestas: Apuesta[] = [
    {
      id: '1',
      numeros: [5, 12, 23, 34, 41, 48],
      motor: 'Motor Histórico',
      fechaGeneracion: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      numeros: [3, 15, 27, 33, 42, 49],
      motor: 'Motor Buffon',
      fechaGeneracion: new Date('2024-01-14T15:45:00'),
    },
  ];

  it('debe mostrar mensaje cuando no hay apuestas', () => {
    const { getByText } = render(<ApuestasGuardadasScreen apuestas={[]} />);
    
    expect(getByText('No tienes apuestas guardadas')).toBeTruthy();
  });

  it('debe renderizar la lista de apuestas', () => {
    const { getByText } = render(<ApuestasGuardadasScreen apuestas={mockApuestas} />);
    
    expect(getByText('Apuestas Guardadas')).toBeTruthy();
    expect(getByText('Motor: Motor Histórico')).toBeTruthy();
    expect(getByText('Motor: Motor Buffon')).toBeTruthy();
  });

  it('debe mostrar los números de cada apuesta', () => {
    const { getByText } = render(<ApuestasGuardadasScreen apuestas={mockApuestas} />);
    
    // Verificar números de la primera apuesta
    mockApuestas[0].numeros.forEach(num => {
      expect(getByText(num.toString())).toBeTruthy();
    });
  });

  it('debe llamar onEliminar cuando se presiona el botón de eliminar', () => {
    const mockOnEliminar = jest.fn();
    const { getAllByText } = render(
      <ApuestasGuardadasScreen apuestas={mockApuestas} onEliminar={mockOnEliminar} />
    );
    
    const eliminarButtons = getAllByText('🗑️');
    fireEvent.press(eliminarButtons[0]);
    
    expect(mockOnEliminar).toHaveBeenCalledWith('1');
  });
});
