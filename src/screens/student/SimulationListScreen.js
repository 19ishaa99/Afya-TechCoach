import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import SimulationCard from '../../components/student/SimulationCard';
import { scenarios } from '../../constants/mockData';

const categories = ['All', 'Internal Medicine', 'Pediatrics', 'Surgery', 'Emergency Medicine', 'Obstetrics & Gynecology'];
const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

const SimulationListScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState('All');

  const filtered = scenarios.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.specialty === activeCategory;
    const matchesDifficulty = activeDifficulty === 'All' || item.difficulty === activeDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Clinical Simulations</Text>
      <View style={styles.searchRow}>
        <MaterialIcons name="search" size={22} color={COLORS.muted} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search simulations"
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.filterLabel}>Specialty</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.filterChip, activeCategory === category && styles.activeChip]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[styles.filterText, activeCategory === category && styles.activeFilterText]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.filterLabel}>Difficulty</Text>
      <View style={styles.difficultyRow}>
        {difficultyLevels.map(level => (
          <TouchableOpacity
            key={level}
            style={[styles.filterChip, activeDifficulty === level && styles.activeChip]}
            onPress={() => setActiveDifficulty(level)}
          >
            <Text style={[styles.filterText, activeDifficulty === level && styles.activeFilterText]}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.map(item => (
        <SimulationCard
          key={item.id}
          scenario={item}
          onStart={() => navigation.navigate('ScenarioIntro', { scenario: item })}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 18, color: COLORS.text },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  searchInput: { flex: 1, marginLeft: 10, color: COLORS.text },
  filterLabel: { fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  filterScroll: { marginBottom: 16 },
  difficultyRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  filterChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 10
  },
  activeChip: {
    backgroundColor: COLORS.primary
  },
  filterText: { color: COLORS.text },
  activeFilterText: { color: COLORS.white }
});

export default SimulationListScreen;
