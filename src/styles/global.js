import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4
  },
  title: {
    fontSize: SIZES.h1,
    color: COLORS.text,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: SIZES.h2,
    color: COLORS.muted,
    marginTop: 6
  }
});
