/**
 * Extract Spotify track IDs from albums and update song markdown files
 * 
 * This script:
 * 1. Reads all releases with Spotify album IDs
 * 2. Fetches album HTML from Spotify web (no auth needed)
 * 3. Extracts track IDs from embedded track URLs
 * 4. Matches tracks to songs based on tracklist position
 * 5. Updates song markdown files with spotify field
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const yaml = require('js-yaml');

const RELEASES_DIR = path.join(__dirname, '../content/_releases');
const SONGS_DIR = path.join(__dirname, '../content/_songs');

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

// Fetch HTML from Spotify album page
function fetchSpotifyAlbum(albumId) {
  return new Promise((resolve, reject) => {
    const url = `https://open.spotify.com/album/${albumId}`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Extract track IDs from Spotify HTML
function extractTrackIds(html) {
  const trackUrlPattern = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/g;
  const matches = [...html.matchAll(trackUrlPattern)];
  
  // Remove duplicates while preserving order
  const seen = new Set();
  const trackIds = [];
  
  for (const match of matches) {
    const id = match[1];
    if (!seen.has(id)) {
      seen.add(id);
      trackIds.push(id);
    }
  }
  
  return trackIds;
}

// Get track title from track object (string or object with title)
function getTrackTitle(track) {
  if (typeof track === 'string') {
    return track;
  }
  return track.title || '';
}

// Normalize title for matching
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Create slug from song title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get all tracks from release discs
function getTracksFromRelease(release) {
  const tracks = [];
  
  if (!release.frontmatter.discs || !Array.isArray(release.frontmatter.discs)) {
    return tracks;
  }
  
  for (const disc of release.frontmatter.discs) {
    if (disc.tracks && Array.isArray(disc.tracks)) {
      for (const track of disc.tracks) {
        tracks.push(getTrackTitle(track));
      }
    }
  }
  
  return tracks;
}

// Update song markdown file with Spotify ID
function updateSongFile(songSlug, spotifyId) {
  const songPath = path.join(SONGS_DIR, `${songSlug}.md`);
  
  if (!fs.existsSync(songPath)) {
    console.log(`  ⚠️  Song file not found: ${songSlug}.md`);
    return false;
  }
  
  const content = fs.readFileSync(songPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  // Skip if already has Spotify ID
  if (frontmatter.spotify) {
    console.log(`  ⏭️  Already has Spotify ID: ${songSlug}`);
    return false;
  }
  
  // Add spotify field to frontmatter
  frontmatter.spotify = spotifyId;
  
  // Rebuild the file
  const newFrontmatter = yaml.dump(frontmatter, { lineWidth: -1 });
  const newContent = `---\n${newFrontmatter}---${body}`;
  
  fs.writeFileSync(songPath, newContent, 'utf8');
  console.log(`  ✅ Updated: ${songSlug}.md with ${spotifyId}`);
  return true;
}

// Main execution
async function main() {
  console.log('🎵 Extracting Spotify track IDs...\n');
  
  // Read all releases
  const releaseFiles = fs.readdirSync(RELEASES_DIR)
    .filter(f => f.endsWith('.md'));
  
  const releasesWithSpotify = [];
  
  console.log('📀 Reading releases...');
  for (const file of releaseFiles) {
    const content = fs.readFileSync(path.join(RELEASES_DIR, file), 'utf8');
    const { frontmatter } = parseFrontmatter(content);
    
    if (frontmatter.spotify) {
      const tracks = getTracksFromRelease({ frontmatter });
      
      releasesWithSpotify.push({
        file,
        spotifyId: frontmatter.spotify,
        title: frontmatter.title,
        tracks,
        frontmatter
      });
    }
  }
  
  console.log(`✅ Found ${releasesWithSpotify.length} releases with Spotify IDs\n`);
  
  let totalUpdated = 0;
  
  for (const release of releasesWithSpotify) {
    console.log(`\n📀 ${release.title} (${release.spotifyId})`);
    console.log(`   Fetching track data...`);
    
    try {
      // Fetch Spotify album page
      const html = await fetchSpotifyAlbum(release.spotifyId);
      const trackIds = extractTrackIds(html);
      
      console.log(`   Found ${trackIds.length} tracks on Spotify`);
      console.log(`   Release has ${release.tracks.length} tracks in tracklist`);
      
      if (trackIds.length !== release.tracks.length) {
        console.log(`   ⚠️  Track count mismatch! Skipping to be safe.`);
        continue;
      }
      
      // Match tracks by position
      for (let i = 0; i < release.tracks.length; i++) {
        const trackTitle = release.tracks[i];
        const spotifyId = trackIds[i];
        const slug = createSlug(trackTitle);
        
        console.log(`   ${i + 1}. ${trackTitle} → ${spotifyId}`);
        
        if (updateSongFile(slug, spotifyId)) {
          totalUpdated++;
        }
      }
      
      // Small delay between requests to be polite
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`   ❌ Error fetching album: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Done! Updated ${totalUpdated} song files with Spotify track IDs.`);
}

main().catch(console.error);
