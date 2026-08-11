import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import QuestionOption from '../../components/student/QuestionOption';

const QuestionScreen = ({ route, navigation }) => {
  const { scenario } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const question = scenario.questions[currentIndex];

  const stageLabels = ['Assessment', 'Diagnosis', 'Management', 'Review', 'Debrief'];
  const currentStage = stageLabels[currentIndex] || 'Clinical Reasoning';

  const onNext = () => {
    if (!selected) {
      Alert.alert('Please select an option', 'Choose the answer that best fits the case.');
      return;
    }

    const nextScore = score + (selected === question.correctAnswer ? 1 : 0);

    if (currentIndex < scenario.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setScore(nextScore);
      return;
    }

    navigation.navigate('SimulationResult', {
      scenario,
      score: nextScore,
      total: scenario.questions.length
    });
  };

  const onPrevious = () => {
    if (currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
    setSelected(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / scenario.questions.length) * 100}%` }]} />
      </View>
      <Text style={styles.questionMeta}>{currentStage}</Text>
      <Text style={styles.questionSubText}>{`Question ${currentIndex + 1} of ${scenario.questions.length}`}</Text>
      <Text style={styles.questionText}>{question.question}</Text>
      {question.options.map(option => (
        <QuestionOption
          key={option}
          option={option}
          selected={selected === option}
          onPress={() => setSelected(option)}
        />
      ))}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.navButton, currentIndex === 0 && styles.disabledButton]} onPress={onPrevious} disabled={currentIndex === 0}>
          <Text style={[styles.navText, currentIndex === 0 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={onNext}>
          <Text style={styles.navText}>{currentIndex === scenario.questions.length - 1 ? 'Submit' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 14
  },
  progressFill: {
    height: 10,
    backgroundColor: COLORS.primary
  },
  questionMeta: { color: COLORS.secondary, marginBottom: 6, fontWeight: '700' },
  questionSubText: { color: COLORS.muted, marginBottom: 8 },
  questionText: { fontSize: 20, fontWeight: '700', marginBottom: 18, color: COLORS.text },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  navButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    flex: 0.48,
    alignItems: 'center'
  },
  navText: { color: COLORS.white, fontWeight: '700' },
  disabledButton: { backgroundColor: '#BDBDBD' },
  disabledText: { color: '#F5F5F5' }
});

export default QuestionScreen;
