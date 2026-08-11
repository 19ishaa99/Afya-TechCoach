import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';

const HistoryScreen = ({ navigation }) => {
  const { selectedCase, historySectionsViewed, setHistorySectionsViewed, conversation, addConversationEntry } = useSimulation();
  const [question, setQuestion] = useState('');

  if (!selectedCase) return null;

  const askQuestion = () => {
    if (!question.trim()) {
      Alert.alert('Question', 'Please type a question');
      return;
    }
    // record student's question
    addConversationEntry({ sender: 'Student', text: question });
    const { matchHistoryQuestion } = require('../../utils/matchingUtils');
    const res = matchHistoryQuestion(question, selectedCase);
    if (!res) {
      addConversationEntry({ sender: 'Patient', text: 'Could you be more specific about what you would like to know?' });
      setQuestion('');
      return;
    }
    // reveal the matched answer and mark section viewed
    addConversationEntry({ sender: 'Patient', text: res.answer });
    if (res.id) setHistorySectionsViewed(prev => (prev.includes(res.id) ? prev : [...prev, res.id]));
    setQuestion('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SimulationProgress activeStage="history" />
      <Text style={styles.title}>History Taking</Text>
      <Text style={styles.subtitle}>Ask the patient focused questions to obtain information.</Text>

      <View style={styles.askBox}>
        <TextInput
          placeholder="Ask the patient a question..."
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
        />
        <TouchableOpacity onPress={askQuestion} style={styles.askBtn}>
          <Text style={{ color: '#fff' }}>Ask Patient</Text>
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

      <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('Examination')}>
        <Text style={styles.continueText}>Continue to Examination</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 12 },
  sectionAction: { color: COLORS.primary, fontWeight: '700' },
  sectionText: { color: COLORS.muted, marginTop: 12, lineHeight: 22 },
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

export default HistoryScreen;
