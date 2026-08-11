import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import InvestigationOption from '../../components/InvestigationOption';
import PrimaryButton from '../../components/PrimaryButton';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';

const InvestigationScreen = ({ navigation }) => {
  const {
    selectedCase,
    selectedInvestigations,
    setSelectedInvestigations
  } = useSimulation();

  const [invRequest, setInvRequest] = useState('');

  const addInvestigationByText = () => {
    if (!invRequest.trim()) {
      Alert.alert('Investigation', 'Type an investigation name or request');
      return;
    }
    const { matchInvestigationRequest } = require('../../utils/matchingUtils');
    const res = matchInvestigationRequest(invRequest, selectedCase.investigations);
    if (!res) {
      Alert.alert('No match', 'Could not match that investigation. Try another name.');
      return;
    }
    if (!selectedInvestigations.includes(res.id)) setSelectedInvestigations(prev => [...prev, res.id]);
    setInvRequest('');
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
        <TouchableOpacity onPress={addInvestigationByText} style={styles.addBtn}><Text style={{ color: '#fff' }}>Add</Text></TouchableOpacity>
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
