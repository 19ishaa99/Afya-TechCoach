import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';

const normalize = value => value.trim().toLowerCase().replace(/[.,;!]/g, '');

const FinalDiagnosisScreen = ({ navigation }) => {
  const {
    finalDiagnosis,
    setFinalDiagnosis,
    finalReasoning,
    setFinalReasoning,
    selectedCase,
    setSimulationEndTime,
    addCompletedSimulation,
    historySectionsViewed,
    examinationsRequested,
    selectedInvestigations,
    investigationInterpretation,
    initialReasoning,
    differentialDiagnoses
  } = useSimulation();

  if (!selectedCase) {
    return null;
  }

  const handleSubmit = () => {
    if (!finalDiagnosis.trim()) {
      Alert.alert('Enter your final diagnosis', 'Please provide the diagnosis you think is most likely.');
      return;
    }
    if (!finalReasoning.trim()) {
      Alert.alert('Explain your reasoning', 'Please describe the clinical reasoning for your final diagnosis.');
      return;
    }
    setSimulationEndTime(Date.now());

    // Evaluate and store completed simulation
    try {
      const evalUtils = require('../../utils/evaluationUtils');
      const {
        evaluateDiagnosis,
        evaluateDifferential,
        evaluateInvestigations,
        evaluateReasoning,
        evaluateHistory,
        evaluateExamination,
        calculateOverallScore,
        generateFeedback
      } = evalUtils;

      const scores = {};
      scores.diagnosis = evaluateDiagnosis(finalDiagnosis, selectedCase.acceptedDiagnoses);
      scores.differential = evaluateDifferential(differentialDiagnoses.map(d => d.value), selectedCase.evaluation?.expectedDifferentials || []);
      scores.investigations = evaluateInvestigations(selectedInvestigations, selectedCase.evaluation || {});
      scores.reasoning = evaluateReasoning(finalReasoning || initialReasoning, selectedCase.clinicalReasoning || {});
      scores.history = evaluateHistory(historySectionsViewed, selectedCase.evaluation || {});
      scores.examination = evaluateExamination(examinationsRequested, selectedCase.evaluation || {});

      const overall = calculateOverallScore(scores);
      const feedback = generateFeedback({ scores, overall, case: selectedCase });

      const completed = {
        simulationId: selectedCase.id,
        caseTitle: selectedCase.title,
        completedAt: Date.now(),
        scores,
        overall,
        feedback,
        studentAnswers: {
          finalDiagnosis,
          finalReasoning,
          differentialDiagnoses,
          selectedInvestigations,
          investigationInterpretation
        }
      };

      if (typeof addCompletedSimulation === 'function') {
        addCompletedSimulation(completed);
      }
    } catch (e) {
      // fail silently but continue
    }

    navigation.navigate('ClinicalFeedback');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="final" />
      <Text style={styles.title}>Final Diagnosis</Text>
      <Text style={styles.subtitle}>Summarize the complete clinical picture and explain your decision.</Text>

      <CustomInput
        label="Final diagnosis"
        value={finalDiagnosis}
        onChangeText={setFinalDiagnosis}
        placeholder="Type your final diagnosis here..."
      />
      <CustomInput
        label="Why is this the most likely diagnosis?"
        value={finalReasoning}
        onChangeText={setFinalReasoning}
        placeholder="Explain your clinical reasoning..."
        multiline
        numberOfLines={5}
        style={styles.multiline}
      />

      <PrimaryButton title="Submit Final Diagnosis" onPress={handleSubmit} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { color: COLORS.muted, marginBottom: 18 },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  button: { marginTop: 16 }
});

export default FinalDiagnosisScreen;
