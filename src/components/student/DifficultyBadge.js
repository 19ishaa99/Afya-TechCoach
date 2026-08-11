import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const DifficultyBadge = ({ difficulty }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{difficulty}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#E8F5EF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  text: {
    color: COLORS.primary,
    fontWeight: '700'
  }
});

export default DifficultyBadge;
