import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const InvestigationOption = ({ option, selected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.row}>
        <Text style={[styles.name, selected && styles.nameSelected]}>{option.name}</Text>
        <Text style={[styles.status, selected && styles.statusSelected]}>{selected ? 'Selected' : 'Select'}</Text>
      </View>
      {/* Brief descriptions are hidden to avoid revealing diagnostic hints before feedback */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#E8F5EF'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    marginRight: 12
  },
  nameSelected: {
    color: COLORS.primary
  },
  status: {
    color: COLORS.muted,
    fontSize: 12
  },
  statusSelected: {
    color: COLORS.primary,
    fontWeight: '700'
  },
  brief: {
    marginTop: 10,
    color: COLORS.muted,
    lineHeight: 20
  }
});

export default InvestigationOption;
