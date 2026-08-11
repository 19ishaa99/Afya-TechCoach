import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS } from '../../constants';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const onReset = () => {
    if (!email.includes('@')) {
      Alert.alert('Validation', 'Enter a valid email');
      return;
    }
    Alert.alert('Password Reset', 'If this were connected, a reset link would be sent.');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <CustomInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" />
      <PrimaryButton title="Reset Password" onPress={onReset} style={{ marginTop: 16 }} />
      <Text style={styles.back} onPress={() => navigation.goBack()}>Back to Login</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  back: { marginTop: 12, color: COLORS.secondary }
});

export default ForgotPasswordScreen;
