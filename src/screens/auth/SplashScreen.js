import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../../components/Logo';
import LoadingSpinner from '../../components/LoadingSpinner';
import { COLORS } from '../../constants';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Logo size={96} />
      <Text style={styles.title}>Afya TechCoach</Text>
      <Text style={styles.tagline}>Guided by Technology,{"\n"}Inspired to Heal</Text>
      <LoadingSpinner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 18,
    color: COLORS.text
  },
  tagline: {
    marginTop: 6,
    textAlign: 'center',
    color: COLORS.muted
  }
});

export default SplashScreen;
