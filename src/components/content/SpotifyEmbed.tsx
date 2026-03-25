interface SpotifyEmbedProps {
  spotifyId: string;
  type?: 'album' | 'track';
  title?: string;
}

export function SpotifyEmbed({
  spotifyId,
  type = 'album',
  title,
}: SpotifyEmbedProps): React.ReactElement {
  // Use theme=0 for dark theme to match the site
  const embedUrl = `https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=0`;

  return (
    <div className="w-full">
      {title && (
        <h2 className="mb-4 text-center" dangerouslySetInnerHTML={{ __html: title }} />
      )}
      <div className="overflow-hidden rounded-2xl">
        <iframe
          src={embedUrl}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Player"
          className="rounded-2xl"
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
}
