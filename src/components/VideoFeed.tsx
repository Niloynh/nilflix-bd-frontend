"use client";

import { useState, useEffect } from "react";
import YouTube from "react-youtube";

type VideoFeedProps = {
  source: string;
  category: string;
};

export default function VideoFeed({ source, category }: VideoFeedProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null); // active video id

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    setLoading(true);
    let fetchUrl = `${apiUrl}/api/videos?`;

    if (source !== "Home") fetchUrl += `source=${source}`;
    if (category !== "All") {
      fetchUrl += source !== "Home" ? "&" : "";
      fetchUrl += `category=${category}`;
    }

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch videos:", err);
        setLoading(false);
      });
  }, [source, category]);

  if (loading)
    return <p className="text-gray-400 text-center py-10">Loading videos...</p>;
  if (videos.length === 0)
    return <p className="text-gray-400 text-center py-10">No videos found.</p>;

  const formatViews = (views: string) => {
    if (!views) return "0 views";
    const num = parseInt(views, 10);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K views`;
    return `${num} views`;
  };

  return (
    <div className="space-y-6">
      {videos.map((video) => (
        <div key={video._id} className="group">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
            {activeVideo === video.sourceId ? (
              <YouTube
                videoId={video.sourceId}
                className="absolute top-0 left-0 w-full h-full"
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1 },
                }}
                onEnd={() => setActiveVideo(null)}
              />
            ) : (
              <button
                className="w-full h-full"
                onClick={() => setActiveVideo(video.sourceId)}
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </button>
            )}
          </div>

          {/* Video Info */}
          <div className="flex items-start gap-3 mt-3">
            {/* Channel Avatar */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center font-bold text-white">
              {video.channelTitle?.charAt(0)}
            </div>

            <div className="flex-1">
              {/* Video Title */}
              <h4 className="text-white font-semibold line-clamp-2">
                {video.title}
              </h4>

              {/* Channel name + subscriber (just name) and Views */}
              <p className="text-gray-400 text-sm">
                {video.channelTitle} • {formatViews(video.sourceStats?.views)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
