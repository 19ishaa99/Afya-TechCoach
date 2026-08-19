import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SimulationProvider } from './src/context/SimulationContext';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  const [initialState, setInitialState] = useState(undefined);
  const [navigationReady, setNavigationReady] = useState(Platform.OS === 'web');
  useEffect(() => {
    if (Platform.OS === 'web') return;
    AsyncStorage.getItem('afya_navigation_state_v1')
      .then(value => { if (value) setInitialState(JSON.parse(value)); })
      .catch(() => AsyncStorage.removeItem('afya_navigation_state_v1'))
      .finally(() => setNavigationReady(true));
  }, []);
  if (!navigationReady) return null;
  return (
    <AuthProvider>
      <SimulationProvider>
        <NavigationContainer
          linking={linking}
          initialState={initialState}
          onStateChange={state => { if (Platform.OS !== 'web') AsyncStorage.setItem('afya_navigation_state_v1', JSON.stringify(state)); }}
        >
          <AppNavigator />
        </NavigationContainer>
      </SimulationProvider>
    </AuthProvider>
  );
}

const linking = {
  prefixes: [],
  config: {
    screens: {
      AuthStack: { screens: { Splash: '', Welcome: 'welcome', Login: 'login', Register: 'register', ForgotPassword: 'forgot-password' } },
      StudentStack: { screens: {
        StudentTabs: { screens: { StudentDashboard: 'dashboard', SimulationList: 'cases', Progress: 'progress', History: 'history', Profile: 'profile' } },
        ScenarioIntro: 'cases/:caseId', PatientScenario: 'simulations/:simulationId/presentation',
        HistoryStage: 'simulations/:simulationId/history', Examination: 'simulations/:simulationId/examination',
        InitialDiagnosis: 'simulations/:simulationId/diagnosis', DifferentialDiagnosis: 'simulations/:simulationId/differential',
        Investigation: 'simulations/:simulationId/investigations', InvestigationResults: 'simulations/:simulationId/results',
        FinalDiagnosis: 'simulations/:simulationId/final', ReviewAnswers: 'simulations/:simulationId/review',
        ClinicalFeedback: 'simulations/:simulationId/feedback'
      } }
    }
  }
};
