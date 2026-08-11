import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const LoadingSpinner = ({ size = 'large' }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={COLORS.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LoadingSpinner;
