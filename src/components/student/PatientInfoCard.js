import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const PatientInfoCard = ({ patient }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Patient Information</Text>
      <View style={styles.row}><Text style={styles.label}>Name</Text><Text style={styles.value}>{patient.name}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Age</Text><Text style={styles.value}>{patient.age}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Sex</Text><Text style={styles.value}>{patient.sex}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Chief Complaint</Text><Text style={styles.value}>{patient.chiefComplaint}</Text></View>
      <Text style={styles.subtitle}>Vital Signs</Text>
      <View style={styles.vitalRow}><Text style={styles.label}>Temp</Text><Text style={styles.value}>{patient.vitalSigns.temperature}</Text></View>
      <View style={styles.vitalRow}><Text style={styles.label}>Heart Rate</Text><Text style={styles.value}>{patient.vitalSigns.heartRate}</Text></View>
      <View style={styles.vitalRow}><Text style={styles.label}>BP</Text><Text style={styles.value}>{patient.vitalSigns.bloodPressure}</Text></View>
      <View style={styles.vitalRow}><Text style={styles.label}>RR</Text><Text style={styles.value}>{patient.vitalSigns.respiratoryRate}</Text></View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 16
  },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  subtitle: { color: COLORS.muted, marginTop: 14, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: COLORS.muted, flex: 0.5 },
  value: { color: COLORS.text, fontWeight: '700', flex: 0.5, textAlign: 'right' },
  vitalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }
});

export default PatientInfoCard;
