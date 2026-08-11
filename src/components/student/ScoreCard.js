import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

const ScoreCard = ({ label, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: SIZES.radius,
    marginRight: 10,
    minHeight: 110,
    justifyContent: 'center'
  },
  value: {
    fontSize: 26,
    color: COLORS.white,
    fontWeight: '700'
  },
  label: {
    marginTop: 8,
    color: COLORS.white,
    fontSize: 14
  }
});

export default ScoreCard;
