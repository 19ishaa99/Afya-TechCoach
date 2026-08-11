import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const QuestionOption = ({ option, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.option, selected && styles.selectedOption]}
      activeOpacity={0.85}
    >
      <Text style={[styles.optionText, selected && styles.selectedText]}>{option}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  selectedOption: {
    backgroundColor: '#E8F5EF',
    borderColor: COLORS.primary
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16
  },
  selectedText: {
    color: COLORS.primary,
    fontWeight: '700'
  }
});

export default QuestionOption;
