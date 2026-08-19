import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Logo from '../Logo';
import { COLORS, SHADOWS, SIZES, SPACING } from '../../constants';

export function AuthDecorations() {
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <View style={[styles.orb, styles.orbTop]} />
    <View style={[styles.orb, styles.orbBottom]} />
    <View style={styles.cross}><View style={styles.crossHorizontal} /><View style={styles.crossVertical} /></View>
  </View>;
}

export function BrandBlock({ compact = false, description }) {
  return <View style={[styles.brand, compact && styles.brandCompact]}>
    <Logo size={compact ? 58 : 76} />
    <Text style={[styles.brandName, compact && styles.brandNameCompact]}>Afya TechCoach</Text>
    <Text style={styles.tagline}>Guided by Technology, Inspired to Heal</Text>
    {description ? <Text style={styles.brandDescription}>{description}</Text> : null}
  </View>;
}

export function AuthLayout({ children, split = false, sideContent }) {
  const { width } = useWindowDimensions();
  const isWide = split && width >= 820;
  return <SafeAreaView style={styles.safeArea}>
    <AuthDecorations />
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <View style={[styles.shell, split && styles.splitShell, isWide && styles.splitShellWide]}>
          {sideContent ? <View style={[styles.side, !isWide && styles.sideCompact]}>{sideContent}</View> : null}
          <View style={[styles.formArea, split && styles.splitFormArea, isWide && styles.splitFormAreaWide]}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

export function AuthCard({ children, circular = false }) {
  return <View style={[styles.card, circular && styles.circularCard]}>{children}</View>;
}

export function InlineError({ message, success = false }) {
  if (!message) return null;
  return <View style={[styles.message, success && styles.successMessage]}>
    <MaterialIcons name={success ? 'check-circle' : 'error-outline'} size={18} color={success ? COLORS.success : COLORS.error} />
    <Text style={[styles.messageText, success && styles.successText]}>{message}</Text>
  </View>;
}

export function FormInput({ label, icon, error, required, inputRef, style, ...props }) {
  return <View style={[styles.field, style]}>
    <Text style={styles.label}>{label}{required ? <Text style={styles.required}> *</Text> : null}</Text>
    <View style={[styles.inputWrap, error && styles.inputError]}>
      <MaterialIcons name={icon} size={21} color={error ? COLORS.error : COLORS.primary} />
      <TextInput ref={inputRef} style={styles.input} placeholderTextColor="#91A1AD" {...props} />
    </View>
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>;
}

export function PasswordInput({ label = 'Password', error, required, ...props }) {
  const [visible, setVisible] = useState(false);
  return <View style={styles.field}>
    <Text style={styles.label}>{label}{required ? <Text style={styles.required}> *</Text> : null}</Text>
    <View style={[styles.inputWrap, error && styles.inputError]}>
      <MaterialIcons name="lock-outline" size={21} color={error ? COLORS.error : COLORS.primary} />
      <TextInput style={styles.input} placeholderTextColor="#91A1AD" secureTextEntry={!visible} {...props} />
      <TouchableOpacity accessibilityRole="button" accessibilityLabel={visible ? 'Hide password' : 'Show password'} onPress={() => setVisible(value => !value)} style={styles.eye}>
        <MaterialIcons name={visible ? 'visibility' : 'visibility-off'} size={21} color={COLORS.muted} />
      </TouchableOpacity>
    </View>
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>;
}

export function PrimaryButton({ title, loading, disabled, onPress }) {
  return <TouchableOpacity accessibilityRole="button" activeOpacity={0.85} onPress={onPress} disabled={disabled || loading} style={[styles.button, (disabled || loading) && styles.buttonDisabled]}>
    {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>{title}</Text>}
  </TouchableOpacity>;
}

export function Checkbox({ checked, onPress, children, error }) {
  return <TouchableOpacity accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} style={styles.checkboxRow}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked, error && styles.checkboxError]}>
      {checked ? <MaterialIcons name="check" size={16} color={COLORS.white} /> : null}
    </View>
    <Text style={styles.checkboxText}>{children}</Text>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  shell: { width: '100%', maxWidth: 520 }, splitShell: { maxWidth: 1060, borderRadius: 36, overflow: 'hidden', ...SHADOWS.card }, splitShellWide: { flexDirection: 'row' },
  side: { flex: 0.9, minHeight: 270, backgroundColor: COLORS.primary, padding: SPACING.xxl, justifyContent: 'center', overflow: 'hidden' },
  sideCompact: { flex: 0, minHeight: 210, padding: SPACING.xl }, formArea: { width: '100%' }, splitFormArea: { backgroundColor: COLORS.white, padding: SPACING.xl, justifyContent: 'center' }, splitFormAreaWide: { flex: 1.1 },
  card: { width: '100%', backgroundColor: COLORS.white, borderRadius: 34, borderWidth: 1, borderColor: '#D7EEEE', padding: SPACING.xl, ...SHADOWS.card },
  circularCard: { borderTopLeftRadius: 90, borderBottomRightRadius: 90, borderColor: '#B8E3E1', shadowColor: COLORS.primary },
  brand: { alignItems: 'center', marginBottom: SPACING.xl }, brandCompact: { marginBottom: SPACING.lg },
  brandName: { color: COLORS.white, fontSize: 28, fontWeight: '800', marginTop: SPACING.md },
  brandNameCompact: { color: COLORS.navy, fontSize: 23 }, tagline: { color: '#D9FFFA', textAlign: 'center', marginTop: SPACING.xs, fontSize: 13 },
  brandDescription: { color: '#E6FFFC', textAlign: 'center', lineHeight: 22, maxWidth: 360, marginTop: SPACING.xl },
  field: { marginBottom: SPACING.md }, label: { color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm, fontSize: 14 }, required: { color: COLORS.error },
  inputWrap: { height: SIZES.inputHeight, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.radiusSmall, backgroundColor: '#FBFDFE', paddingHorizontal: SPACING.md },
  input: { flex: 1, height: '100%', color: COLORS.text, fontSize: 16, outlineStyle: 'none' }, eye: { padding: SPACING.xs }, inputError: { borderColor: COLORS.error, backgroundColor: '#FFF8F8' },
  fieldError: { color: COLORS.error, fontSize: 12, marginTop: SPACING.xs },
  button: { height: SIZES.buttonHeight, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginTop: SPACING.md, ...SHADOWS.button },
  buttonDisabled: { opacity: 0.62 }, buttonText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  message: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, borderRadius: SIZES.radiusSmall, backgroundColor: '#FEF2F2', marginBottom: SPACING.md },
  successMessage: { backgroundColor: '#F0FDF4' }, messageText: { flex: 1, color: COLORS.error, fontSize: 13, lineHeight: 18 }, successText: { color: COLORS.success },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.xs, flexShrink: 1 }, checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.sm },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary }, checkboxError: { borderColor: COLORS.error }, checkboxText: { color: COLORS.muted, flexShrink: 1, lineHeight: 20 },
  orb: { position: 'absolute', borderRadius: 999, borderWidth: 2, borderColor: '#CDECEA', backgroundColor: '#E8F8F7' }, orbTop: { width: 240, height: 240, top: -100, right: -80 }, orbBottom: { width: 190, height: 190, bottom: -70, left: -60 },
  cross: { position: 'absolute', top: 65, left: 45, width: 36, height: 36, opacity: 0.18 }, crossHorizontal: { position: 'absolute', top: 13, width: 36, height: 10, borderRadius: 4, backgroundColor: COLORS.primary }, crossVertical: { position: 'absolute', left: 13, height: 36, width: 10, borderRadius: 4, backgroundColor: COLORS.primary }
});
