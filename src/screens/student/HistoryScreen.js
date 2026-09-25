import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { COLORS, SIZES } from '../../constants';
import SimulationProgress from '../../components/SimulationProgress';
import { useSimulation } from '../../context/SimulationContext';
import { caseApi } from '../../api/caseApi';

const HistoryScreen = ({ navigation }) => {
  const {
    selectedCase,
    historySectionsViewed,
    setHistorySectionsViewed,
    conversation,
    addConversationEntry
  } = useSimulation();

  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);

  if (!selectedCase) return null;

  const askQuestion = async () => {
    const cleanQuestion = question.trim();

    if (!cleanQuestion) {
      Alert.alert('Question', 'Please type a question');
      return;
    }

    if (asking) return;

    setAsking(true);

    addConversationEntry({
      sender: 'Student',
      text: cleanQuestion
    });

    try {
      const res = await caseApi.askHistory(
        selectedCase.id,
        cleanQuestion
      );

      if (res.needs_clarification) {
        addConversationEntry({
          sender: 'Tutor',
          text:
            res.clarification_prompt ||
            'Could you be more specific about what you would like to know?',
          correctedText: res.corrected_question,
          originalText: cleanQuestion
        });
      } else {
        addConversationEntry({
          sender: 'Patient',
          text: res.patient_response,
          correctedText: res.corrected_question,
          originalText: cleanQuestion
        });

        if (res.matched_history_item_id) {
          setHistorySectionsViewed(prev =>
            prev.includes(res.matched_history_item_id)
              ? prev
              : [...prev, res.matched_history_item_id]
          );
        }
      }

      setQuestion('');
    } catch (error) {
      console.warn(
        'Ask patient failed:',
        error?.message || error
      );

      addConversationEntry({
        sender: 'Tutor',
        text:
          error?.message ||
          'I could not reach the patient service. Your question is saved; check your connection and try again.'
      });
    } finally {
      setAsking(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <SimulationProgress activeStage="history" />

        <Text style={styles.title}>
          History Taking
        </Text>

        <Text style={styles.subtitle}>
          Ask the patient focused questions to obtain information.
        </Text>

        <View style={styles.askBox}>
          <TextInput
            placeholder="Ask the patient a question..."
            placeholderTextColor={COLORS.muted}
            value={question}
            onChangeText={setQuestion}
            style={styles.input}
            editable={!asking}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={askQuestion}
            autoCorrect
            autoCapitalize="sentences"
          />

          <TouchableOpacity
            disabled={asking}
            activeOpacity={0.7}
            onPress={askQuestion}
            style={[
              styles.askBtn,
              asking && styles.disabledButton
            ]}
          >
            <Text style={styles.askBtnText}>
              {asking ? 'Asking…' : 'Ask Patient'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.conversationSection}>
          <Text style={styles.conversationTitle}>
            Conversation
          </Text>

          {conversation.map((msg, idx) => (
            <View
              key={`${idx}-${msg.time || ''}`}
              style={[
                styles.card,
                msg.sender === 'Student'
                  ? styles.studentMsg
                  : styles.patientMsg
              ]}
            >
              <Text style={styles.sender}>
                {msg.sender}
              </Text>

              <Text style={styles.message}>
                {msg.text}
              </Text>

              {msg.correctedText &&
              msg.correctedText !== msg.originalText ? (
                <Text style={styles.guidance}>
                  Clearer wording: {msg.correctedText}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.continueButton}
          onPress={() => navigation.navigate('Examination')}
        >
          <Text style={styles.continueText}>
            Continue to Examination
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  content: {
    flexGrow: 1,
    padding: SIZES.padding,
    paddingBottom: 40
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8
  },

  subtitle: {
    color: COLORS.muted,
    marginBottom: 18
  },

  askBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },

  input: {
    flex: 1,
    minHeight: 50,
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },

  askBtn: {
    minHeight: 50,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },

  askBtnText: {
    color: '#fff',
    fontWeight: '700'
  },

  disabledButton: {
    opacity: 0.6
  },

  conversationSection: {
    marginTop: 18
  },

  conversationTitle: {
    color: COLORS.muted,
    marginBottom: 8
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },

  studentMsg: {
    backgroundColor: '#E8F5FF'
  },

  patientMsg: {
    backgroundColor: '#F0FFF4'
  },

  sender: {
    fontWeight: '700',
    color: COLORS.text
  },

  message: {
    color: COLORS.muted,
    marginTop: 6
  },

  guidance: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic'
  },

  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    minHeight: 54,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },

  continueText: {
    color: COLORS.white,
    fontWeight: '700'
  }
});

export default HistoryScreen;