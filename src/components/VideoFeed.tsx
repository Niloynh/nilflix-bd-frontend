"use client";

import { useState, useEffect } from "react";

type VideoFeedProps = {
  source: string;
};

export default function VideoFeed({ source }: VideoFeedProps) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/api/videos?source=${source}`)
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch videos:", err);
        setLoading(false);
      });
  }, [source]); // This will re-run whenever the 'source' changes

  if (loading) {
    return <p className="text-gray-400">Loading videos...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video: any) => (
        <div key={video._id} className="group cursor-pointer">
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover rounded-lg mb-2 group-hover:opacity-80 transition-opacity" />
          <h4 className="text-white font-semibold truncate">{video.title}</h4>
        </div>
      ))}
    </div>
  );
}