import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';

const SimulationCard = ({ scenario, onStart }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.specialty}>{scenario.specialty}</Text>
          <Text style={styles.title}>{scenario.title}</Text>
        </View>
        <MaterialIcons name="medical-services" size={32} color={COLORS.secondary} />
      </View>
      <Text style={styles.description}>{scenario.description}</Text>
      <View style={styles.infoRow}>
        <View style={styles.badge}><Text style={styles.badgeText}>{scenario.difficulty}</Text></View>
        <Text style={styles.infoText}>{scenario.estimatedTime}</Text>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Text style={styles.startText}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  specialty: { color: COLORS.secondary, fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 4 },
  description: { color: COLORS.muted, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badge: { backgroundColor: '#E8F5EF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: COLORS.primary, fontWeight: '700' },
  infoText: { color: COLORS.muted },
  startButton: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  startText: { color: COLORS.white, fontWeight: '700' }
});

export default SimulationCard;
