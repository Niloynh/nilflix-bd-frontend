"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // ক্যারোসেলের জন্য CSS

// কার্ডের উচ্চতা কমানো হয়েছে এবং ডিজাইন আপডেট করা হয়েছে
const MatchCard = ({ match }: any) => (
    <div className="bg-gray-800 p-3 rounded-xl shadow-lg h-32 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <h3 className="text-white font-semibold text-sm text-left line-clamp-2">{match.teamOne} vs {match.teamTwo}</h3>
            <span className="flex-shrink-0 flex items-center text-white text-xs font-bold bg-red-600 px-2 py-1 rounded-full">
                <span className="h-2 w-2 bg-white rounded-full mr-1.5 animate-ping"></span>
                LIVE
            </span>
        </div>
        <Link 
            href={`/live-tv?play=${encodeURIComponent(match.streamUrl)}`}
            className="mt-2 w-full bg-red-600/80 hover:bg-red-600 text-white text-sm text-center py-2 rounded-lg font-semibold transition-colors"
        >
            Watch Now
        </Link>
    </div>
);

export default function LiveMatches() {
    const [liveMatches, setLiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveMatches = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                // শুধুমাত্র লাইভ ম্যাচ আনা হচ্ছে
                const res = await fetch(`${apiUrl}/api/matches?filter=live`);
                const data = await res.json();
                setLiveMatches(data);
            } catch (error) {
                console.error("Failed to fetch live matches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveMatches();
    }, []);

    if (loading || liveMatches.length === 0) return null;

    return (
        <div className="my-8">
            <div className="flex items-center justify-between mb-4">
                
                <h2 className="text-xl font-bold text-white mb-4">🚩Live Matches</h2>
                <Link href="/live-tv" className="text-xs text-red-500 hover:underline">See All</Link>
            </div>
            <Carousel
                showThumbs={false}
                showIndicators={false}
                infiniteLoop={true}
                autoPlay={true}       // <-- অটো স্ক্রল চালু করা হলো
                interval={5000}       // <-- প্রতি ৫ সেকেন্ড পর পর স্লাইড পরিবর্তন হবে
                centerMode={true}
                centerSlidePercentage={70} // স্ক্রিনে কতটুকু অংশ দেখাবে
                emulateTouch={true}   // <-- মোবাইল ডিভাইসে সোয়াইপ সাপোর্ট
                showArrows={false}
            >
                {liveMatches.map((match: any) => (
                    <div key={match._id} className="px-1.5">
                        <MatchCard match={match} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
}