// Define arrays of prefixes for each level
const first_level_prefixes = ["PR1", "DS", "CS", "DSA", "DM", "PR2"];
const second_level_prefixes = ["ECO", "CLC", "DMA", "DTS", "OS", "FAD","ML"];
const third_level_prefixes = ["DVT","WP", "CN","VIS","DOE"];

/**
 * Checks if a quiz ID starts with a specific prefix
 * 
 * @param quizId - The quiz ID to check
 * @param prefix - The prefix to check for
 * @returns true if the quiz ID starts with the prefix, false otherwise
 */
export function hasQuizPrefix(quizId: string | undefined, prefix: string): boolean {
    if (!quizId) return false;
    return quizId.startsWith(prefix);
}

/**
 * Checks if a quiz ID starts with any prefix from a list
 * 
 * @param quizId - The quiz ID to check
 * @param prefixes - Array of prefixes to check against
 * @returns true if the quiz ID starts with any of the prefixes, false otherwise
 */
export function matchesAnyPrefix(quizId: string | undefined, prefixes: string[]): boolean {
    if (!quizId) return false;
    return prefixes.some(prefix => quizId.startsWith(prefix));
}

/**
 * Determines the quiz level based on its prefix
 * 
 * @param quizId - The quiz ID to check
 * @returns The determined level (1, 2, or 3)
 */
export function determineQuizLevel(quizId: string | undefined): number {
    if (quizId === undefined || quizId === null) return 1; // Default to level 1 if no quiz ID
    
    // Check prefix-based levels
    if (matchesAnyPrefix(quizId, first_level_prefixes)) return 1;
    if (matchesAnyPrefix(quizId, second_level_prefixes)) return 2;
    if (matchesAnyPrefix(quizId, third_level_prefixes)) return 3;

    // If no prefix match found, default to fourth level
    return 4;
}




