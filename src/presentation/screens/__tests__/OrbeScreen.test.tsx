/**
 * Tests para OrbeScreen
 * Requisitos: 7.1, 7.2, 7.4
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OrbeScreen } from '../OrbeScreen';

describe('OrbeScreen', () => {
  it('debe renderizar el orbe', () => {
    const { getByTestId } = render(<OrbeScreen />);
    
    expect(getByTestId('orbe-button')).toBeTruthy();
  });

  it('debe mostrar el selector al presionar el orbe', () => {
    const { getByTestId, queryByTestId } = render(<OrbeScreen />);
    
    // Inicialmente no debe estar visible
    expect(queryByTestId('selector-container')).toBeNull();
    
    // Presionar el orbe
    fireEvent.press(getByTestId('orbe-button'));
    
    // Ahora debe estar visible
    expect(getByTestId('selector-container')).toBeTruthy();
  });

  it('debe permitir seleccionar número de columnas (1-8)', () => {
    const { getByTestId } = render(<OrbeScreen />);
    
    fireEvent.press(getByTestId('orbe-button'));
    
    // Verificar que existen botones para 1-8 columnas
    for (let i = 1; i <= 8; i++) {
      expect(getByTestId(`columna-${i}`)).toBeTruthy();
    }
  });

  it('debe permitir seleccionar motor para cada columna', () => {
    const { getByTestId } = render(<OrbeScreen />);
    
    fireEvent.press(getByTestId('orbe-button'));
    
    // Seleccionar 2 columnas
    fireEvent.press(getByTestId('columna-2'));
    
    // Verificar que existen selectores de motor para ambas columnas
    expect(getByTestId('motor-0-Motor Histórico')).toBeTruthy();
    expect(getByTestId('motor-1-Motor Histórico')).toBeTruthy();
  });

  it('debe llamar onGenerarApuestas con la configuración correcta', () => {
    const mockOnGenerar = jest.fn();
    const { getByTestId } = render(<OrbeScreen onGenerarApuestas={mockOnGenerar} />);
    
    fireEvent.press(getByTestId('orbe-button'));
    
    // Seleccionar 3 columnas
    fireEvent.press(getByTestId('columna-3'));
    
    // Generar
    fireEvent.press(getByTestId('generar-button'));
    
    expect(mockOnGenerar).toHaveBeenCalledWith(
      3,
      ['Motor Histórico', 'Motor Histórico', 'Motor Histórico']
    );
  });
});
