import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SIZES, SPACING } from '../../constants';
import { useSimulation } from '../../context/SimulationContext';
import { simulationApi } from '../../api/simulationApi';

const labels = { history_taking: 'History taking', physical_examination: 'Physical examination', initial_diagnosis: 'Initial diagnosis', differential_diagnosis: 'Differential diagnosis', investigation_selection: 'Investigation selection', investigation_interpretation: 'Investigation interpretation', final_diagnosis: 'Final diagnosis', clinical_reasoning: 'Clinical reasoning', patient_safety: 'Patient safety' };
const ListCard = ({ title, items = [], tone = 'neutral' }) => <View style={[styles.card, styles[`${tone}Card`]]}><Text style={styles.cardTitle}>{title}</Text>{items.length ? items.map((item, index) => <Text key={index} style={styles.item}>• {item}</Text>) : <Text style={styles.empty}>No items identified.</Text>}</View>;
const Correction = ({ data = {} }) => <View style={styles.card}><Text style={styles.cardTitle}>Corrected medical wording</Text>{Object.entries(data).map(([key, value]) => <View key={key} style={styles.correction}><Text style={styles.smallLabel}>{key.replaceAll('_', ' ')}</Text><Text style={styles.item}>{Array.isArray(value) ? value.join(', ') || 'Not provided' : value || 'Not provided'}</Text></View>)}</View>;

