"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import { FaHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";
import TikTokFilters from "@/components/TikTokFilters";

const TikTokCard = ({ video, isActive }: { video: any; isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isActive) {
      videoEl.currentTime = 0;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) playPromise.catch(err => console.log("Autoplay prevented:", err));
    } else {
      videoEl.pause();
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center snap-start">
      <video
        ref={videoRef}
        key={video.sourceId}
        src={`${apiUrl}/api/proxy/tiktok-video?url=${encodeURIComponent(video.sourceUrl)}`} // proxy applied
        loop
        playsInline
        muted
        className="w-full h-full object-contain"
        poster={video.thumbnailUrl}
      />

      {/* UI Overlays */}
      <div className="absolute inset-0 z-10">
        <div className="absolute right-2 bottom-28 flex flex-col items-center gap-5 text-white">
          <Link href={`/profile/${video.channelTitle}`} className="flex flex-col items-center">
            <img src={video.authorAvatarUrl} className="w-12 h-12 rounded-full border-2 border-white" />
          </Link>
          <button className="flex flex-col items-center">
            <FaHeart size={30} />
            <span className="text-sm mt-1">{video.sourceStats?.likes || 0}</span>
          </button>
          <button className="flex flex-col items-center">
            <FaCommentDots size={30} />
            <span className="text-sm mt-1">{video.sourceStats?.comments || 0}</span>
          </button>
          <button className="flex flex-col items-center">
            <FaShare size={30} />
            <span className="text-sm mt-1">{video.sourceStats?.shares || 0}</span>
          </button>
        </div>
        <div className="absolute bottom-16 left-0 right-0 p-4">
          <p className="text-white font-bold text-base">@{video.channelTitle}</p>
          <p className="text-white text-sm mt-1 line-clamp-2">{video.title}</p>
        </div>
      </div>
    </div>
  );
};

export default function TikTokPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { videoId } = params;

  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [initialSlide, setInitialSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      try {
        const res = await fetch(`${apiUrl}/api/videos?source=TikTok`);
        const data = await res.json();
        setAllVideos(data);

        const startIndex = data.findIndex((v: any) => v.sourceId === videoId);
        const safeIndex = startIndex >= 0 ? startIndex : 0;
        setInitialSlide(safeIndex);
        setActiveSlideIndex(safeIndex);
      } catch (err) {
        console.error("Failed to fetch TikTok videos:", err);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) fetchVideos();
  }, [videoId]);

  const handleSlideChange = (swiper: any) => {
    setActiveSlideIndex(swiper.activeIndex);
    const newVideoId = allVideos[swiper.activeIndex]?.sourceId;
    if (newVideoId) router.replace(`/tiktok/${newVideoId}`, { scroll: false });
  };

  if (loading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );

  return (
    <div className="h-screen w-full bg-black relative">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-20 p-2 bg-black/40 rounded-full text-white"
      >
        <IoArrowBackOutline size={22} />
      </button>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <TikTokFilters />
      </div>

      {allVideos.length > 0 ? (
        <Swiper
          direction="vertical"
          className="w-full h-full"
          initialSlide={initialSlide}
          onSlideChange={handleSlideChange}
          modules={[Mousewheel]}
          mousewheel={true}
        >
          {allVideos.map((video, index) => (
            <SwiperSlide key={video._id}>
              <TikTokCard video={video} isActive={index === activeSlideIndex} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-white text-center flex items-center justify-center h-full">
          No TikTok videos found.
        </p>
      )}
    </div>
  );
}
