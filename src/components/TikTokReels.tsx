"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHeart, FaCommentDots, FaShare } from 'react-icons/fa';

export default function TikTokReels() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTikTokVideos = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${apiUrl}/api/videos?source=TikTok&limit=4`);
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

  if (videos.length === 0) {
    return null; // Don't show the section if no videos are found
  }

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">TikTok Reels</h2>
        <Link href="/tiktok" className="text-sm text-red-500 hover:underline">See All</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {videos.map((video: any) => (
          <Link href={`/tiktok/${video.sourceId}`} key={video._id} className="group cursor-pointer aspect-[9/16] relative overflow-hidden rounded-lg bg-gray-800">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-2.5">
              <p className="text-white text-xs font-medium line-clamp-2 mb-2">{video.title}</p>
              <div className="flex items-center text-gray-300 text-[10px] space-x-3">
                <div className="flex items-center">
                  <FaHeart className="mr-1" size={10} /> {Math.floor(Math.random() * 20)}K
                </div>
                <div className="flex items-center">
                  <FaCommentDots className="mr-1" size={10} /> {Math.floor(Math.random() * 500)}
                </div>
                <div className="flex items-center">
                  <FaShare className="mr-1" size={10} /> {Math.floor(Math.random() * 100)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}