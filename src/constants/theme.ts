export const colors = {
  background: '#0D0D0D',
  surface: '#1A1A2E',
  surfaceLight: '#252542',
  primary: '#6C63FF',
  primaryDark: '#5A52D5',
  secondary: '#FF6584',
  accent: '#00D9A6',
  text: '#FFFFFF',
  textSecondary: '#B0B0C3',
  textMuted: '#6C6C80',
  border: '#2A2A45',
  error: '#FF4757',
  success: '#00D9A6',
  warning: '#FFA502',
  cardBackground: '#1E1E36',
  inputBackground: '#16162A',
  tabBarBackground: '#12121E',
  tabBarBorder: '#2A2A45',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: colors.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.text,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};
