export const colors = {
  background: '#0B151D',
  surface: '#0B151D',
  surfaceLight: 'rgba(254, 245, 230, 0.08)',
  primary: '#FF7223',
  primaryDark: '#FEBE0F',
  secondary: '#FFA4BF',
  accent: '#02AF77',
  text: '#FEF5E6',
  textSecondary: 'rgba(254, 245, 230, 0.78)',
  textMuted: 'rgba(254, 245, 230, 0.55)',
  border: 'rgba(254, 245, 230, 0.14)',
  error: '#FF7223',
  success: '#02AF77',
  warning: '#FEBE0F',
  cardBackground: 'rgba(254, 245, 230, 0.06)',
  inputBackground: 'rgba(254, 245, 230, 0.07)',
  tabBarBackground: '#0B151D',
  tabBarBorder: 'rgba(254, 245, 230, 0.14)',
};

export const gradients = {
  primary: 'linear-gradient(135deg, #FEBE0F 0%, #FF7223 100%)',
  primaryGlow: 'linear-gradient(135deg, #FEBE0F 0%, #FF7223 100%)',
  backgroundTop: 'radial-gradient(ellipse at 50% 0%, rgba(254, 190, 15, 0.16) 0%, #0B151D 60%)',
  pink: 'linear-gradient(135deg, #FFA4BF 0%, #FF7223 100%)',
  turquoise: 'linear-gradient(135deg, #02AF77 0%, #4E8ABC 100%)',
  card: 'linear-gradient(135deg, rgba(78, 138, 188, 0.20) 0%, rgba(11, 21, 29, 0.92) 60%)',
  cardOrange: 'linear-gradient(135deg, rgba(255, 114, 35, 0.35) 0%, rgba(11, 21, 29, 0.92) 60%)',
  cardPink: 'linear-gradient(135deg, rgba(255, 164, 191, 0.28) 0%, rgba(11, 21, 29, 0.92) 60%)',
  cardTurquoise: 'linear-gradient(135deg, rgba(2, 175, 119, 0.30) 0%, rgba(11, 21, 29, 0.92) 60%)',
  cardPurple: 'linear-gradient(135deg, rgba(78, 138, 188, 0.30) 0%, rgba(11, 21, 29, 0.92) 60%)',
  tabBar: 'linear-gradient(135deg, #0B151D 0%, rgba(255, 114, 35, 0.22) 100%)',
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

const gradientText: React.CSSProperties = {
  background: 'linear-gradient(120deg, #FEBE0F 0%, #FF7223 45%, #FFA4BF 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    ...gradientText,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  h2: {
    fontSize: 22,
    fontWeight: '800' as const,
    ...gradientText,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    ...gradientText,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  h2Gradient: {
    fontSize: 22,
    fontWeight: '800' as const,
    ...gradientText,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  h3Gradient: {
    fontSize: 18,
    fontWeight: '700' as const,
    ...gradientText,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  body: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.text,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textSecondary,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textMuted,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: colors.text,
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
};

export const shadows = {
  sm: '0 2px 4px rgba(0, 0, 0, 0.25)',
  md: '0 4px 8px rgba(0, 0, 0, 0.3)',
  lg: '0 4px 12px rgba(108, 99, 255, 0.15)',
};
