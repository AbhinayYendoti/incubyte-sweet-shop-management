/**
 * Category definitions for UI
 * These are frontend-only categories since backend doesn't have category field
 */
export const categories = [
  { id: 'all', name: 'All Sweets', emoji: '🍬' },
  { id: 'mithai', name: 'Mithai', emoji: '🍮' },
  { id: 'ladoo', name: 'Ladoo', emoji: '🟠' },
  { id: 'barfi', name: 'Barfi', emoji: '🟫' },
  { id: 'halwa', name: 'Halwa', emoji: '🥣' },
  { id: 'namkeen', name: 'Namkeen', emoji: '🥨' }
] as const;

