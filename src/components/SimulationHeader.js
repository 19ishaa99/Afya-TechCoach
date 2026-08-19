import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants';
import { useSimulation } from '../context/SimulationContext';

const labels = { saving: 'Saving…', saved: 'Saved', error: 'Unable to save — Retry' };

export default function SimulationHeader({ navigation, route, options }) {
  const { selectedCase, saveStatus, saveDraft } = useSimulation();
  const goBack = async () => {
    await saveDraft();
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('StudentTabs', { screen: 'SimulationList' });
  };
  return <View style={styles.header}>
    <TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" hitSlop={10} onPress={goBack} style={styles.back}>
      <MaterialIcons name="arrow-back" size={24} color={COLORS.navy} />
    </TouchableOpacity>
    <View style={styles.center}>
      <Text numberOfLines={1} style={styles.title}>{options.title || route.name}</Text>
      {selectedCase ? <Text numberOfLines={1} style={styles.meta}>{selectedCase.specialty} · {selectedCase.difficulty}</Text> : null}
    </View>
    <TouchableOpacity disabled={saveStatus !== 'error'} onPress={() => saveDraft()} style={styles.statusWrap}>
      <Text style={[styles.status, saveStatus === 'error' && styles.error]}>{labels[saveStatus]}</Text>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  header: { minHeight: 66, paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, paddingBottom: SPACING.sm, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: COLORS.background },
  center: { flex: 1, minWidth: 0, paddingHorizontal: SPACING.sm }, title: { color: COLORS.navy, fontWeight: '800', fontSize: 16 }, meta: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  statusWrap: { minWidth: 70, alignItems: 'flex-end' }, status: { color: COLORS.success, fontSize: 12, fontWeight: '600' }, error: { color: COLORS.error }
});
