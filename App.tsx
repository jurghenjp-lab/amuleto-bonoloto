/**
 * App.tsx - Punto de entrada principal de la aplicación
 * Integra navegación, servicios y componentes
 */

import React, { useEffect } from 'react';
import { StatusBar, AppState, BackHandler } from 'react-native';
import { AppNavigator } from './src/navigation';
import { AvisoLegal } from './src/presentation/components';

function App(): React.JSX.Element {
  useEffect(() => {
    // Prevenir que la app se cierre sola
    const handleAppStateChange = (nextState: string) => {
      if (nextState === 'active') {
        console.log('App está activa - evitando cierre automático');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Prevenir cierre con botón atrás
    const backAction = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('Botón atrás presionado - evitando cierre');
      return true; // Prevenir cierre
    });

    return () => {
      subscription?.remove();
      backAction?.remove();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E14" />
      <AppNavigator />
      <AvisoLegal />
    </>
  );
}

export default App;
