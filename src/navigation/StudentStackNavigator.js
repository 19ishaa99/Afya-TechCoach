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
import ReviewAnswersScreen from '../screens/student/ReviewAnswersScreen';
import SimulationHeader from '../components/SimulationHeader';
import { withSimulationRecovery } from '../components/SimulationRouteGate';

const Stack = createStackNavigator();
const PatientScenario = withSimulationRecovery(PatientScenarioScreen);
const HistoryStage = withSimulationRecovery(HistoryScreen);
const ExaminationStage = withSimulationRecovery(ExaminationScreen);
const InitialDiagnosisStage = withSimulationRecovery(InitialDiagnosisScreen);
const DifferentialStage = withSimulationRecovery(DifferentialDiagnosisScreen);
const InvestigationStage = withSimulationRecovery(InvestigationScreen);
const ResultsStage = withSimulationRecovery(InvestigationResultsScreen);
const FinalStage = withSimulationRecovery(FinalDiagnosisScreen);
const ReviewStage = withSimulationRecovery(ReviewAnswersScreen);
const FeedbackStage = withSimulationRecovery(ClinicalFeedbackScreen);

const StudentStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      <Stack.Group screenOptions={{ headerShown: true, header: props => <SimulationHeader {...props} /> }}>
        <Stack.Screen name="ScenarioIntro" component={ScenarioIntroScreen} options={{ title: 'Case Overview' }} />
        <Stack.Screen name="PatientScenario" component={PatientScenario} options={{ title: 'Patient Presentation' }} />
        <Stack.Screen name="HistoryStage" component={HistoryStage} options={{ title: 'History Taking' }} />
        <Stack.Screen name="Examination" component={ExaminationStage} options={{ title: 'Physical Examination' }} />
        <Stack.Screen name="InitialDiagnosis" component={InitialDiagnosisStage} options={{ title: 'Initial Impression' }} />
        <Stack.Screen name="DifferentialDiagnosis" component={DifferentialStage} options={{ title: 'Differential Diagnosis' }} />
        <Stack.Screen name="Investigation" component={InvestigationStage} options={{ title: 'Investigations' }} />
        <Stack.Screen name="InvestigationResults" component={ResultsStage} options={{ title: 'Interpret Results' }} />
        <Stack.Screen name="FinalDiagnosis" component={FinalStage} options={{ title: 'Final Diagnosis' }} />
        <Stack.Screen name="ReviewAnswers" component={ReviewStage} options={{ title: 'Review Answers' }} />
        <Stack.Screen name="ClinicalFeedback" component={FeedbackStage} options={{ title: 'Clinical Feedback' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StudentStackNavigator;
