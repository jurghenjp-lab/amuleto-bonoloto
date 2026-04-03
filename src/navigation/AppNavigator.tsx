/**
 * AppNavigator - Configuración de navegación principal
 * Requisitos: Todos los requisitos de UI
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  OrbeScreen,
  MesaBuffonScreen,
  AltarDatosScreen,
  ResultadosScreen,
  ApuestasGuardadasScreen,
} from '../presentation/screens';

export type RootStackParamList = {
  Orbe: undefined;
  MesaBuffon: { numeros?: number[]; numAgujas?: number };
  AltarDatos: undefined;
  Resultados: undefined;
  ApuestasGuardadas: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Orbe"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0B0E14',
          },
          headerTintColor: '#D4AF37',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Orbe"
          component={OrbeScreen}
          options={{ title: 'Amuleto Bonoloto' }}
        />
        <Stack.Screen
          name="MesaBuffon"
          component={MesaBuffonScreen}
          options={{ title: 'Mesa de Buffon' }}
        />
        <Stack.Screen
          name="AltarDatos"
          component={AltarDatosScreen}
          options={{ title: 'Altar de Datos' }}
        />
        <Stack.Screen
          name="Resultados"
          component={ResultadosScreen}
          options={{ title: 'Resultados Oficiales' }}
        />
        <Stack.Screen
          name="ApuestasGuardadas"
          component={ApuestasGuardadasScreen}
          options={{ title: 'Apuestas Guardadas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
