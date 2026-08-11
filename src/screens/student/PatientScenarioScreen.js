import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import { useSimulation } from '../../context/SimulationContext';

const PatientScenarioScreen = ({ navigation }) => {
  const { selectedCase } = useSimulation();

  if (!selectedCase) {
    return null;
  }

  const { patient, presentation, caseStages, history, examination, investigations } = selectedCase;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.stageHeader}>
        {caseStages.map((stage, index) => (
          <View key={stage.id} style={[styles.stagePill, index === 0 && styles.stageActive]}>
            <Text style={[styles.stageLabel, index === 0 && styles.stageLabelActive]}>{stage.title}</Text>
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Information</Text>
        <View style={styles.detailRow}><Text style={styles.label}>Name</Text><Text style={styles.value}>{patient.name}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Age</Text><Text style={styles.value}>{patient.age}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Sex</Text><Text style={styles.value}>{patient.sex}</Text></View>
        <View style={styles.detailRow}><Text style={styles.label}>Chief Complaint</Text><Text style={styles.value}>{presentation.chiefComplaint}</Text></View>
        <Text style={styles.sectionTitle}>Vital Signs</Text>
        <View style={styles.vitalRow}><Text style={styles.vitalLabel}>Temp</Text><Text style={styles.vitalValue}>{presentation.vitalSigns.temperature}</Text></View>
        <View style={styles.vitalRow}><Text style={styles.vitalLabel}>Heart Rate</Text><Text style={styles.vitalValue}>{presentation.vitalSigns.heartRate}</Text></View>
        <View style={styles.vitalRow}><Text style={styles.vitalLabel}>Blood Pressure</Text><Text style={styles.vitalValue}>{presentation.vitalSigns.bloodPressure}</Text></View>
        <View style={styles.vitalRow}><Text style={styles.vitalLabel}>Respiratory Rate</Text><Text style={styles.vitalValue}>{presentation.vitalSigns.respiratoryRate}</Text></View>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Presenting History</Text>
        <Text style={styles.historyText}>{history.presentingIllness}</Text>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Examination Findings</Text>
        <Text style={styles.historyText}>{examination.general}</Text>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Recommended Investigations</Text>
        {investigations.map((test, index) => (
          <Text key={index} style={styles.historyText}>• {test.name}</Text>
        ))}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('HistoryStage')}>
        <Text style={styles.continueText}>Continue to History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 18
  },
  cardTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: COLORS.muted },
  value: { color: COLORS.text, fontWeight: '700', flex: 0.65, textAlign: 'right' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginTop: 14, marginBottom: 8 },
  vitalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  vitalLabel: { color: COLORS.muted },
  vitalValue: { color: COLORS.text, fontWeight: '700' },
  stageHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18
  },
  stagePill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
    marginBottom: 10
  },
  stageActive: {
    backgroundColor: COLORS.primary
  },
  stageLabel: {
    color: COLORS.text,
    fontWeight: '700'
  },
  stageLabelActive: {
    color: COLORS.white
  },
  historyCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20
  },
  historyText: { color: COLORS.muted, lineHeight: 22 },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center'
  },
  continueText: { color: COLORS.white, fontWeight: '700' }
});

export default PatientScenarioScreen;
