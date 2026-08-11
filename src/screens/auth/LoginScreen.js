import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import CustomInput from '../../components/CustomInput';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import Divider from '../../components/Divider';
import { COLORS } from '../../constants';
import { authenticateUser } from '../../constants/authStore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const validate = () => {
    if (!email.includes('@')) {
      Alert.alert('Validation', 'Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const onLogin = () => {
    if (!validate()) return;

    const user = authenticateUser(email, password);
    if (!user) {
      Alert.alert('Login Failed', 'Email or password is incorrect.');
      return;
    }

    const rootNavigation = navigation.getParent();
    if (rootNavigation) {
      rootNavigation.replace('StudentStack');
    } else {
      navigation.replace('StudentStack');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <CustomInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <PasswordInput value={password} onChangeText={setPassword} placeholder="Password" />

        <View style={styles.row}>
          <TouchableOpacity onPress={() => setRemember(r => !r)} style={styles.checkbox}>
            <View style={[styles.box, remember && styles.boxChecked]} />
            <Text style={styles.remember}>Remember Me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton title="Login" onPress={onLogin} style={{ marginTop: 20 }} />

        <Divider text="OR" />

        <PrimaryButton title="Sign in with Google" onPress={() => Alert.alert('Google Sign-in (UI only)')} style={{ backgroundColor: COLORS.secondary }} />

        <View style={styles.footer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12, color: COLORS.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  checkbox: { flexDirection: 'row', alignItems: 'center' },
  box: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#E0E0E0', marginRight: 8 },
  boxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  remember: { color: COLORS.muted },
  forgot: { color: COLORS.secondary },
  footer: { flexDirection: 'row', marginTop: 18 }
});

export default LoginScreen;
