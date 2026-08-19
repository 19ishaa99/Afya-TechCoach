import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants';
import { progressApi } from '../../api/progressApi';
import { caseApi } from '../../api/caseApi';
import { useAuth } from '../../context/AuthContext';
import SimulationCard from '../../components/student/SimulationCard';
import { scenarios } from '../../constants/mockData';

const formatDate = value => value ? new Date(value).toLocaleString() : 'Not available';
const statusLabel = value => ({ submitted: 'Evaluation pending', evaluating: 'Evaluation in progress', evaluation_failed: 'Evaluation needs retry' }[value] || value);

const StudentDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableCases, setAvailableCases] = useState([]);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [record, approvedCases] = await Promise.all([progressApi.dashboard(), caseApi.list()]);
      setDashboard(record);
      setAvailableCases(approvedCases.map(item => {
        const content = scenarios.find(scenario => scenario.id === item.id);
        return content ? { ...content, title: item.title, specialty: item.specialty, difficulty: item.difficulty } : null;
      }).filter(Boolean));
    } catch (requestError) { setError(requestError.message); } finally { setLoading(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const firstName = (dashboard?.student?.full_name || user?.full_name || 'Student').trim().split(/\s+/)[0];
  if (loading && !dashboard) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /><Text style={styles.muted}>Loading your dashboard…</Text></View>;
  if (error && !dashboard) return <View style={styles.center}><Text style={styles.error}>{error}</Text><TouchableOpacity style={styles.button} onPress={load}><Text style={styles.buttonText}>Try again</Text></TouchableOpacity></View>;
  const summary = dashboard?.summary;
  return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <View style={styles.header}><View style={styles.headerText}><Text style={styles.greeting}>Welcome, {firstName}</Text><Text style={styles.muted}>Build your clinical reasoning one case at a time.</Text></View><View style={styles.avatar}><MaterialIcons name="person" size={24} color={COLORS.white} /></View></View>
    {error ? <Text style={styles.inlineError}>{error}</Text> : null}
    {!dashboard?.has_activity ? <View style={styles.hero}><MaterialIcons name="medical-services" size={42} color={COLORS.primary} /><Text style={styles.cardTitle}>Start your first clinical case</Text><Text style={styles.centerText}>You have no simulation activity yet. Scores and progress will appear after a submitted case has been evaluated.</Text><TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SimulationList')}><Text style={styles.buttonText}>Browse available cases</Text></TouchableOpacity></View> : null}
    {dashboard?.continue_learning ? <View style={styles.card}><Text style={styles.eyebrow}>CONTINUE LEARNING</Text><Text style={styles.cardTitle}>{dashboard.continue_learning.case_title}</Text><Text style={styles.muted}>{dashboard.continue_learning.step_progress}% through case • Saved {formatDate(dashboard.continue_learning.last_saved_at)}</Text><TouchableOpacity style={styles.button} onPress={() => navigation.navigate(dashboard.continue_learning.current_step, { simulationId: dashboard.continue_learning.simulation_id })}><Text style={styles.buttonText}>Continue simulation</Text></TouchableOpacity></View> : null}
    {dashboard?.evaluation_pending ? <View style={styles.card}><Text style={styles.eyebrow}>{statusLabel(dashboard.evaluation_pending.status).toUpperCase()}</Text><Text style={styles.cardTitle}>{dashboard.evaluation_pending.case_title}</Text><Text style={styles.muted}>Submitted {formatDate(dashboard.evaluation_pending.submitted_at)}. No score is shown until evaluation completes.</Text>{dashboard.evaluation_pending.status === 'evaluation_failed' ? <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ReviewAnswers', { simulationId: dashboard.evaluation_pending.simulation_id })}><Text style={styles.buttonText}>Retry evaluation</Text></TouchableOpacity> : null}</View> : null}
    {dashboard?.has_completed_evaluation ? <><Text style={styles.sectionTitle}>Progress summary</Text><View style={styles.metrics}><View style={styles.metric}><Text style={styles.metricValue}>{summary.average_score}%</Text><Text style={styles.muted}>Average score</Text></View><View style={styles.metric}><Text style={styles.metricValue}>{summary.cases_completed}</Text><Text style={styles.muted}>Completed</Text></View><View style={styles.metric}><Text style={styles.metricValue}>{summary.current_streak_days}d</Text><Text style={styles.muted}>Current streak</Text></View></View>{dashboard.latest_feedback ? <View style={styles.card}><Text style={styles.eyebrow}>LATEST EVALUATED CASE</Text><Text style={styles.cardTitle}>{dashboard.latest_feedback.case_title}</Text><Text style={styles.score}>{dashboard.latest_feedback.overall_score}%</Text><TouchableOpacity onPress={() => navigation.navigate('ClinicalFeedback', { simulationId: dashboard.latest_feedback.simulation_id })}><Text style={styles.link}>View clinical feedback</Text></TouchableOpacity></View> : null}</> : dashboard?.has_activity ? <View style={styles.card}><Text style={styles.cardTitle}>Progress will appear after evaluation</Text><Text style={styles.muted}>Your saved work is secure. Complete and submit a case to receive a real score and feedback.</Text></View> : null}
    {dashboard?.recent_activity?.length ? <><Text style={styles.sectionTitle}>Recent activity</Text>{dashboard.recent_activity.map(item => <View key={item.simulation_id} style={styles.activity}><Text style={styles.activityTitle}>{item.case_title}</Text><Text style={styles.muted}>{statusLabel(item.status)} • {formatDate(item.started_at)}</Text>{item.overall_score != null ? <Text style={styles.link}>{item.overall_score}%</Text> : null}</View>)}</> : null}
    {availableCases.length ? <><Text style={styles.sectionTitle}>Available clinical cases</Text>{availableCases.slice(0, 3).map(item => <SimulationCard key={item.id} scenario={item} onStart={() => navigation.navigate('ScenarioIntro', { scenario: item })} />)}</> : null}
    <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('SimulationList')}><MaterialIcons name="add-circle-outline" size={21} color={COLORS.primary} /><Text style={styles.secondaryText}>Start a new simulation</Text></TouchableOpacity>
  </ScrollView>;
};
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: COLORS.background }, content: { padding: SIZES.padding, paddingBottom: 32 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, backgroundColor: COLORS.background }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }, headerText: { flex: 1, paddingRight: 12 }, greeting: { fontSize: 25, fontWeight: '700', color: COLORS.text, marginBottom: 5 }, avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' }, hero: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 24, alignItems: 'center', marginBottom: 18 }, card: { backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 18, marginBottom: 16 }, cardTitle: { fontSize: 19, fontWeight: '700', color: COLORS.text, marginTop: 8, marginBottom: 8 }, centerText: { color: COLORS.muted, textAlign: 'center', lineHeight: 21 }, muted: { color: COLORS.muted }, eyebrow: { color: COLORS.secondary, fontSize: 12, fontWeight: '800', letterSpacing: 0.7 }, button: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 18, alignItems: 'center', marginTop: 16 }, buttonText: { color: COLORS.white, fontWeight: '700' }, secondaryButton: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 14, padding: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }, secondaryText: { color: COLORS.primary, fontWeight: '700' }, sectionTitle: { fontSize: 19, fontWeight: '700', color: COLORS.text, marginBottom: 10 }, metrics: { flexDirection: 'row', gap: 8, marginBottom: 16 }, metric: { flex: 1, backgroundColor: COLORS.card, borderRadius: 14, padding: 13 }, metricValue: { fontSize: 21, fontWeight: '800', color: COLORS.primary, marginBottom: 4 }, score: { fontSize: 30, fontWeight: '800', color: COLORS.primary }, link: { color: COLORS.primary, fontWeight: '700', marginTop: 12 }, activity: { backgroundColor: COLORS.card, borderRadius: 14, padding: 14, marginBottom: 9 }, activityTitle: { color: COLORS.text, fontWeight: '700', marginBottom: 4 }, error: { color: COLORS.error, textAlign: 'center' }, inlineError: { color: COLORS.error, marginBottom: 12 } });
export default StudentDashboardScreen;
