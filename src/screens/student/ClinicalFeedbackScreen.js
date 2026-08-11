import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';

const normalize = value => value.trim().toLowerCase().replace(/[.,;!]/g, '');

const ClinicalFeedbackScreen = ({ navigation }) => {
  const {
    selectedCase,
    initialDiagnosis,
    initialReasoning,
    differentialDiagnoses,
    mostLikelyDiagnosis,
    selectedInvestigations,
    investigationInterpretation,
    finalDiagnosis,
    finalReasoning,
    simulationStartTime,
    simulationEndTime,
    resetSimulation,
    completedSimulations
  } = useSimulation();

  if (!selectedCase) {
    return null;
  }

  const timeTaken = simulationEndTime && simulationStartTime ? Math.round((simulationEndTime - simulationStartTime) / 1000) : null;
  const latestCompleted = completedSimulations.find(c => c.simulationId === selectedCase.id) || null;
  const overallScore = latestCompleted ? latestCompleted.overall : null;
  const resultText = overallScore !== null ? `${overallScore}%` : 'N/A';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="feedback" />
      <Text style={styles.title}>Clinical Case Complete</Text>
      <Text style={styles.subtitle}>Review your case summary and doctor-verified feedback.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Student Diagnosis</Text>
        <Text style={styles.cardText}>{finalDiagnosis || 'No final diagnosis entered'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Doctor-Verified Diagnosis</Text>
        <Text style={styles.cardText}>{selectedCase.doctorVerifiedDiagnosis}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Overall Score</Text>
        <Text style={[styles.resultText]}>{resultText}</Text>
        {latestCompleted && latestCompleted.scores ? (
          <View style={{ marginTop: 10 }}>
            {Object.keys(latestCompleted.scores).map(key => (
              <Text key={key} style={styles.feedbackText}>{key}: {latestCompleted.scores[key]?.score ?? latestCompleted.scores[key]}</Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>What You Did Well</Text>
        {selectedCase.feedback.good.map((item, index) => (
          <Text key={index} style={styles.feedbackText}>✓ {item}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Areas for Improvement</Text>
        {selectedCase.feedback.improvement.map((item, index) => (
          <Text key={index} style={styles.feedbackText}>- {item}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Clinical Learning Points</Text>
        {selectedCase.teachingPoints.map((item, index) => (
          <Text key={index} style={styles.feedbackText}>• {item}</Text>
        ))}
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Time</Text>
          <Text style={styles.summaryValue}>{timeTaken ? `${timeTaken} sec` : 'N/A'}</Text>
        </View>
        <View style={styles.summaryBlock}>
          <Text style={styles.summaryLabel}>Investigations</Text>
          <Text style={styles.summaryValue}>{selectedInvestigations.length}</Text>
        </View>
      </View>

      <Text style={styles.note}>Your submitted reasoning:</Text>
      <Text style={styles.enteredText}>{finalReasoning}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { color: COLORS.muted, marginBottom: 18 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  cardText: { color: COLORS.muted, lineHeight: 22 },
  resultText: { fontSize: 18, fontWeight: '700' },
  correct: { color: COLORS.primary },
  incorrect: { color: COLORS.secondary },
  feedbackText: { color: COLORS.muted, marginBottom: 8, lineHeight: 22 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  summaryBlock: { flex: 1, backgroundColor: '#F0F7F4', borderRadius: 16, padding: 14, marginRight: 10 },
  summaryLabel: { color: COLORS.muted, marginBottom: 6 },
  summaryValue: { color: COLORS.text, fontWeight: '700' },
  note: { color: COLORS.secondary, fontWeight: '700', marginTop: 14, marginBottom: 8 },
  enteredText: { color: COLORS.muted, lineHeight: 22 }
});

export default ClinicalFeedbackScreen;
