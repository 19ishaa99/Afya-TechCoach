import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_KEY = 'afya_active_simulation_v1';

export const simulationStorage = {
  load: async () => {
    const value = await AsyncStorage.getItem(DRAFT_KEY);
    if (!value) return null;
    try { return JSON.parse(value); } catch (_) { return null; }
  },
  save: draft => AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft)),
  clear: () => AsyncStorage.removeItem(DRAFT_KEY)
};
