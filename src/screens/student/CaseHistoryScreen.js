import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const historyItems = [
  { title: 'Acute Appendicitis', specialty: 'Emergency Medicine', score: '85%', date: 'Aug 8, 2026', status: 'Completed' },
  { title: 'Pediatric Asthma', specialty: 'Pediatrics', score: '78%', date: 'Aug 5, 2026', status: 'Completed' },
  { title: 'Gestational Hypertension', specialty: 'Obstetrics & Gynecology', score: '81%', date: 'Aug 2, 2026', status: 'Completed' }
];

const HistoryScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>History</Text>
      {historyItems.map(item => (
        <View key={item.title} style={styles.card}>
          <View style={styles.row}><Text style={styles.itemTitle}>{item.title}</Text><Text style={styles.status}>{item.status}</Text></View>
          <Text style={styles.detail}>{item.specialty}</Text>
          <View style={styles.row}><Text style={styles.detail}>Score: {item.score}</Text><Text style={styles.detail}>{item.date}</Text></View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 18 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  status: { color: COLORS.secondary, fontWeight: '700' },
  detail: { color: COLORS.muted }
});

export default HistoryScreen;
