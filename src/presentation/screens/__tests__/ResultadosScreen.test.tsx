/**
 * Tests para ResultadosScreen
 * Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ResultadosScreen } from '../ResultadosScreen';
import { ResultadoSorteo } from '../../../types';

describe('ResultadosScreen', () => {
  const mockResultado: ResultadoSorteo = {
    fecha: new Date('2024-01-15'),
    combinacionGanadora: [5, 12, 23, 34, 41, 48],
    complementario: 7,
    reintegro: 3,
    premios: {
      categoria1: { acertantes: 0, premio: 0 },
      categoria2: { acertantes: 1, premio: 50000 },
      categoria3: { acertantes: 15, premio: 1500 },
      categoria4: { acertantes: 250, premio: 50 },
      categoria5: { acertantes: 5000, premio: 4 },
      reintegro: { acertantes: 10000, premio: 0.5 },
    },
  };

  it('debe mostrar mensaje de carga cuando no hay resultado', () => {
    const { getByText } = render(<ResultadosScreen />);
    
    expect(getByText('Cargando resultados...')).toBeTruthy();
  });

  it('debe mostrar mensaje de error cuando hay un error', () => {
    const { getByText } = render(<ResultadosScreen error="Error de conexión" />);
    
    expect(getByText(/Error de conexión/)).toBeTruthy();
  });

  it('debe renderizar la combinación ganadora', () => {
    const { getByText } = render(<ResultadosScreen resultado={mockResultado} />);
    
    expect(getByText('Combinación Ganadora')).toBeTruthy();
    mockResultado.combinacionGanadora.forEach(num => {
      expect(getByText(num.toString())).toBeTruthy();
    });
  });

  it('debe renderizar el complementario y reintegro', () => {
    const { getByText, getAllByText } = render(<ResultadosScreen resultado={mockResultado} />);
    
    expect(getByText('Complementario')).toBeTruthy();
    expect(getByText('7')).toBeTruthy();
    expect(getAllByText('Reintegro').length).toBeGreaterThan(0);
    expect(getByText('3')).toBeTruthy();
  });

  it('debe renderizar la distribución de premios', () => {
    const { getByText } = render(<ResultadosScreen resultado={mockResultado} />);
    
    expect(getByText('Distribución de Premios')).toBeTruthy();
    expect(getByText(/1ª Categoría/)).toBeTruthy();
    expect(getByText(/2ª Categoría/)).toBeTruthy();
    expect(getByText(/50000.00 €/)).toBeTruthy();
  });
});
