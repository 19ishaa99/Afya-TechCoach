import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { MaterialIcons } from '@expo/vector-icons';

const ScenarioIntroScreen = ({ route, navigation }) => {
  const { scenario } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        <Text style={styles.backText}>Back to Simulations</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.specialty}>{scenario.specialty}</Text>
        <Text style={styles.title}>{scenario.title}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>{scenario.difficulty}</Text></View>
          <Text style={styles.infoText}>{scenario.estimatedTime}</Text>
          <Text style={styles.infoText}>{scenario.questionCount} questions</Text>
        </View>
        <Text style={styles.sectionTitle}>Workflow Stages</Text>
        <View style={styles.stageRow}>
          {scenario.caseStages.map(stage => (
            <View key={stage.id} style={styles.stageCard}>
              <Text style={styles.stageTitle}>{stage.title}</Text>
              <Text style={styles.stageDescription}>{stage.description}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Why this case?</Text>
        {scenario.highlights.map((objective, index) => (
          <Text key={index} style={styles.objective}>• {objective}</Text>
        ))}
        <Text style={styles.sectionTitle}>Learning Objectives</Text>
        {scenario.learningObjectives.map((objective, index) => (
          <Text key={index} style={styles.objective}>• {objective}</Text>
        ))}
        <Text style={styles.sectionTitle}>Scenario</Text>
        <Text style={styles.description}>{scenario.description}</Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('PatientScenario', { scenario })}>
        <Text style={styles.startText}>Start Simulation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { marginLeft: 8, color: COLORS.primary, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  specialty: { color: COLORS.secondary, fontWeight: '700', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 },
  badge: { backgroundColor: '#E8F5EF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginRight: 10, marginBottom: 10 },
  badgeText: { color: COLORS.primary, fontWeight: '700' },
  infoText: { color: COLORS.muted, marginRight: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 14, marginBottom: 8, color: COLORS.text },
  stageRow: { marginBottom: 16 },
  stageCard: {
    backgroundColor: '#E8F5EF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10
  },
  stageTitle: { fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  stageDescription: { color: COLORS.muted },
  objective: { color: COLORS.muted, marginBottom: 6 },
  description: { color: COLORS.muted },
  startButton: {
    marginTop: 24,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center'
  },
  startText: { color: COLORS.white, fontWeight: '700' }
});

export default ScenarioIntroScreen;
