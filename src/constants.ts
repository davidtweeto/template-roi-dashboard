export const COLORS = {
  bg: '#0a1628',
  cardBg: 'rgba(10, 22, 45, 0.96)',
  green: '#22c55e',
  greenDim: 'rgba(34, 197, 94, 0.15)',
  greenGlow: 'rgba(34, 197, 94, 0.25)',
  amber: '#f59e0b',
  amberDim: 'rgba(245, 158, 11, 0.15)',
  cyan: '#38bdf8',
  cyanDim: 'rgba(56, 189, 248, 0.15)',
  red: '#ef4444',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: 'rgba(255,255,255,0.25)',
  border: 'rgba(255,255,255,0.08)',
} as const;

export const LAYOUT = {
  margin: 56,
  cardWidth: 306,
  cardGap: 24,
  cardTop: 370,
  cardHeight: 520,
  footerTop: 916,
} as const;

export const CARD_LEFT = {
  hard: LAYOUT.margin,
  operational: LAYOUT.margin + LAYOUT.cardWidth + LAYOUT.cardGap,
  strategic: LAYOUT.margin + (LAYOUT.cardWidth + LAYOUT.cardGap) * 2,
} as const;
