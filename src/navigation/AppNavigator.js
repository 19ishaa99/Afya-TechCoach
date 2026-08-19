import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import StudentStackNavigator from './StudentStackNavigator';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, isRestoring } = useAuth();
  if (isRestoring) return <View style={styles.loading}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user
        ? <Stack.Screen name="StudentStack" component={StudentStackNavigator} />
        : <Stack.Screen name="AuthStack" component={AuthStack} />}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }
});

export default AppNavigator;
