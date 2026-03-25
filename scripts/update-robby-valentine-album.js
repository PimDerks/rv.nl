/**
 * Update Spotify track IDs for the 1992 Robby Valentine album
 * This will OVERWRITE existing spotify IDs for these songs
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SONGS_DIR = path.join(__dirname, '../content/_songs');

// Mapping of track titles to Spotify IDs from the album
const trackMapping = [
  { title: 'The Magic Breeze', spotifyId: '15uaa6rA4gKjPjAfgOhI12' },
  { title: 'Broken Dreams', spotifyId: '5sPsDrAVRAYhL7PzqyHvbK' },
  { title: 'Live Your Life', spotifyId: '7hsmb9Gd1yjAM9V8IaW42j' },
  { title: 'One Day', spotifyId: '6qc6Bjab9lQXshLHhgFzdM' },
  { title: 'The Gift Of Life', spotifyId: '0hfcKpwWHXaG30QKw8VccJ' },
  { title: 'Over And Over Again', spotifyId: '4iYDggcUrhO8h99n0gYCto' },
  { title: 'Heaven Is Callin\'', spotifyId: '1CxloYgaCCDphWjdX1P5vA' },
  { title: 'I\'m Searchin\'', spotifyId: '4MEXSFJRsdiehypXzdPj2I' },
  { title: 'Here, There And Everywhere', spotifyId: '3Jms9dDFy2jnny7HypmAv6' },
  { title: 'Angel', spotifyId: '21SHHYwKMpfAuP2oRCzgYb' },
  { title: 'Love Is Alive', spotifyId: '3dg9vXxhpfiYmyC0GNPQR1' },
  { title: 'I Believe In You', spotifyId: '2w1BdwRzqdm5WUtSrr54LB' },
  { title: 'Love Takes Me Higher', spotifyId: '2oEXvC8guyjKflQvx4CDzF' },
  { title: 'I Can\'t Stand Another Day Without You', spotifyId: '37fMB2Wp7ntp1EhaiUPk0N' },
  { title: 'Valentine\'s Overture Part I', spotifyId: '3z1zIQQB4gGGNSBsUncaUd' },
];

// Create slug from song title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };
  
  try {
    const frontmatter = yaml.load(match[1]);
    const body = content.slice(match[0].length);
    return { frontmatter, body };
  } catch (e) {
    console.error('Error parsing frontmatter:', e.message);
    return { frontmatter: {}, body: content };
  }
}

// Update song markdown file with Spotify ID
function updateSongFile(songSlug, trackTitle, spotifyId, overwrite = true) {
  const songPath = path.join(SONGS_DIR, `${songSlug}.md`);
  
  if (!fs.existsSync(songPath)) {
    console.log(`  ⚠️  Song file not found: ${songSlug}.md (${trackTitle})`);
    return false;
  }
  
  const content = fs.readFileSync(songPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  const hadSpotifyId = !!frontmatter.spotify;
  const changed = frontmatter.spotify !== spotifyId;
  
  if (!overwrite && hadSpotifyId) {
    console.log(`  ⏭️  Skipping (already has ID): ${songSlug}`);
    return false;
  }
  
  // Add/update spotify field
  frontmatter.spotify = spotifyId;
  
  // Rebuild the file
  const newFrontmatter = yaml.dump(frontmatter, { lineWidth: -1 });
  const newContent = `---\n${newFrontmatter}---${body}`;
  
  fs.writeFileSync(songPath, newContent, 'utf8');
  
  if (hadSpotifyId && changed) {
    console.log(`  🔄 Updated: ${songSlug}.md (${trackTitle})`);
  } else if (hadSpotifyId && !changed) {
    console.log(`  ✓ Already correct: ${songSlug}.md (${trackTitle})`);
  } else {
    console.log(`  ✅ Added: ${songSlug}.md (${trackTitle})`);
  }
  
  return true;
}

// Main execution
function main() {
  console.log('🎵 Updating Robby Valentine (1992) album track IDs...\n');
  
  let updated = 0;
  let failed = 0;
  
  for (const track of trackMapping) {
    const slug = createSlug(track.title);
    if (updateSongFile(slug, track.title, track.spotifyId, true)) {
      updated++;
    } else {
      failed++;
    }
  }
  
  console.log(`\n✨ Done! Updated ${updated} songs, ${failed} not found.`);
}

main();