export default function ClinicalFeedbackScreen({ route, navigation }) {
  const { attemptId, resetSimulation } = useSimulation();
  const id = route.params?.simulationId || attemptId;
  const [evaluation, setEvaluation] = useState(route.params?.evaluation || null);
  const [error, setError] = useState('');
  useEffect(() => { if (!evaluation && id) simulationApi.feedback(id).then(setEvaluation).catch(err => setError(err.message)); }, [id, evaluation]);
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text><TouchableOpacity style={styles.action} onPress={() => { setError(''); simulationApi.feedback(id).then(setEvaluation).catch(err => setError(err.message)); }}><Text style={styles.actionText}>Retry</Text></TouchableOpacity></View>;
  if (!evaluation) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.loading}>Restoring your feedback…</Text></View>;
  const scores = evaluation.scores || {};
  const restart = async () => { const next = await simulationApi.retry(id); await resetSimulation(); navigation.replace('PatientScenario', { simulationId: next.id }); };
  const dashboard = async () => { await resetSimulation(); navigation.navigate('StudentTabs', { screen: 'StudentDashboard' }); };
  return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Text style={styles.title}>Your answer, clarified</Text><Text style={styles.detected}>{evaluation.detected_meaning}</Text>
    <Correction data={evaluation.corrected_response} />
    <View style={styles.scoreCard}><View style={styles.ring}><Text style={styles.score}>{Math.round(scores.overall || 0)}%</Text><Text style={styles.scoreLabel}>Overall</Text></View><Text style={styles.scoreCopy}>Clinical scores are calculated separately from language quality.</Text></View>
    <View style={styles.card}><Text style={styles.cardTitle}>Category percentages</Text>{Object.entries(labels).map(([key, label]) => <View key={key} style={styles.metric}><View style={styles.metricRow}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricScore}>{Math.round(scores[key] || 0)}%</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${Math.max(0, Math.min(100, scores[key] || 0))}%` }]} /></View><Text style={styles.explanation}>{evaluation.score_explanations?.[key]}</Text></View>)}</View>
    <ListCard title="Language feedback — strengths" items={evaluation.language_feedback?.strengths} tone="success" />
    <ListCard title="Language corrections" items={evaluation.language_feedback?.corrections} />
    <ListCard title="Clearer medical wording" items={evaluation.language_feedback?.clearer_medical_wording} />
    <ListCard title="What you did well" items={evaluation.strengths} tone="success" />
    <ListCard title="What was partially correct" items={evaluation.partially_correct_points} tone="warning" />
    <ListCard title="What was incorrect" items={evaluation.incorrect_points} tone="error" />
    <ListCard title="Important points you missed" items={evaluation.missed_important_points} tone="warning" />
    <ListCard title="Patient-safety concerns" items={evaluation.unsafe_recommendations} tone="error" />
    <View style={styles.card}><Text style={styles.cardTitle}>Doctor-verified diagnosis</Text><Text style={styles.diagnosis}>{evaluation.doctor_verified_diagnosis}</Text><Text style={styles.item}>{evaluation.doctor_approved_explanation}</Text></View>
    <ListCard title="Clinical learning points" items={evaluation.clinical_learning_points} />
    <ListCard title="Areas to focus on" items={evaluation.study_focus} />
    <View style={styles.card}><Text style={styles.cardTitle}>Personalized advice</Text><Text style={styles.item}>{evaluation.personalized_advice}</Text></View>
    <View style={[styles.card, styles.successCard]}><Text style={styles.cardTitle}>Keep going</Text><Text style={styles.item}>{evaluation.encouragement}</Text><Text style={styles.disclaimer}>{evaluation.educational_disclaimer}</Text></View>
    <View style={styles.actions}><TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('ReviewAnswers', { simulationId: id, readOnly: true })}><MaterialIcons name="fact-check" size={19} color={COLORS.primary} /><Text style={styles.secondaryText}>Review Original Answers</Text></TouchableOpacity><TouchableOpacity style={styles.secondary} onPress={restart}><Text style={styles.secondaryText}>Retry Case</Text></TouchableOpacity><TouchableOpacity style={styles.action} onPress={dashboard}><Text style={styles.actionText}>Return to Dashboard</Text></TouchableOpacity></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }, content: { padding: SIZES.padding, paddingBottom: 50, width: '100%', maxWidth: 900, alignSelf: 'center' }, center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl, backgroundColor: COLORS.background },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.navy }, detected: { color: COLORS.muted, lineHeight: 22, marginTop: SPACING.sm, marginBottom: SPACING.xl }, loading: { color: COLORS.muted, marginTop: SPACING.md }, error: { color: COLORS.error, textAlign: 'center' },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.card }, successCard: { borderLeftWidth: 4, borderLeftColor: COLORS.success }, warningCard: { borderLeftWidth: 4, borderLeftColor: COLORS.warning }, errorCard: { borderLeftWidth: 4, borderLeftColor: COLORS.error },
  cardTitle: { color: COLORS.navy, fontSize: 17, fontWeight: '800', marginBottom: SPACING.md }, item: { color: COLORS.text, lineHeight: 22, marginBottom: SPACING.sm }, empty: { color: COLORS.muted, fontStyle: 'italic' }, smallLabel: { color: COLORS.muted, fontSize: 12, textTransform: 'capitalize', marginBottom: 3 }, correction: { marginBottom: SPACING.sm },
  scoreCard: { backgroundColor: COLORS.navy, borderRadius: 28, padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.md }, ring: { width: 130, height: 130, borderRadius: 65, borderWidth: 10, borderColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' }, score: { color: COLORS.white, fontSize: 32, fontWeight: '800' }, scoreLabel: { color: '#CDECEA' }, scoreCopy: { color: '#DCEFF2', textAlign: 'center', marginTop: SPACING.md },
  metric: { marginBottom: SPACING.lg }, metricRow: { flexDirection: 'row', justifyContent: 'space-between' }, metricLabel: { color: COLORS.text, fontWeight: '700' }, metricScore: { color: COLORS.primary, fontWeight: '800' }, track: { height: 9, backgroundColor: '#E4EEF1', borderRadius: 9, marginVertical: SPACING.sm, overflow: 'hidden' }, fill: { height: '100%', backgroundColor: COLORS.secondary, borderRadius: 9 }, explanation: { color: COLORS.muted, fontSize: 13, lineHeight: 19 }, diagnosis: { color: COLORS.primary, fontWeight: '800', fontSize: 20, marginBottom: SPACING.md }, disclaimer: { color: COLORS.muted, fontSize: 12, lineHeight: 18, marginTop: SPACING.md },
  actions: { gap: SPACING.md, marginTop: SPACING.md }, action: { minHeight: 54, backgroundColor: COLORS.primary, borderRadius: 17, alignItems: 'center', justifyContent: 'center', padding: SPACING.md }, actionText: { color: COLORS.white, fontWeight: '800' }, secondary: { minHeight: 52, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 17, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: SPACING.sm, padding: SPACING.md }, secondaryText: { color: COLORS.primary, fontWeight: '800' }
});
