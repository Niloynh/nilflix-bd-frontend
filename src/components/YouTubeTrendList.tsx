"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Helper functions to format numbers and date
const formatViews = (views: string) => {
    if (!views) return '0 views';
    const num = parseInt(views, 10);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K views`;
    return `${num} views`;
};

const timeAgo = (date: string) => {
    if (!date) return '';
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    return `${Math.floor(seconds)} seconds ago`;
};

const stringToColor = (str: string) => {
  if (!str) return 'bg-gray-500';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

export default function YouTubeTrends() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${apiUrl}/api/videos?source=YouTube&isShort=false&limit=10`);
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
        <Link href="/youtube" className="text-sm text-red-500">See All</Link>
      </div>
      <div className="space-y-6">
        {videos.map((video: any) => {
          const avatarColor = stringToColor(video.channelTitle);
          return (
            <Link href={`/youtube/${video.sourceId}`} key={video._id} className="group block">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110" />
              </div>
              <div className="flex items-start gap-3 mt-3">
                <div className={`flex-shrink-0 w-9 h-9 ${avatarColor} rounded-full flex items-center justify-center font-bold text-white`}>
                  {video.channelTitle?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-base leading-tight line-clamp-2">{video.title}</h4>
                  {/* --- এই অংশটি আপডেট করা হয়েছে --- */}
                  <p className="text-gray-400 text-xs mt-1">
                    {video.channelTitle} • {formatViews(video.sourceStats?.views)} • {timeAgo(video.publishedAt)}
                  </p>
                  {/* ----------------------------- */}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

