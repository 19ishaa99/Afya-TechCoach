import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';

const DifferentialDiagnosisScreen = ({ navigation }) => {
  const {
    differentialDiagnoses,
    setDifferentialDiagnoses,
    mostLikelyDiagnosis,
    setMostLikelyDiagnosis,
    selectedCase
  } = useSimulation();

  if (!selectedCase) {
    return null;
  }

  const updateDiagnosis = (id, value) => {
    setDifferentialDiagnoses(prev => prev.map(item => (item.id === id ? { ...item, value } : item)));
  };

  const addDiagnosis = () => {
    if (differentialDiagnoses.length >= 5) {
      return;
    }
    setDifferentialDiagnoses(prev => [...prev, { id: prev.length + 1, value: '' }]);
  };

  const handleSubmit = () => {
    const filled = differentialDiagnoses.filter(item => item.value.trim());
    if (filled.length < 2) {
      Alert.alert('Add at least two diagnoses', 'Please enter at least two differential diagnoses.');
      return;
    }
    if (!mostLikelyDiagnosis.trim()) {
      Alert.alert('Select a most likely diagnosis', 'Please choose the diagnosis you think is most likely.');
      return;
    }
    navigation.navigate('Investigation');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="differential" />
      <Text style={styles.title}>Build Your Differential Diagnosis</Text>
      <Text style={styles.subtitle}>List the possible diagnoses you would consider before confirming the final diagnosis.</Text>

      {differentialDiagnoses.map(item => (
        <CustomInput
          key={item.id}
          label={`Diagnosis ${item.id}`}
          value={item.value}
          onChangeText={value => updateDiagnosis(item.id, value)}
          placeholder="Enter a diagnosis"
        />
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addDiagnosis}>
        <Text style={styles.addText}>+ Add Diagnosis</Text>
      </TouchableOpacity>

      <CustomInput
        label="Which diagnosis is currently most likely?"
        value={mostLikelyDiagnosis}
        onChangeText={setMostLikelyDiagnosis}
        placeholder="Enter your most likely diagnosis"
      />

      <PrimaryButton title="Continue to Investigations" onPress={handleSubmit} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { color: COLORS.muted, marginBottom: 18 },
  addButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  addText: { color: COLORS.primary, fontWeight: '700' },
  button: { marginTop: 10 }
});

export default DifferentialDiagnosisScreen;
