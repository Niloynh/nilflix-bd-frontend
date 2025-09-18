"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css';
import YouTube from 'react-youtube';
import { IoArrowBackOutline, IoThumbsUpOutline, IoChatbubbleOutline, IoShareSocialOutline } from 'react-icons/io5';

const ShortsCard = ({ video, isActive }: { video: any, isActive: boolean }) => (
    <div className="relative w-full h-[100vh] bg-black flex items-center justify-center">
        <YouTube
            videoId={video.sourceId}
            iframeClassName="absolute top-0 left-0 w-full h-full"
            opts={{ 
                playerVars: { 
                    autoplay: isActive ? 1 : 0,
                    controls: 0,
                    loop: 1,
                    playlist: video.sourceId,
                } 
            }}
        />
        
        {/* UI Overlays */}
        <div className="absolute inset-0 z-10">
            {/* Right side buttons */}
            <div className="absolute right-4 bottom-[25%] flex flex-col items-center gap-15 text-white">
                <button className="flex flex-col items-center"><IoThumbsUpOutline size={30} /></button>
                <button className="flex flex-col items-center"><IoChatbubbleOutline size={30} /></button>
                <button className="flex flex-col items-center"><IoShareSocialOutline size={30} /></button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-25 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold">
                        {video.channelTitle?.charAt(0) || 'U'}
                    </div>
                    <p className="text-white font-bold text-sm">@{video.channelTitle}</p>
                </div>
                <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
            </div>
        </div>
    </div>
);

export default function ShortsPlayerPage({ previousTab }: { previousTab?: string }) {
    const params = useParams();
    const router = useRouter();
    const { videoId } = params;

    const [allShorts, setAllShorts] = useState<any[]>([]);
    const [initialSlide, setInitialSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    useEffect(() => {
        const fetchShorts = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/videos?source=YouTube&isShort=true`);
                const data = await res.json();
                
                const startIndex = data.findIndex((v: any) => v.sourceId === videoId);
                setAllShorts(data);
                const safeStartIndex = startIndex >= 0 ? startIndex : 0;
                setInitialSlide(safeStartIndex);
                setActiveSlideIndex(safeStartIndex);
            } finally {
                setLoading(false);
            }
        };
        if (videoId) fetchShorts();
    }, [videoId]);
    
    const handleSlideChange = (swiper: any) => {
        setActiveSlideIndex(swiper.activeIndex);
        const newVideoId = allShorts[swiper.activeIndex]?.sourceId;
        if (newVideoId) {
            router.replace(`/shorts/${newVideoId}`, { scroll: false });
        }
    };

    if (loading) {
        return <div className="h-full w-full flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="relative h-full w-full">
            <button 
                onClick={() => router.back()} // আগের tab/feed এ ফিরে যাবে
                className="absolute top-4 left-4 z-20 p-2 bg-black/40 rounded-full text-white hover:bg-black/60"
            >
                <IoArrowBackOutline size={24} />
            </button>

            {allShorts.length > 0 && (
                <Swiper
                    direction={'vertical'}
                    className="w-full h-full"
                    initialSlide={initialSlide}
                    onSlideChange={handleSlideChange}
                    modules={[Mousewheel]}
                    mousewheel={{
                        forceToAxis: true,
                        releaseOnEdges: true,
                        sensitivity: 1,
                    }}
                    touchStartPreventDefault={false}
                    passiveListeners={true}
                >
                    {allShorts.map((video, index) => (
                        <SwiperSlide key={video._id}>
                            <ShortsCard video={video} isActive={index === activeSlideIndex} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};
