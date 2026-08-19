import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SHADOWS, SIZES, SPACING } from '../../constants';
import { useSimulation } from '../../context/SimulationContext';
import { simulationApi } from '../../api/simulationApi';

const ReviewMode = React.createContext(false);
const Section = ({ title, value, onEdit }) => {
  const readOnly = React.useContext(ReviewMode);
  return <View style={styles.card}><View style={styles.row}><Text style={styles.sectionTitle}>{title}</Text>{!readOnly ? <TouchableOpacity onPress={onEdit}><Text style={styles.edit}>Edit</Text></TouchableOpacity> : null}</View><Text style={styles.value}>{value || 'Not provided'}</Text></View>;
};

export default function ReviewAnswersScreen({ navigation, route }) {
  const simulation = useSimulation();
  const [state, setState] = useState({ loading: false, error: '' });
  const [confirming, setConfirming] = useState(false);
  const readOnly = Boolean(route.params?.readOnly);
  const names = simulation.selectedInvestigations.map(id => simulation.selectedCase.investigations.find(item => item.id === id)?.name || id).join(', ');
  const evaluate = async () => {
    if (state.loading) return;
    setState({ loading: true, error: '' });
    await simulation.saveDraft();
    try {
      await simulationApi.submit(simulation.attemptId);
      const evaluation = await simulationApi.evaluate(simulation.attemptId);
      simulation.setSimulationEndTime(Date.now());
      navigation.replace('ClinicalFeedback', { simulationId: simulation.attemptId, evaluation });
    } catch (error) {
      setState({ loading: false, error: error.message || 'Evaluation is temporarily unavailable. Your submitted answers are safe.' });
    }
  };
  return <ReviewMode.Provider value={readOnly}><ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.title}>Review Your Answers</Text><Text style={styles.subtitle}>Check every section before final submission. You can return to edit without losing work.</Text>
    <Section title="History taking" value={`${simulation.historySectionsViewed.length} approved history areas covered`} onEdit={() => navigation.navigate('HistoryStage', { simulationId: simulation.attemptId })} />
    <Section title="Physical examinations" value={simulation.examinationsRequested.join(', ')} onEdit={() => navigation.navigate('Examination', { simulationId: simulation.attemptId })} />
    <Section title="Initial diagnosis and reasoning" value={`${simulation.initialDiagnosis}\n${simulation.initialReasoning}`} onEdit={() => navigation.navigate('InitialDiagnosis', { simulationId: simulation.attemptId })} />
    <Section title="Differential diagnoses" value={simulation.differentialDiagnoses.map(item => item.value).filter(Boolean).join(', ')} onEdit={() => navigation.navigate('DifferentialDiagnosis', { simulationId: simulation.attemptId })} />
    <Section title="Investigations selected" value={names} onEdit={() => navigation.navigate('Investigation', { simulationId: simulation.attemptId })} />
    <Section title="Investigation interpretation" value={simulation.investigationInterpretation} onEdit={() => navigation.navigate('InvestigationResults', { simulationId: simulation.attemptId })} />
    <Section title="Final diagnosis and reasoning" value={`${simulation.finalDiagnosis}\n${simulation.finalReasoning}`} onEdit={() => navigation.navigate('FinalDiagnosis', { simulationId: simulation.attemptId })} />
    {state.error ? <View style={styles.errorBox}><Text style={styles.error}>{state.error}</Text><Text style={styles.errorHint}>AI evaluation requires an internet connection. Tap retry when connected.</Text></View> : null}
    {!readOnly && confirming ? <View style={styles.confirm}><Text style={styles.sectionTitle}>Submit final answers?</Text><Text style={styles.value}>Your answers will be locked while they are compared with doctor-approved case content.</Text><View style={styles.confirmActions}><TouchableOpacity onPress={() => setConfirming(false)}><Text style={styles.edit}>Keep reviewing</Text></TouchableOpacity><TouchableOpacity onPress={evaluate}><Text style={styles.confirmSubmit}>Submit and evaluate</Text></TouchableOpacity></View></View> : null}
    {!readOnly ? <TouchableOpacity disabled={state.loading} style={[styles.submit, state.loading && { opacity: 0.7 }]} onPress={state.error ? evaluate : () => setConfirming(true)}>{state.loading ? <><ActivityIndicator color={COLORS.white} /><Text style={styles.submitText}>Comparing with approved case content…</Text></> : <Text style={styles.submitText}>{state.error ? 'Retry Evaluation' : 'Submit for Evaluation'}</Text>}</TouchableOpacity> : null}
  </ScrollView></ReviewMode.Provider>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }, content: { padding: SIZES.padding, paddingBottom: 40, width: '100%', maxWidth: 820, alignSelf: 'center' },
  title: { fontSize: 27, fontWeight: '800', color: COLORS.navy }, subtitle: { color: COLORS.muted, lineHeight: 21, marginTop: SPACING.xs, marginBottom: SPACING.xl },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.card }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.md },
  sectionTitle: { color: COLORS.navy, fontWeight: '800', flex: 1 }, edit: { color: COLORS.primary, fontWeight: '700' }, value: { color: COLORS.muted, lineHeight: 21, marginTop: SPACING.sm },
  submit: { minHeight: 58, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.lg, padding: SPACING.md }, submitText: { color: COLORS.white, fontWeight: '800', textAlign: 'center' },
  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 14, padding: SPACING.md }, error: { color: COLORS.error, fontWeight: '700' }, errorHint: { color: COLORS.muted, marginTop: SPACING.xs },
  confirm: { backgroundColor: '#ECFDF5', borderRadius: 16, padding: SPACING.lg, marginTop: SPACING.md }, confirmActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.lg, gap: SPACING.md }, confirmSubmit: { color: COLORS.primary, fontWeight: '800' }
});
