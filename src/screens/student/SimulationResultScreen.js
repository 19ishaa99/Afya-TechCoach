import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const SimulationResultScreen = ({ route, navigation }) => {
  const { simulationId } = route.params || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Simulation submission</Text>
      <View style={styles.detailsCard}>
        <Text style={styles.detailText}>No score or feedback is calculated on this legacy screen. Evaluated results are loaded from your saved clinical attempt.</Text>
      </View>
      {simulationId ? <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('ClinicalFeedback', { simulationId })}><Text style={styles.primaryText}>Load evaluated feedback</Text></TouchableOpacity> : null}
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('SimulationList')}>
        <Text style={styles.primaryText}>Try Another Simulation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('StudentDashboard')}>
        <Text style={styles.secondaryText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3
  },
  detailText: { color: COLORS.text, marginBottom: 8 },
  feedbackCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  feedbackText: { color: COLORS.muted, marginBottom: 10, lineHeight: 22 },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12
  },
  primaryText: { color: COLORS.white, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  secondaryText: { color: COLORS.primary, fontWeight: '700' }
});

export default SimulationResultScreen;
