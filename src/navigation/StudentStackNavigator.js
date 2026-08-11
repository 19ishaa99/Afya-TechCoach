import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StudentTabNavigator from './StudentTabNavigator';
import ScenarioIntroScreen from '../screens/student/ScenarioIntroScreen';
import PatientScenarioScreen from '../screens/student/PatientScenarioScreen';
import HistoryScreen from '../screens/student/HistoryScreen';
import ExaminationScreen from '../screens/student/ExaminationScreen';
import InitialDiagnosisScreen from '../screens/student/InitialDiagnosisScreen';
import DifferentialDiagnosisScreen from '../screens/student/DifferentialDiagnosisScreen';
import InvestigationScreen from '../screens/student/InvestigationScreen';
import InvestigationResultsScreen from '../screens/student/InvestigationResultsScreen';
import FinalDiagnosisScreen from '../screens/student/FinalDiagnosisScreen';
import ClinicalFeedbackScreen from '../screens/student/ClinicalFeedbackScreen';

const Stack = createStackNavigator();

const StudentStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      <Stack.Screen name="ScenarioIntro" component={ScenarioIntroScreen} />
      <Stack.Screen name="PatientScenario" component={PatientScenarioScreen} />
      <Stack.Screen name="HistoryStage" component={HistoryScreen} />
      <Stack.Screen name="Examination" component={ExaminationScreen} />
      <Stack.Screen name="InitialDiagnosis" component={InitialDiagnosisScreen} />
      <Stack.Screen name="DifferentialDiagnosis" component={DifferentialDiagnosisScreen} />
      <Stack.Screen name="Investigation" component={InvestigationScreen} />
      <Stack.Screen name="InvestigationResults" component={InvestigationResultsScreen} />
      <Stack.Screen name="FinalDiagnosis" component={FinalDiagnosisScreen} />
      <Stack.Screen name="ClinicalFeedback" component={ClinicalFeedbackScreen} />
    </Stack.Navigator>
  );
};

export default StudentStackNavigator;
