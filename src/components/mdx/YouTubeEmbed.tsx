interface YouTubeEmbedProps {
  videoId: string;
}

export function YouTubeEmbed({ videoId }: YouTubeEmbedProps): React.ReactElement {
  // Clean up videoId - remove any query params if present
  const cleanVideoId = videoId.split("?")[0];

  return (
    <div className="relative aspect-video my-6 rounded-lg overflow-hidden bg-muted">
      <iframe
        src={`https://www.youtube.com/embed/${cleanVideoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
