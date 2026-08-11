import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../../components/CustomInput';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import { COLORS } from '../../constants';
import { registerUser } from '../../constants/authStore';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role] = useState('Student');
  const [accepted, setAccepted] = useState(false);

  const onCreate = () => {
    if (!fullName || !university || !regNo || !email) {
      Alert.alert('Validation', 'Please fill required fields');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Validation', 'Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Validation', 'Passwords do not match');
      return;
    }
    if (!accepted) {
      Alert.alert('Validation', 'Please accept terms and conditions');
      return;
    }

    const result = registerUser({
      fullName,
      university,
      registrationNumber: regNo,
      email,
      password,
      role: 'Student'
    });

    if (!result.success) {
      Alert.alert('Registration Error', result.message);
      return;
    }

    const rootNavigation = navigation.getParent();
    Alert.alert('Registration successful', 'Your account has been created.', [
      {
        text: 'Continue to dashboard',
        onPress: () => {
          if (rootNavigation) {
            rootNavigation.replace('StudentStack');
          } else {
            navigation.replace('StudentStack');
          }
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <CustomInput label="Full Name" value={fullName} onChangeText={setFullName} placeholder="Khadija Ali Said" />
        <CustomInput label="University" value={university} onChangeText={setUniversity} placeholder="University Name" />
        <CustomInput label="Registration Number" value={regNo} onChangeText={setRegNo} placeholder="Reg#" />
        <CustomInput label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <PasswordInput value={password} onChangeText={setPassword} placeholder="Password" />
        <PasswordInput value={confirm} onChangeText={setConfirm} placeholder="Confirm Password" />

        {/* Role is fixed to Student for public registration */}

        <TouchableOpacity onPress={() => setAccepted(a => !a)} style={styles.terms}>
          <View style={[styles.box, accepted && styles.boxChecked]} />
          <Text style={styles.termsText}>Accept Terms and Conditions</Text>
        </TouchableOpacity>

        <PrimaryButton title="Create Account" onPress={onCreate} style={{ marginTop: 18 }} />

        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: COLORS.text },
  row: { marginTop: 12 },
  roleBox: { flexDirection: 'row', marginTop: 8 },
  rolePill: { padding: 8, borderRadius: 8, backgroundColor: COLORS.card, marginRight: 8 },
  roleActive: { backgroundColor: COLORS.primary },
  roleText: { color: COLORS.text },
  roleTextActive: { color: COLORS.white },
  terms: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  box: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#E0E0E0', marginRight: 8 },
  boxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsText: { color: COLORS.muted },
  footer: { flexDirection: 'row', marginTop: 18 }
});

export default RegisterScreen;
