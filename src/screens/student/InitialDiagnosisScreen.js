import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import CustomInput from '../../components/CustomInput';
import SimulationProgress from '../../components/SimulationProgress';
import PrimaryButton from '../../components/PrimaryButton';
import { useSimulation } from '../../context/SimulationContext';

const InitialDiagnosisScreen = ({ navigation }) => {
  const { initialDiagnosis, setInitialDiagnosis, initialReasoning, setInitialReasoning, selectedCase } = useSimulation();

  if (!selectedCase) {
    return null;
  }

  const handleSubmit = () => {
    if (!initialDiagnosis.trim()) {
      Alert.alert('Enter your initial impression', 'Please provide your most likely diagnosis.');
      return;
    }
    if (!initialReasoning.trim()) {
      Alert.alert('Explain your reasoning', 'Please describe why this diagnosis is most likely.');
      return;
    }
    navigation.navigate('DifferentialDiagnosis');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="initial" />
      <Text style={styles.title}>Initial Clinical Impression</Text>
      <Text style={styles.subtitle}>Capture your first impression after reviewing the presentation, history, and examination.</Text>

      <CustomInput
        label="Most likely diagnosis"
        value={initialDiagnosis}
        onChangeText={setInitialDiagnosis}
        placeholder="Type your diagnosis here..."
      />
      <CustomInput
        label="Why do you think this is the most likely diagnosis?"
        value={initialReasoning}
        onChangeText={setInitialReasoning}
        placeholder="Explain your clinical reasoning..."
        multiline
        numberOfLines={5}
        style={styles.multiline}
      />

      <PrimaryButton title="Submit Initial Impression" onPress={handleSubmit} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { color: COLORS.muted, marginBottom: 18 },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  button: { marginTop: 16 }
});

export default InitialDiagnosisScreen;
