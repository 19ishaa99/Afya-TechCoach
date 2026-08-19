import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthCard, AuthLayout, BrandBlock, Checkbox, FormInput, InlineError, PasswordInput, PrimaryButton } from '../../components/auth/AuthComponents';
import { COLORS, SPACING } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    const next = {};
    if (!email.trim()) next.email = 'Please enter your email address.';
    else if (!emailPattern.test(email.trim())) next.email = 'Please enter a valid email address.';
    if (!password) next.password = 'Please enter your password.';
    setErrors(next); setMessage('');
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await signIn({ email: email.trim().toLowerCase(), password }, remember);
    } catch (error) {
      setMessage(error.status === 401 ? 'The email or password is incorrect.' : error.status === 422 ? 'Please check your email address and password.' : 'Unable to connect to the server. Make sure the backend is running.');
    } finally { setLoading(false); }
  };

  return <AuthLayout><AuthCard circular>
    <BrandBlock compact />
    <Text style={styles.title}>Welcome Back</Text>
    <Text style={styles.subtitle}>Continue building confident clinical decisions.</Text>
    <InlineError message={message} />
    <FormInput label="Email address" icon="mail-outline" required value={email} onChangeText={value => { setEmail(value); setErrors(current => ({ ...current, email: '' })); }} error={errors.email} placeholder="student@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="next" />
    <PasswordInput label="Password" required value={password} onChangeText={value => { setPassword(value); setErrors(current => ({ ...current, password: '' })); }} error={errors.password} placeholder="Enter your password" autoComplete="current-password" returnKeyType="done" onSubmitEditing={submit} />
    <View style={styles.options}>
      <Checkbox checked={remember} onPress={() => setRemember(value => !value)}>Remember me</Checkbox>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}><Text style={styles.link}>Forgot password?</Text></TouchableOpacity>
    </View>
    <PrimaryButton title="Login" onPress={submit} loading={loading} />
    <View style={styles.footer}><Text style={styles.footerText}>Don’t have an account? </Text><TouchableOpacity onPress={() => navigation.navigate('Register')}><Text style={styles.linkStrong}>Create Account</Text></TouchableOpacity></View>
    <View style={styles.secure}><MaterialIcons name="verified-user" size={15} color={COLORS.secondary} /><Text style={styles.secureText}>Your learning data is protected</Text></View>
  </AuthCard></AuthLayout>;
}

const styles = StyleSheet.create({
  title: { color: COLORS.navy, fontSize: 28, fontWeight: '800', textAlign: 'center' }, subtitle: { color: COLORS.muted, textAlign: 'center', lineHeight: 20, marginTop: SPACING.xs, marginBottom: SPACING.xl },
  options: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm }, link: { color: COLORS.primary, fontWeight: '600' }, footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: SPACING.xl },
  footerText: { color: COLORS.muted }, linkStrong: { color: COLORS.primary, fontWeight: '800' }, secure: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.lg }, secureText: { color: COLORS.muted, fontSize: 12 }
});
