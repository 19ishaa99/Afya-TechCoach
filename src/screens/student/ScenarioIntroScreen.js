import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';

const StartSimulationScreen = ({ route, navigation }) => {
  const { scenario } = route.params;
  const { startCase } = useSimulation();

  const onBegin = () => {
    startCase(scenario);
    navigation.navigate('PatientScenario');
  };

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
      <TouchableOpacity style={styles.startButton} onPress={onBegin}>
        <Text style={styles.startText}>Begin Clinical Case</Text>
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
});

export default StartSimulationScreen;
