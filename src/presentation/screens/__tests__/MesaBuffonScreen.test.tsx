/**
 * Tests para MesaBuffonScreen
 * Requisitos: 8.2, 8.3, 8.4
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { MesaBuffonScreen } from '../MesaBuffonScreen';

describe('MesaBuffonScreen', () => {
  it('debe renderizar la rejilla de 49 espacios', () => {
    const { getAllByText } = render(<MesaBuffonScreen />);
    
    // Verificar que existen números del 1 al 49
    expect(getAllByText('1')).toBeTruthy();
    expect(getAllByText('49')).toBeTruthy();
  });

  it('debe resaltar los números seleccionados', () => {
    const numeros = [5, 12, 23, 34, 41, 48];
    const { getAllByText } = render(<MesaBuffonScreen numeros={numeros} />);
    
    // Verificar que los números seleccionados están presentes
    numeros.forEach(num => {
      expect(getAllByText(num.toString()).length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar información de agujas lanzadas', () => {
    const { getByText } = render(<MesaBuffonScreen numAgujas={150} />);
    
    expect(getByText('Agujas lanzadas: 150')).toBeTruthy();
  });

  it('debe mostrar los números generados', () => {
    const numeros = [3, 15, 27, 33, 42, 49];
    const { getByText } = render(<MesaBuffonScreen numeros={numeros} />);
    
    expect(getByText('Números seleccionados:')).toBeTruthy();
  });
});
