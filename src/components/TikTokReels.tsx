"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaCommentDots, FaShare } from 'react-icons/fa';

// Number formatting helper function
const formatCount = (count: string) => {
    if (!count) return '0';
    const num = parseInt(count, 10);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
};

export default function TikTokReels() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTikTokVideos = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${apiUrl}/api/videos?source=TikTok&limit=4`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch TikTok videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTikTokVideos();
  }, []);

  if (loading) {
    return (
        <section className="my-8">
            <h2 className="text-xl font-semibold text-white mb-4">TikTok Reels</h2>
            <p className="text-gray-400">Loading TikTok Reels...</p>
        </section>
    );
  }

  if (videos.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">TikTok Reels</h2>
        <Link href="/tiktok" className="text-sm text-red-500 hover:underline">See All</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {videos.map((video: any) => (
          <Link href={`/tiktok/${video.sourceId}`} key={video._id} className="group cursor-pointer aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-800">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2.5">
              <p className="text-white text-xs font-medium line-clamp-2 mb-2">{video.title}</p>
              <div className="flex items-center text-gray-300 text-[10px] space-x-3">
                <div className="flex items-center">
                  <FaHeart className="mr-1 text-red-500" size={10} /> 
                  <span>{formatCount(video.sourceStats?.likes)}</span>
                </div>
                <div className="flex items-center">
                  <FaCommentDots className="mr-1 text-blue-400" size={10} /> 
                  <span>{formatCount(video.sourceStats?.comments)}</span>
                </div>
                <div className="flex items-center">
                  <FaShare className="mr-1 text-green-400" size={10} /> 
                  <span>{formatCount(video.sourceStats?.shares)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}