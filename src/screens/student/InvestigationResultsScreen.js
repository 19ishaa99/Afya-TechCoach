import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';

const InvestigationResultsScreen = ({ navigation }) => {
  const {
    selectedCase,
    selectedInvestigations,
    investigationInterpretation,
    setInvestigationInterpretation
  } = useSimulation();

  if (!selectedCase) {
    return null;
  }

  const results = selectedCase.investigations.filter(inv => selectedInvestigations.includes(inv.id));

  const handleContinue = () => {
    if (!investigationInterpretation.trim()) {
      Alert.alert('Interpret the results', 'Please explain what the selected investigation results suggest.');
      return;
    }
    navigation.navigate('FinalDiagnosis');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="results" />
      <Text style={styles.title}>Investigation Results</Text>
      <Text style={styles.subtitle}>Review the results for the investigations you requested.</Text>

      {results.map(investigation => (
        <View key={investigation.id} style={styles.card}>
          <Text style={styles.cardTitle}>{investigation.name}</Text>
          {Object.entries(investigation.results).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.value}>{value}</Text>
            </View>
          ))}
        </View>
      ))}

      <CustomInput
        label="Interpret the Results"
        value={investigationInterpretation}
        onChangeText={setInvestigationInterpretation}
        placeholder="What do these findings suggest?"
        multiline
        numberOfLines={5}
        style={styles.multiline}
      />

      <PrimaryButton title="Continue to Final Diagnosis" onPress={handleContinue} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { color: COLORS.muted, marginBottom: 18 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: COLORS.muted, flex: 1 },
  value: { color: COLORS.text, flex: 1, textAlign: 'right', fontWeight: '700' },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  button: { marginTop: 10 }
});

export default InvestigationResultsScreen;
