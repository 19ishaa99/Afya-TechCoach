import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const StudentProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}><MaterialIcons name="person" size={32} color={COLORS.primary} /></View>
        <View>
          <Text style={styles.name}>{user?.full_name || 'Student'}</Text>
          <Text style={styles.subText}>Medical Student</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.infoLabel}>Full Name</Text>
        <Text style={styles.infoValue}>{user?.full_name || 'Not provided'}</Text>
        <Text style={styles.infoLabel}>University</Text>
        <Text style={styles.infoValue}>{user?.university || 'Not provided'}</Text>
        <Text style={styles.infoLabel}>Registration Number</Text>
        <Text style={styles.infoValue}>{user?.registration_number || 'Not provided'}</Text>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
        <Text style={styles.infoLabel}>Role</Text>
        <Text style={styles.infoValue}>Student</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Preferences</Text>
        <Text style={styles.infoValue}>Clinical cases, guided review, spaced repetition</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Text style={styles.infoValue}>Email updates, progress reminders</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        <Text style={styles.infoValue}>Manage your data preferences and privacy settings.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        <Text style={styles.infoValue}>Contact support or access the knowledge base.</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#E8F5EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  name: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  subText: { color: COLORS.muted },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  infoLabel: { color: COLORS.muted, marginTop: 10 },
  infoValue: { color: COLORS.text, fontWeight: '700', marginTop: 4 },
  logoutButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8
  },
  logoutText: { color: COLORS.white, fontWeight: '700' }
});

export default StudentProfileScreen;
