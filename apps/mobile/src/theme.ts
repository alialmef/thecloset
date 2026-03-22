// ─── Colors ──────────────────────────────────────────

export const colors = {
  // Primary
  black: '#000000',
  white: '#FFFFFF',

  // Brand
  primary: '#1A1A2E',
  primaryLight: '#16213E',
  accent: '#E94560',
  accentLight: '#FF6B81',

  // Grays
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',
  info: '#2196F3',
  infoLight: '#E3F2FD',

  // Status
  available: '#4CAF50',
  lent: '#FF9800',
  unavailable: '#9E9E9E',

  // Background
  background: '#FFFFFF',
  backgroundSecondary: '#FAFAFA',
  card: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

// ─── Typography ──────────────────────────────────────

export const typography = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// ─── Spacing ─────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
} as const;

// ─── Border Radius ───────────────────────────────────

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

// ─── Shadows ─────────────────────────────────────────

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

// ─── Layout ──────────────────────────────────────────

export const layout = {
  screenPadding: spacing.lg,
  cardPadding: spacing.lg,
  itemGridGap: spacing.sm,
  itemGridColumns: 3,
  tabBarHeight: 85,
  headerHeight: 56,
} as const;
