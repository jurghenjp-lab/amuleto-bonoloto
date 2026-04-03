/**
 * App.tsx - Punto de entrada principal de la aplicación
 * Integra navegación, servicios y componentes
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation';
import { AvisoLegal } from './src/presentation/components';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E14" />
      <AppNavigator />
      <AvisoLegal />
    </>
  );
}

export default App;
