/**
 * Tokenizes text into words and punctuation.
 * Preserves spaces and punctuation as separate tokens when needed.
 * 
 * @param {string} text - The text to tokenize
 * @returns {string[]} Array of word tokens
 */
export function tokenize(text) {
  if (!text) return [];
  
  // Split by whitespace but keep the text structure
  // This simple approach splits on spaces
  return text.split(/\s+/).filter(token => token.length > 0);
}

/**
 * Gets a random index from visible (non-hidden) words
 * 
 * @param {number} totalWords - Total number of words
 * @param {number[]} hiddenIndices - Array of currently hidden word indices
 * @returns {number|null} Random visible word index, or null if all are hidden
 */
export function getRandomVisibleIndex(totalWords, hiddenIndices = []) {
  const visibleIndices = [];
  
  for (let i = 0; i < totalWords; i++) {
    if (!hiddenIndices.includes(i)) {
      visibleIndices.push(i);
    }
  }
  
  if (visibleIndices.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * visibleIndices.length);
  return visibleIndices[randomIndex];
}
