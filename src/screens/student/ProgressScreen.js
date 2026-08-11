import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const specialties = [
  { label: 'Internal Medicine', value: '82%' },
  { label: 'Pediatrics', value: '74%' },
  { label: 'Surgery', value: '68%' },
  { label: 'Emergency Medicine', value: '91%' }
];

const ProgressScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Progress</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Overall Score</Text>
        <Text style={styles.summaryValue}>86%</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Simulations</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>84%</Text><Text style={styles.statLabel}>Average</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>5d</Text><Text style={styles.statLabel}>Streak</Text></View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Specialty Strengths</Text>
      {specialties.map(item => (
        <View key={item.label} style={styles.specCard}>
          <Text style={styles.specLabel}>{item.label}</Text>
          <Text style={styles.specValue}>{item.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 18 },
  summaryCard: {
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
  summaryLabel: { color: COLORS.muted, marginBottom: 8 },
  summaryValue: { fontSize: 36, fontWeight: '700', color: COLORS.primary, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  statLabel: { color: COLORS.muted },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  specCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  specLabel: { color: COLORS.text, fontWeight: '700' },
  specValue: { color: COLORS.secondary, fontWeight: '700' }
});

export default ProgressScreen;
