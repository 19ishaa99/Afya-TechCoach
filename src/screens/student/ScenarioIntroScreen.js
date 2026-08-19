import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';
import { scenarios } from '../../constants/mockData';

const StartSimulationScreen = ({ route, navigation }) => {
  const scenario = route.params?.scenario || scenarios.find(item => item.id === route.params?.caseId);
  const { startCase } = useSimulation();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onBegin = async () => {
    if (loading) return;
    setLoading(true); setError('');
    try {
      const attempt = await startCase(scenario);
      navigation.navigate('PatientScenario', { simulationId: attempt.id });
    } catch (_) {
      setError('Unable to start this simulation. Check your connection and sign-in, then try again.');
    } finally { setLoading(false); }
  };

  if (!scenario) return <View style={styles.missing}><Text style={styles.title}>This clinical case is no longer available.</Text><TouchableOpacity style={styles.startButton} onPress={() => navigation.replace('StudentTabs', { screen: 'SimulationList' })}><Text style={styles.startText}>Return to Cases</Text></TouchableOpacity></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="intro" />
      <View style={styles.card}>
        <Text style={styles.specialty}>{scenario.specialty}</Text>
        <Text style={styles.title}>{scenario.title}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{scenario.difficulty}</Text></View>
          <Text style={styles.infoText}>{scenario.estimatedTime}</Text>
        </View>
        <Text style={styles.sectionTitle}>Learning Objectives</Text>
        {scenario.learningObjectives.map((objective, index) => (
          <Text key={index} style={styles.objective}>• {objective}</Text>
        ))}
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.description}>{scenario.description}</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity disabled={loading} style={[styles.startButton, loading && { opacity: 0.6 }]} onPress={onBegin}>
        <Text style={styles.startText}>{loading ? 'Starting…' : 'Begin Clinical Case'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 30 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  specialty: { color: COLORS.secondary, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  badge: { backgroundColor: '#E8F5EF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginRight: 10 },
  badgeText: { color: COLORS.primary, fontWeight: '700' },
  infoText: { color: COLORS.muted },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 14, marginBottom: 8, color: COLORS.text },
  objective: { color: COLORS.muted, marginBottom: 6 },
  description: { color: COLORS.muted, lineHeight: 22 },
  startButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center'
  },
  startText: { color: COLORS.white, fontWeight: '700' }
  ,error: { color: COLORS.error, marginBottom: 12 }, missing: { flex: 1, justifyContent: 'center', padding: SIZES.padding, backgroundColor: COLORS.background }
});

export default StartSimulationScreen;
