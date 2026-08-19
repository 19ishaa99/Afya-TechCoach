import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthLayout, BrandBlock, Checkbox, FormInput, InlineError, PasswordInput, PrimaryButton } from '../../components/auth/AuthComponents';
import { COLORS, SPACING } from '../../constants';
import { authApi } from '../../api/authApi';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ fullName: '', university: '', registrationNumber: '', email: '', password: '', confirmPassword: '' });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState({ message: '', success: false });
  const [loading, setLoading] = useState(false);
  const update = (key, value) => { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })); };

  const submit = async () => {
    if (loading) return;
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Please enter your full name.';
    if (!form.university.trim()) next.university = 'Please enter your university.';
    if (!form.registrationNumber.trim()) next.registrationNumber = 'Please enter your registration number.';
    if (!form.email.trim()) next.email = 'Please enter your email address.';
    else if (!emailPattern.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'The passwords do not match.';
    if (!accepted) next.terms = 'Please accept the Terms and Privacy Policy.';
    setErrors(next); setNotice({ message: '', success: false });
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await authApi.register({ full_name: form.fullName.trim(), email: form.email.trim().toLowerCase(), password: form.password, university: form.university.trim(), registration_number: form.registrationNumber.trim() });
      setNotice({ message: 'Your account was created successfully. You can now sign in.', success: true });
      setTimeout(() => navigation.replace('Login'), 1200);
    } catch (error) {
      setNotice({ message: error.status === 409 ? 'An account with this email already exists.' : error.status === 422 ? 'Please check the highlighted details and try again.' : 'Unable to connect to the server. Make sure the backend is running.', success: false });
    } finally { setLoading(false); }
  };

  return <AuthLayout split sideContent={<BrandBlock description="Practice realistic clinical cases, receive guided feedback, and grow your diagnostic confidence in one focused learning space." />}>
    <Text style={styles.title}>Create Student Account</Text><Text style={styles.subtitle}>Start your guided clinical learning journey.</Text>
    <InlineError message={notice.message} success={notice.success} />
    <FormInput label="Full name" icon="person-outline" required value={form.fullName} onChangeText={value => update('fullName', value)} error={errors.fullName} placeholder="Khadija Ali Said" autoComplete="name" />
    <FormInput label="Email address" icon="mail-outline" required value={form.email} onChangeText={value => update('email', value)} error={errors.email} placeholder="student@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
    <View style={styles.row}>
      <FormInput style={styles.half} label="University" icon="school" required value={form.university} onChangeText={value => update('university', value)} error={errors.university} placeholder="University name" />
      <FormInput style={styles.half} label="Registration no." icon="badge" required value={form.registrationNumber} onChangeText={value => update('registrationNumber', value)} error={errors.registrationNumber} placeholder="MED/2026/001" />
    </View>
    <PasswordInput label="Password" required value={form.password} onChangeText={value => update('password', value)} error={errors.password} placeholder="At least 8 characters" autoComplete="new-password" />
    <Text style={styles.guidance}>Use 8–128 characters. A longer, unique password is safer.</Text>
    <PasswordInput label="Confirm password" required value={form.confirmPassword} onChangeText={value => update('confirmPassword', value)} error={errors.confirmPassword} placeholder="Enter the password again" onSubmitEditing={submit} />
    <Checkbox checked={accepted} onPress={() => { setAccepted(value => !value); setErrors(current => ({ ...current, terms: '' })); }} error={errors.terms}>I agree to the Terms and Privacy Policy.</Checkbox>
    {errors.terms ? <Text style={styles.termsError}>{errors.terms}</Text> : null}
    <PrimaryButton title="Create Account" onPress={submit} loading={loading} disabled={notice.success} />
    <View style={styles.footer}><Text style={styles.footerText}>Already have an account? </Text><TouchableOpacity onPress={() => navigation.replace('Login')}><Text style={styles.link}>Login</Text></TouchableOpacity></View>
  </AuthLayout>;
}

const styles = StyleSheet.create({
  title: { color: COLORS.navy, fontSize: 28, fontWeight: '800' }, subtitle: { color: COLORS.muted, marginTop: SPACING.xs, marginBottom: SPACING.xl }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  half: { flex: 1, minWidth: 190 }, guidance: { color: COLORS.muted, fontSize: 12, marginTop: -SPACING.sm, marginBottom: SPACING.md }, termsError: { color: COLORS.error, fontSize: 12, marginTop: SPACING.xs },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: SPACING.xl }, footerText: { color: COLORS.muted }, link: { color: COLORS.primary, fontWeight: '800' }
});
