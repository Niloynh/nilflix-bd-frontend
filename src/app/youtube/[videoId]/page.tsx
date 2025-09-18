"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import YouTube from 'react-youtube';
import { IoThumbsUpOutline, IoChatbubbleOutline, IoShareSocialOutline } from 'react-icons/io5';
import Link from 'next/link';

export default function ShortsPlayerPage() {
    const params = useParams();
    const { videoId } = params;

    const [videoData, setVideoData] = useState<any>(null);

    useEffect(() => {
        if (videoId) {
            const fetchVideoDetails = async () => {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                try {
                    const res = await fetch(`${apiUrl}/api/videos/YouTube/${videoId}`);
                    const data = await res.json();
                    setVideoData(data);
                } catch (error) {
                    console.error("Failed to fetch video details:", error);
                }
            };
            fetchVideoDetails();
        }
    }, [videoId]);

    if (!videoData) {
        return <div className="h-screen w-full flex items-center justify-center bg-black">Loading...</div>;
    }

    return (
        <div className="h-screen w-full bg-black flex items-center justify-center">
            <div className="relative w-full h-full max-w-[450px] max-h-[95vh] rounded-2xl overflow-hidden">
                <YouTube
                    videoId={videoData.sourceId}
                    className="absolute top-0 left-0 w-full h-full"
                    opts={{ 
                        playerVars: { 
                            autoplay: 1,
                            controls: 0,
                            loop: 1,
                            playlist: videoData.sourceId,
                        } 
                    }}
                />
                {/* --- UI Overlays --- */}
                <div className="absolute right-2 bottom-20 flex flex-col items-center gap-5 text-white">
                    <button className="flex flex-col items-center"><IoThumbsUpOutline size={30} /><span className="text-sm mt-1">Like</span></button>
                    <button className="flex flex-col items-center"><IoChatbubbleOutline size={30} /><span className="text-sm mt-1">Comment</span></button>
                    <button className="flex flex-col items-center"><IoShareSocialOutline size={30} /><span className="text-sm mt-1">Share</span></button>
                </div>
                <div className="absolute bottom-4 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm line-clamp-2">{videoData.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        <p className="text-white font-bold text-sm">@{videoData.channelTitle}</p>
                    </div>
                </div>
                {/* -------------------- */}
            </div>
        </div>
    );
}