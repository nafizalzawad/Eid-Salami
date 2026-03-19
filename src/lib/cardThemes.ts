export interface CardTheme {
  id: string;
  name: string;
  bgGradient: [string, string, string];
  accentColor: string;
  secondaryColor: string;
  patternType: 'stars' | 'lanterns' | 'geometric' | 'floral' | 'modern' | 'alpona' | 'confetti';
  textColor: string;
  cardBg: string; // The inner card where amount is shown
  emoji: string;
  fontFamily: string;
}

const fonts = [
  'system-ui, sans-serif',
  '"Baloo 2", Arial, sans-serif',
  '"Nunito", Arial, sans-serif',
  '"Pacifico", cursive',
  '"Great Vibes", cursive'
];

export const CARD_THEMES: CardTheme[] = [
  // bKash inspired (1-10)
  {
    id: 'bkash-classic',
    name: 'bKash Classic',
    bgGradient: ['#E2136E', '#C0105D', '#9E0D4C'],
    accentColor: '#FFFFFF',
    secondaryColor: '#FFD700',
    patternType: 'alpona',
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: '💸',
    fontFamily: fonts[1],
  },
  {
    id: 'bkash-gold',
    name: 'bKash Gold',
    bgGradient: ['#E2136E', '#D4AF37', '#B8860B'],
    accentColor: '#FFFFFF',
    secondaryColor: '#FFFFFF',
    patternType: 'geometric',
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: '✨',
    fontFamily: fonts[1],
  },
  {
    id: 'bkash-joy',
    name: 'bKash Joy',
    bgGradient: ['#E2136E', '#F06292', '#EC407A'],
    accentColor: '#FFFFFF',
    secondaryColor: '#FFEB3B',
    patternType: 'confetti',
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: '🎉',
    fontFamily: fonts[3],
  },
  // Add more bKash variations...
  ...Array.from({ length: 7 }).map((_, i) => ({
    id: `bkash-var-${i}`,
    name: `bKash Style ${i + 4}`,
    bgGradient: ['#E2136E', '#D81B60', '#AD1457'] as [string, string, string],
    accentColor: '#FFFFFF',
    secondaryColor: i % 2 === 0 ? '#FFD700' : '#4CAF50',
    patternType: (['stars', 'geometric', 'modern'][i % 3]) as any,
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: (['🎁', '📱', '💳', '⭐'][i % 4]),
    fontFamily: fonts[i % 5],
  })),

  // Traditional Islamic (11-20)
  {
    id: 'islamic-royal-blue',
    name: 'Royal Islamic',
    bgGradient: ['#1A237E', '#283593', '#303F9F'],
    accentColor: '#D4AF37',
    secondaryColor: '#C0C0C0',
    patternType: 'lanterns',
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: '🏮',
    fontFamily: fonts[1],
  },
  {
    id: 'islamic-emerald',
    name: 'Emerald Mosque',
    bgGradient: ['#1B5E20', '#2E7D32', '#388E3C'],
    accentColor: '#D4AF37',
    secondaryColor: '#FFD700',
    patternType: 'stars',
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: '🌙',
    fontFamily: fonts[1],
  },
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `islamic-var-${i}`,
    name: `Traditional ${i + 3}`,
    bgGradient: (i % 2 === 0 ? ['#004D40', '#00695C', '#00796B'] : ['#3E2723', '#4E342E', '#5D4037']) as [string, string, string],
    accentColor: '#D4AF37',
    secondaryColor: '#FFFFFF',
    patternType: (['lanterns', 'stars', 'alpona'][i % 3]) as any,
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: (['🕌', '✨', '📖', '🤲'][i % 4]),
    fontFamily: fonts[1],
  })),

  // Festive/Vibrant (21-35)
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `festive-${i}`,
    name: `Festive Hue ${i + 1}`,
    bgGradient: (
      i % 3 === 0 ? ['#FF5722', '#F4511E', '#E64A19'] : 
      i % 3 === 1 ? ['#673AB7', '#5E35B1', '#512DA8'] : 
      ['#009688', '#00897B', '#00796B']
    ) as [string, string, string],
    accentColor: '#FFFFFF',
    secondaryColor: '#FFEB3B',
    patternType: (['confetti', 'modern', 'stars', 'geometric'][i % 4]) as any,
    textColor: '#FFFFFF',
    cardBg: '#FFFFFF',
    emoji: (['🔥', '🌈', '🍦', '🎈', '🍭'][i % 5]),
    fontFamily: fonts[i % 5],
  })),

  // Minimalist/Pastel (36-50+)
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `minimal-${i}`,
    name: `Clean Mint ${i + 1}`,
    bgGradient: (
      i % 3 === 0 ? ['#E0F2F1', '#B2DFDB', '#80CBC4'] : 
      i % 3 === 1 ? ['#F3E5F5', '#E1BEE7', '#CE93D8'] : 
      ['#FFF3E0', '#FFE0B2', '#FFCC80']
    ) as [string, string, string],
    accentColor: '#333333',
    secondaryColor: '#555555',
    patternType: (['modern', 'geometric', 'floral'][i % 3]) as any,
    textColor: '#333333',
    cardBg: '#FFFFFF',
    emoji: (['🌿', '🌸', '🍵', '☁️'][i % 4]),
    fontFamily: fonts[0],
  })),
];

export const getRandomTheme = () => {
  return CARD_THEMES[Math.floor(Math.random() * CARD_THEMES.length)];
};

export const getThemeById = (id: string) => {
  return CARD_THEMES.find(t => t.id === id) || CARD_THEMES[0];
};
