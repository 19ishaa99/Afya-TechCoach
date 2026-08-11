import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SimulationProvider } from './src/context/SimulationContext';

export default function App() {
  return (
    <SimulationProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SimulationProvider>
  );
}
