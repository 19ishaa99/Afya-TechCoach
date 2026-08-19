import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import InvestigationOption from '../../components/InvestigationOption';
import PrimaryButton from '../../components/PrimaryButton';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';
import { caseApi } from '../../api/caseApi';

const InvestigationScreen = ({ navigation }) => {
  const {
    selectedCase,
    selectedInvestigations,
    setSelectedInvestigations
  } = useSimulation();

  const [invRequest, setInvRequest] = useState('');
  const [adding, setAdding] = useState(false);

  const addInvestigationByText = async () => {
    if (!invRequest.trim()) {
      Alert.alert('Investigation', 'Type an investigation name or request');
      return;
    }
    if (adding) return;
    setAdding(true);
    try {
      const res = await caseApi.requestInvestigation(selectedCase.id, invRequest.trim());
      if (!selectedInvestigations.includes(res.id)) setSelectedInvestigations(prev => [...prev, res.id]);
      setInvRequest('');
    } catch (error) {
      Alert.alert(error.status === 404 ? 'Investigation not recognized' : 'Unable to add investigation', error.status === 404 ? 'Try a standard investigation name or select it from the list.' : 'Check your connection and try again.');
    } finally { setAdding(false); }
  };

  if (!selectedCase) {
    return null;
  }

  const available = selectedCase.investigations;

  const toggleInvestigation = id => {
    setSelectedInvestigations(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedInvestigations.length === 0) {
      Alert.alert('Choose at least one investigation', 'Select at least one investigation to request.');
      return;
    }
    navigation.navigate('InvestigationResults');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="investigation" />
      <Text style={styles.title}>Choose Investigations</Text>
      <Text style={styles.subtitle}>Request the tests you would use to confirm or exclude your differential diagnoses.</Text>

      <View style={styles.askRow}>
        <TextInput placeholder="Type an investigation (e.g., 'CBC', 'Chest X-ray')" value={invRequest} onChangeText={setInvRequest} style={styles.input} />
        <TouchableOpacity disabled={adding} onPress={addInvestigationByText} style={[styles.addBtn, adding && { opacity: 0.6 }]}><Text style={{ color: '#fff' }}>{adding ? 'Adding…' : 'Add'}</Text></TouchableOpacity>
      </View>

      {available.map(investigation => (
        <InvestigationOption
          key={investigation.id}
          option={investigation}
          selected={selectedInvestigations.includes(investigation.id)}
          onPress={() => toggleInvestigation(investigation.id)}
        />
      ))}

      <PrimaryButton title="Request Investigations" onPress={handleContinue} style={styles.button} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  subtitle: { color: COLORS.muted, marginBottom: 18 },
  button: { marginTop: 10 }
});

export default InvestigationScreen;
