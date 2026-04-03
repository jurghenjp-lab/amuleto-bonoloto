/**
 * Tests para AltarDatosScreen
 * Requisitos: 9.1, 9.3
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AltarDatosScreen } from '../AltarDatosScreen';

describe('AltarDatosScreen', () => {
  it('debe renderizar el formulario con todos los campos', () => {
    const { getByText, getByPlaceholderText } = render(<AltarDatosScreen />);
    
    expect(getByText('El Altar de Datos')).toBeTruthy();
    expect(getByText('Signo Zodiacal')).toBeTruthy();
    expect(getByText('Color Favorito')).toBeTruthy();
    expect(getByText('Equipo de Fútbol')).toBeTruthy();
    expect(getByPlaceholderText('Escribe tu equipo favorito')).toBeTruthy();
  });

  it('debe permitir seleccionar un signo zodiacal', () => {
    const { getByText } = render(<AltarDatosScreen />);
    
    const leoButton = getByText('Leo');
    fireEvent.press(leoButton);
    
    expect(leoButton).toBeTruthy();
  });

  it('debe permitir seleccionar un color favorito', () => {
    const { getByText } = render(<AltarDatosScreen />);
    
    const azulButton = getByText('Azul');
    fireEvent.press(azulButton);
    
    expect(azulButton).toBeTruthy();
  });

  it('debe llamar onGuardar con la configuración correcta', () => {
    const mockOnGuardar = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <AltarDatosScreen onGuardar={mockOnGuardar} />
    );
    
    // Seleccionar signo
    fireEvent.press(getByText('Virgo'));
    
    // Seleccionar color
    fireEvent.press(getByText('Verde'));
    
    // Escribir equipo
    const equipoInput = getByPlaceholderText('Escribe tu equipo favorito');
    fireEvent.changeText(equipoInput, 'Real Madrid');
    
    // Guardar
    fireEvent.press(getByText('Guardar Configuración'));
    
    expect(mockOnGuardar).toHaveBeenCalledWith({
      signoZodiacal: 'Virgo',
      colorFavorito: 'Verde',
      equipoFutbol: 'Real Madrid',
    });
  });
});
