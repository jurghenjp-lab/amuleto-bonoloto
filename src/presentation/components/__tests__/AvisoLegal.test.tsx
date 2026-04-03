/**
 * Tests para AvisoLegal
 * Requisitos: 10.1, 10.2
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AvisoLegal } from '../AvisoLegal';

describe('AvisoLegal', () => {
  it('debe renderizar el disclaimer en el footer', () => {
    const { getByText } = render(<AvisoLegal />);
    
    expect(getByText(/Esta aplicación genera números aleatorios/)).toBeTruthy();
    expect(getByText(/Ver aviso legal completo/)).toBeTruthy();
  });

  it('debe mostrar el modal al hacer clic en "Ver aviso legal completo"', () => {
    const { getByText } = render(<AvisoLegal />);
    
    const verMasButton = getByText(/Ver aviso legal completo/);
    fireEvent.press(verMasButton);
    
    expect(getByText('Aviso Legal')).toBeTruthy();
    expect(getByText(/Descargo de Responsabilidad/)).toBeTruthy();
  });

  it('debe llamar onAceptar cuando se acepta el aviso', () => {
    const mockOnAceptar = jest.fn();
    const { getByText } = render(<AvisoLegal onAceptar={mockOnAceptar} />);
    
    const aceptarButton = getByText(/Acepto los términos/);
    fireEvent.press(aceptarButton);
    
    expect(mockOnAceptar).toHaveBeenCalled();
  });
});
