/**
 * Helper function to map a fruit name to its corresponding emoji sticker.
 */
export const getFruitEmoji = (name) => {
  if (!name) return '🍏';
  const n = name.toLowerCase();
  if (n.includes('apel') || n.includes('apple')) return '🍎';
  if (n.includes('pisang') || n.includes('banana')) return '🍌';
  if (n.includes('jeruk') || n.includes('orange')) return '🍊';
  if (n.includes('anggur') || n.includes('grape')) return '🍇';
  if (n.includes('lemon')) return '🍋';
  if (n.includes('nanas') || n.includes('pineapple')) return '🍍';
  if (n.includes('mangga') || n.includes('mango')) return '🥭';
  if (n.includes('pir') || n.includes('pear')) return '🍐';
  if (n.includes('naga') || n.includes('dragon')) return '🐉';
  if (n.includes('lengkeng') || n.includes('longan')) return '🧆';
  if (n.includes('belimbing') || n.includes('starfruit')) return '⭐';
  return '🍏';
};
