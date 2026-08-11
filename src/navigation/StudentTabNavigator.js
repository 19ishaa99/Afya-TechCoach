import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import StudentDashboardScreen from '../screens/student/StudentDashboardScreen';
import SimulationListScreen from '../screens/student/SimulationListScreen';
import ProgressScreen from '../screens/student/ProgressScreen';
import HistoryScreen from '../screens/student/CaseHistoryScreen';
import StudentProfileScreen from '../screens/student/StudentProfileScreen';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator();

const tabOptions = (icon, label) => ({
  tabBarIcon: ({ color, size }) => <MaterialIcons name={icon} size={size} color={color} />,
  tabBarLabel: label,
  headerShown: false
});

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { backgroundColor: COLORS.white, borderTopWidth: 0, elevation: 8, height: 70, paddingBottom: 8, paddingTop: 8 }
      }}
    >
      <Tab.Screen name="StudentDashboard" component={StudentDashboardScreen} options={tabOptions('home', 'Home')} />
      <Tab.Screen name="SimulationList" component={SimulationListScreen} options={tabOptions('medical-services', 'Cases')} />
      <Tab.Screen name="Progress" component={ProgressScreen} options={tabOptions('bar-chart', 'Progress')} />
      <Tab.Screen name="History" component={HistoryScreen} options={tabOptions('history', 'History')} />
      <Tab.Screen name="Profile" component={StudentProfileScreen} options={tabOptions('person', 'Profile')} />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;
