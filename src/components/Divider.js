import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const Divider = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {text ? <Text style={styles.text}>{text}</Text> : null}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0'
  },
  text: {
    marginHorizontal: 8,
    color: COLORS.muted
  }
});

export default Divider;
