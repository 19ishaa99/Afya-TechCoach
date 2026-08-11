import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const PasswordInput = ({ value, onChangeText, placeholder }) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        secureTextEntry={!visible}
        style={styles.input}
      />
      <TouchableOpacity style={styles.icon} onPress={() => setVisible(v => !v)}>
        <MaterialIcons name={visible ? 'visibility' : 'visibility-off'} size={22} color={COLORS.muted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative'
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECEFF1'
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: 12
  }
});

export default PasswordInput;
