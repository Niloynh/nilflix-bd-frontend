"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoPlaySharp } from 'react-icons/io5';

export default function YouTubeShortsShelf() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShorts = async () => {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      try {
        // limit=4 ব্যবহার করে শুধু ৪টি Shorts ভিডিও আনা হচ্ছে
        const res = await fetch(`${apiUrl}/api/videos?source=YouTube&isShort=true&limit=4`);
        const data = await res.json();
        setShorts(data);
      } catch (error) {
        console.error("Failed to fetch YouTube Shorts:", error);
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
      {/* --- ২x২ গ্রিড এবং নতুন লিঙ্ক --- */}
      <div className="grid grid-cols-2 gap-3">
        {shorts.map((video: any) => (
          <Link 
            href={`/shorts/${video.sourceId}`} // <-- লিঙ্কটি নতুন Shorts প্লেয়ারে যাবে
            key={video._id} 
            className="group cursor-pointer aspect-[9/16] relative overflow-hidden rounded-lg bg-gray-800"
          >
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2.5">
              <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}