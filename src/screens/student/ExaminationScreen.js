import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';
import { caseApi } from '../../api/caseApi';

const ExaminationScreen = ({ navigation }) => {
  const { selectedCase, examinationsRequested, setExaminationsRequested, addConversationEntry, conversation } = useSimulation();
  const [requestText, setRequestText] = useState('');
  const [requesting, setRequesting] = useState(false);

  if (!selectedCase) return null;

  const requestExamination = async () => {
    if (!requestText.trim()) {
      Alert.alert('Request', 'Please type what you would like to examine.');
      return;
    }
    if (requesting) return;
    setRequesting(true); addConversationEntry({ sender: 'Student', text: requestText });
    try {
      const res = await caseApi.requestExamination(selectedCase.id, requestText.trim());
      if (examinationsRequested.includes(res.id)) addConversationEntry({ sender: 'Examiner', text: 'Already requested: ' + res.findings });
      else { setExaminationsRequested(prev => [...prev, res.id]); addConversationEntry({ sender: 'Examiner', text: res.findings }); }
      setRequestText('');
    } catch (error) {
      addConversationEntry({ sender: 'Tutor', text: error.status === 404 ? 'Could you be more specific about which examination you mean?' : 'Unable to retrieve examination findings. Your request remains saved.' });
    } finally { setRequesting(false); }
  };

  const handleContinue = () => {
    navigation.navigate('InitialDiagnosis');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="examination" />
      <Text style={styles.title}>Physical Examination</Text>
      <Text style={styles.subtitle}>What examination would you like to perform?</Text>

      <View style={styles.askBox}>
        <TextInput placeholder="Type examination request (e.g., 'Examine the chest')" value={requestText} onChangeText={setRequestText} style={styles.input} />
        <TouchableOpacity disabled={requesting} onPress={requestExamination} style={[styles.askBtn, requesting && { opacity: 0.6 }]}>
          <Text style={{ color: '#fff' }}>{requesting ? 'Requesting…' : 'Request Examination'}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 18 }}>
        <Text style={{ color: COLORS.muted, marginBottom: 8 }}>Conversation</Text>
        {conversation.map((msg, idx) => (
          <View key={idx} style={[styles.card, msg.sender === 'Student' ? styles.studentMsg : styles.patientMsg]}>
            <Text style={{ fontWeight: '700', color: COLORS.text }}>{msg.sender}</Text>
            <Text style={{ color: COLORS.muted, marginTop: 6 }}>{msg.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue to Clinical Reasoning</Text>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#E8F5EF'
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  areaTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  areaTitleSelected: { color: COLORS.primary },
  selectText: { color: COLORS.muted },
  selectTextSelected: { color: COLORS.primary, fontWeight: '700' },
  areaText: { color: COLORS.muted, marginTop: 12, lineHeight: 22 },
  askBox: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  input: { flex: 1, backgroundColor: COLORS.card, padding: 12, borderRadius: 8, marginRight: 8, color: COLORS.text },
  askBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  studentMsg: { backgroundColor: '#E8F5FF' },
  patientMsg: { backgroundColor: '#F0FFF4' },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10
  },
  continueText: { color: COLORS.white, fontWeight: '700' }
});

export default ExaminationScreen;
