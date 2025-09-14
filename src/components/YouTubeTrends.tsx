"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Helper functions remain the same
const formatViews = (views: string) => { /* ... */ };
const timeAgo = (date: string) => { /* ... */ };
const stringToColor = (str: string) => { /* ... */ };

export default function YouTubeTrends() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${apiUrl}/api/videos?source=YouTube&limit=10`);
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch YouTube videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <p className="text-gray-400 my-8">Loading YouTube Trends...</p>;
  if (videos.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">YouTube Trends</h2>
        <button className="text-sm text-red-500">See All</button>
      </div>
      <div className="space-y-6">
        {videos.map((video: any) => {
          const avatarColor = stringToColor(video.channelTitle);
          return (
            <Link href={`/youtube/${video.sourceId}`} key={video._id} className="group block">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex items-start gap-3 mt-3">
                <div className={`flex-shrink-0 w-9 h-9 ${avatarColor} rounded-full flex items-center justify-center font-bold text-white text-lg`}>
                  {video.channelTitle?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-base leading-tight line-clamp-2">{video.title}</h4>
                  <p className="text-gray-400 text-xs mt-1">
                    {video.channelTitle} • {formatViews(video.viewCount)} • {timeAgo(video.publishedAt)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
