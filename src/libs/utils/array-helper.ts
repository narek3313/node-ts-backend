export class ArrayHelper {
    /**
     * Returns a new array of unique, normalized strings.
     * - Trims whitespace
     * - Converts to lowercase
     * - Removes empty strings
     *
     * @param from The array of strings to process
     * @returns A new array with unique, cleaned strings
     */
    static findUnique(from: string[]): string[] {
        const seen = new Set<string>();
        const result: string[] = [];

        for (const f of from) {
            const normalized = f.trim().toLowerCase();
            if (normalized && !seen.has(normalized)) {
                seen.add(normalized);
                result.push(normalized);
            }
        }

        return result;
    }

    /**
     * Merges two string arrays into a single array of unique, normalized strings.
     * - Combines all elements from both arrays
     * - Trims whitespace
     * - Converts to lowercase
     * - Removes empty strings
     * - Removes duplicates
     *
     * @param a The first array of strings
     * @param b The second array of strings
     * @returns A new array containing all unique, cleaned strings from both inputs
     */
    static merge(a: string[], b: string[]): string[] {
        return this.findUnique([...a, ...b]);
    }

    /**
     * Removes specified strings from an array of strings.
     * - Normalizes removal items: trims whitespace, converts to lowercase, ignores empty strings
     * - Returns a new array without the specified items
     *
     * @param from The original array of strings
     * @param i The array of strings to remove from `from`
     * @returns A new array containing all elements from `from` except those in `i`
     */
    static remove(from: string[], i: string[]): string[] {
        const removeSet = new Set(i.map((t) => t.trim().toLowerCase()).filter(Boolean));
        return from.filter((f) => !removeSet.has(f));
    }
}
