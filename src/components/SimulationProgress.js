import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const stages = [
  { id: 'intro', label: 'Case' },
  { id: 'presentation', label: 'Presentation' },
  { id: 'history', label: 'History' },
  { id: 'examination', label: 'Exam' },
  { id: 'initial', label: 'Impression' },
  { id: 'differential', label: 'Differential' },
  { id: 'investigation', label: 'Investigations' },
  { id: 'results', label: 'Results' },
  { id: 'final', label: 'Diagnosis' },
  { id: 'feedback', label: 'Feedback' }
];

const SimulationProgress = ({ activeStage }) => {
  return (
    <View style={styles.container}>
      {stages.map((stage, index) => {
        const isActive = stage.id === activeStage;
        const finishedIndex = stages.findIndex(s => s.id === activeStage);
        const isCompleted = finishedIndex > index;

        return (
          <View key={stage.id} style={styles.stepContainer}>
            <View
              style={[
                styles.dot,
                isActive && styles.activeDot,
                isCompleted && styles.completedDot
              ]}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>{stage.label}</Text>
            {index < stages.length - 1 && <View style={styles.line} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: 16
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0'
  },
  activeDot: {
    backgroundColor: COLORS.primary
  },
  completedDot: {
    backgroundColor: COLORS.secondary
  },
  label: {
    marginLeft: 8,
    marginRight: 10,
    color: COLORS.muted,
    fontSize: 12
  },
  activeLabel: {
    color: COLORS.text,
    fontWeight: '700'
  },
  line: {
    width: 14,
    height: 1,
    backgroundColor: '#E0E0E0'
  }
});

export default SimulationProgress;
