import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import SimulationCard from '../../components/student/SimulationCard';
import ScoreCard from '../../components/student/ScoreCard';
import { scenarios } from '../../constants/mockData';

const StudentDashboardScreen = ({ navigation }) => {
  const todayCase = scenarios[0];
  const recommended = scenarios.slice(1, 4);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, Student</Text>
          <Text style={styles.subtitle}>Ready to sharpen your clinical reasoning?</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications-none" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={24} color={COLORS.white} />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Clinical Case</Text>
        <Text style={styles.caseTitle}>{todayCase.title}</Text>
        <Text style={styles.caseSubtitle}>{todayCase.specialty} • {todayCase.difficulty}</Text>
        <Text style={styles.caseDescription}>{todayCase.description}</Text>
        <View style={styles.caseFooter}>
          <Text style={styles.caseStat}>{todayCase.estimatedTime}</Text>
          <Text style={styles.caseStat}>{todayCase.questionCount} questions</Text>
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={() => navigation.navigate('ScenarioIntro', { scenario: todayCase })}>
          <Text style={styles.continueText}>Start Today's Case</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress Summary</Text>
        <View style={styles.summaryRow}>
          <ScoreCard label="Overall Progress" value="78%" />
          <ScoreCard label="Completed" value="12" />
        </View>
        <View style={styles.summaryRow}>
          <ScoreCard label="Average Score" value="84%" />
          <ScoreCard label="Streak" value="5 days" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Start</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('SimulationList')}>
          <MaterialIcons name="play-circle-outline" size={28} color={COLORS.primary} />
          <Text style={styles.actionTitle}>Start New Simulation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>
          <MaterialIcons name="history" size={28} color={COLORS.secondary} />
          <Text style={styles.actionTitle}>Continue Simulation</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recommended for You</Text>
      {recommended.map(item => (
        <SimulationCard
          key={item.id}
          scenario={item}
          onStart={() => navigation.navigate('ScenarioIntro', { scenario: item })}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  greeting: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  subtitle: { marginTop: 6, color: COLORS.muted },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: COLORS.text },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  },
  caseTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 10 },
  caseSubtitle: { color: COLORS.secondary, marginTop: 6 },
  caseDescription: { color: COLORS.muted, marginTop: 10, lineHeight: 22 },
  caseFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  caseStat: { color: COLORS.muted },
  actionTitle: { marginTop: 10, fontWeight: '700', color: COLORS.text, textAlign: 'center' }
});

export default StudentDashboardScreen;
