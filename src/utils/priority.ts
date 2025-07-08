export const HIGH_PRIORITY_KEYWORDS = new Set([
  'urgent',
  'asap',
  'important',
  'critical',
  'immediately',
  'now',
  'today',
  'high'
])

export const MEDIUM_PRIORITY_KEYWORDS = new Set([
  'soon',
  'normal',
  'medium',
  'later',
  'upcoming'
])

/**
 * Tokenises the input string into words (alphabetic sequences) and returns a
 * lower-cased array. Non-alphabetic characters are treated as delimiters.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zA-Z]+/)
    .filter(Boolean)
}

/**
 * Very lightweight, keyword-based priority estimator. It purposefully avoids
 * substring matching by operating on whole tokens so that e.g. "urgent" is not
 * found inside "purgent".
 *
 * Returns:
 *   2 – high priority
 *   1 – medium priority
 *   0 – low priority (default)
 */
export function getTaskPriority(text: string): number {
  const words = tokenize(text)

  for (const word of words) {
    if (HIGH_PRIORITY_KEYWORDS.has(word)) return 2
  }
  for (const word of words) {
    if (MEDIUM_PRIORITY_KEYWORDS.has(word)) return 1
  }
  return 0
} 