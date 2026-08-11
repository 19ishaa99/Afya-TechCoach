import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const Logo = ({ size = 56 }) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 6 }]}>
      <MaterialIcons name="local-hospital" size={size * 0.6} color={COLORS.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Logo;
