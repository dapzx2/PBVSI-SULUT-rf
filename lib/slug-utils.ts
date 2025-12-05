/**
 * Utility functions for generating URL-friendly slugs
 */

/**
 * Convert text to URL-friendly slug
 * - Converts to lowercase
 * - Removes special characters
 * - Replaces spaces with hyphens
 * - Removes duplicate hyphens
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Remove duplicate hyphens
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate slug for a match
 * Format: home-team-vs-away-team-YYYYMMDD
 * Example: klub-1-vs-klub-2-20250930
 */
export function generateMatchSlug(
    homeTeamName: string,
    awayTeamName: string,
    matchDate: string | Date
): string {
    const homeSlug = slugify(homeTeamName);
    const awaySlug = slugify(awayTeamName);

    const date = typeof matchDate === 'string' ? new Date(matchDate) : matchDate;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    return `${homeSlug}-vs-${awaySlug}-${dateStr}`;
}

/**
 * Generate slug for a player
 * Format: player-name
 * Example: dava-ulus
 */
export function generatePlayerSlug(name: string): string {
    return slugify(name);
}

/**
 * Make slug unique by appending a number if needed
 * This is used when checking against existing slugs
 */
export function makeSlugUnique(baseSlug: string, existingSlugs: string[]): string {
    if (!existingSlugs.includes(baseSlug)) {
        return baseSlug;
    }

    let counter = 2;
    let newSlug = `${baseSlug}-${counter}`;

    while (existingSlugs.includes(newSlug)) {
        counter++;
        newSlug = `${baseSlug}-${counter}`;
    }

    return newSlug;
}
