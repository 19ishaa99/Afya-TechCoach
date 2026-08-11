import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';
import ScoreCard from '../../components/student/ScoreCard';

const SimulationResultScreen = ({ route, navigation }) => {
  const { scenario, score = 0, total = scenario.questions.length } = route.params;
  const incorrect = total - score;
  const percent = Math.round((score / total) * 100);
  const timeTaken = scenario.estimatedTime;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Simulation Complete</Text>
      <View style={styles.summaryRow}>
        <ScoreCard label="Score" value={`${score}%`} />
        <ScoreCard label="Time" value={timeTaken} />
      </View>
      <View style={styles.detailsCard}>
        <Text style={styles.detailText}>Correct Answers: {score}</Text>
        <Text style={styles.detailText}>Incorrect Answers: {incorrect}</Text>
        <Text style={styles.detailText}>Percentage: {percent}%</Text>
      </View>
      <View style={styles.feedbackCard}>
        <Text style={styles.sectionTitle}>Clinical Feedback</Text>
        <Text style={styles.feedbackText}>You completed a focused clinical case review and demonstrated practical reasoning across diagnosis and management.</Text>
        <Text style={styles.feedbackText}>Use the feedback below to strengthen your case interpretation and next-step selection.</Text>
        <Text style={styles.feedbackText}>{scenario.recommendedAfter}</Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('SimulationList')}>
        <Text style={styles.primaryText}>Try Another Simulation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('StudentDashboard')}>
        <Text style={styles.secondaryText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  detailsCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3
  },
  detailText: { color: COLORS.text, marginBottom: 8 },
  feedbackCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  feedbackText: { color: COLORS.muted, marginBottom: 10, lineHeight: 22 },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12
  },
  primaryText: { color: COLORS.white, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  secondaryText: { color: COLORS.primary, fontWeight: '700' }
});

export default SimulationResultScreen;
