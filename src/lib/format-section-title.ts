/**
 * Format a section title with connecting text
 * Examples: 
 * - "LISTEN to this release"
 * - "TRACKLIST for this release"
 * - "CREDITS for this release"
 */
export function formatSectionTitle(
  section: string,
  connector: 'to' | 'for' = 'for'
): string {
  const sectionUpper = section.toUpperCase();
  
  return `${sectionUpper} <em class="font-serif text-white italic font-normal text-sm align-middle lowercase">${connector}</em> THIS RELEASE`;
}
