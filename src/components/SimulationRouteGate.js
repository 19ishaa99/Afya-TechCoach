import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING } from '../constants';
import { useSimulation } from '../context/SimulationContext';

export const withSimulationRecovery = Screen => function SimulationRecovery(props) {
  const { route, navigation } = props;
  const { attemptId, selectedCase, currentStep, isRestoringSimulation, resumeAttempt, setCurrentStep } = useSimulation();
  const requestedId = route.params?.simulationId;
  const [error, setError] = useState('');
  const needsRemote = requestedId && requestedId !== attemptId;

  useEffect(() => {
    if (!isRestoringSimulation && needsRemote) {
      resumeAttempt(requestedId).catch(() => setError('This saved simulation is unavailable or you no longer have access to it.'));
    }
  }, [isRestoringSimulation, needsRemote, requestedId, resumeAttempt]);
  useEffect(() => {
    if (selectedCase && !needsRemote && currentStep !== route.name) setCurrentStep(route.name);
  }, [selectedCase, currentStep, needsRemote, route.name, setCurrentStep]);

  if (error) return <View style={styles.center}><Text style={styles.title}>Unable to restore simulation</Text><Text style={styles.text}>{error}</Text><TouchableOpacity style={styles.button} onPress={() => navigation.replace('StudentTabs', { screen: 'SimulationList' })}><Text style={styles.buttonText}>Return to Cases</Text></TouchableOpacity></View>;
  if (isRestoringSimulation || needsRemote || !selectedCase) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /><Text style={styles.text}>Restoring your clinical work…</Text></View>;
  return <Screen {...props} />;
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl, backgroundColor: COLORS.background },
  title: { color: COLORS.navy, fontSize: 22, fontWeight: '800', textAlign: 'center' }, text: { color: COLORS.muted, textAlign: 'center', marginTop: SPACING.md, lineHeight: 21 },
  button: { marginTop: SPACING.xl, backgroundColor: COLORS.primary, borderRadius: 16, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md }, buttonText: { color: COLORS.white, fontWeight: '800' }
});
