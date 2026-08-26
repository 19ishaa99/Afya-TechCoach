import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import { SimulationProvider } from './src/context/SimulationContext';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <NavigationContainer linking={linking}>
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
      AuthStack: {
        screens: {
          Splash: '',
          Welcome: 'welcome',
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password'
        }
      },

      StudentStack: {
        screens: {
          StudentTabs: {
            screens: {
              StudentDashboard: 'dashboard',
              SimulationList: 'cases',
              Progress: 'progress',
              History: 'history',
              Profile: 'profile'
            }
          },

          ScenarioIntro: 'cases/:caseId',
          PatientScenario: 'simulations/:simulationId/presentation',
          HistoryStage: 'simulations/:simulationId/history',
          Examination: 'simulations/:simulationId/examination',
          InitialDiagnosis: 'simulations/:simulationId/diagnosis',
          DifferentialDiagnosis: 'simulations/:simulationId/differential',
          Investigation: 'simulations/:simulationId/investigations',
          InvestigationResults: 'simulations/:simulationId/results',
          FinalDiagnosis: 'simulations/:simulationId/final',
          ReviewAnswers: 'simulations/:simulationId/review',
          ClinicalFeedback: 'simulations/:simulationId/feedback'
        }
      }
    }
  }
};