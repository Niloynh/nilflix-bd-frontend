"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoPlaySharp } from 'react-icons/io5';
import { FaHeart, FaCommentDots } from 'react-icons/fa';

// Helper function to format large numbers
const formatCount = (count: string) => {
    if (!count) return '0';
    const num = parseInt(count, 10);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
};

export default function YouTubeShortsGrid() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${apiUrl}/api/videos?source=YouTube&isShort=true&limit=4`);
        const data = await res.json();
        setShorts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, []);

  if (loading) return <p className="text-gray-400 my-8">Loading Shorts...</p>;
  if (shorts.length === 0) return null;

  return (
    <section className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <IoPlaySharp className="text-red-500" size={24} />
        <h2 className="text-xl font-bold text-white">Shorts</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {shorts.map((video: any) => (
          <Link href={`/shorts/${video.sourceId}`} key={video._id} className="group cursor-pointer aspect-[9/16] relative overflow-hidden rounded-lg bg-gray-800">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2.5">
              <p className="text-white text-xs font-medium line-clamp-2 mb-2">{video.title}</p>
              {/* --- লাইক এবং কমেন্ট সংখ্যা এখানে যোগ করা হয়েছে --- */}
              <div className="flex items-center text-gray-300 text-[10px] space-x-3">
                <div className="flex items-center">
                  <FaHeart className="mr-1 text-red-500" size={10} /> 
                  <span>{formatCount(video.sourceStats?.likes)}</span>
                </div>
                <div className="flex items-center">
                  <FaCommentDots className="mr-1 text-blue-400" size={10} /> 
                  <span>{formatCount(video.sourceStats?.comments)}</span>
                </div>
              </div>
              {/* ------------------------------------------------ */}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}