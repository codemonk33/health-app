export const Theme = {
  colors: {
    primary: '#0166ED', // Brand Primary Blue from Spec
    secondary: '#8E44AD', // Brand Secondary Purple from Spec
    accentGreen: '#10B981', // Medical Success & Trust
    success: '#10B981',
    danger: '#EF4444',
    neutralText: '#000102', // Brand Body Text Color from Spec
    neutralSecondaryText: '#52525B', // Clean Subdued Body Color
    background: '#FFFDFE', // Brand Page Background Color from Spec
    surface: '#FFFFFF', // Clean White Cards
    border: '#E4E4E7',
    warning: '#F59E0B',
    purple: '#8E44AD',
  },
  typography: {
    fontFamily: {
      primary: 'CormorantGaramond_700Bold',
      serif: 'CormorantGaramond_700Bold',
      serifSemiBold: 'CormorantGaramond_600SemiBold',
      serifRegular: 'CormorantGaramond_400Regular',
      body: 'Manrope_400Regular',
      bodyMedium: 'Manrope_500Medium',
      bodySemiBold: 'Manrope_600SemiBold',
      bodyBold: 'Manrope_700Bold',
      bodyExtraBold: 'Manrope_800ExtraBold',
    },
    sizes: {
      caption: 12,
      small: 14, // Body 2
      body: 16, // Body 1 (1rem = 16px)
      h3: 20, // Heading 3
      h2: 24, // Heading 2
      h1: 28, // Heading 1
      hero: 36,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
    },
  },
  rounding: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
    pill: 999,
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
    button: {
      shadowColor: '#0166ED',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

