import React from 'react';
import { View, Text, Image, StyleSheet, Linking } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { COLORS } from '../../constants';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.illustration} />
      <Text style={styles.title}>Welcome to Afya TechCoach</Text>
      <Text style={styles.description}>Practice clinical reasoning through realistic AI-assisted patient simulations.</Text>

      <PrimaryButton title="Login" onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }} />
      <SecondaryButton title="Create Account" onPress={() => navigation.navigate('Register')} style={{ marginTop: 12 }} />
      <SecondaryButton title="Continue as Guest (Disabled)" onPress={() => {}} disabled style={{ marginTop: 12 }} />

      <Text style={styles.privacy} onPress={() => Linking.openURL('https://example.com/privacy')}>Privacy Policy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center'
  },
  illustration: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center'
  },
  description: {
    textAlign: 'center',
    color: COLORS.muted,
    marginTop: 8
  },
  privacy: {
    marginTop: 18,
    color: COLORS.secondary
  }
});

export default WelcomeScreen;
