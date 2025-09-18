"use client";
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from 'next/link';

const MatchCard = ({ match }: any) => (
    <div className="bg-gray-800 p-3 rounded-xl shadow-lg h-36 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <h3 className="text-white font-semibold text-sm text-left">{match.teamOne} vs {match.teamTwo}</h3>
            <span className="flex items-center text-white text-xs font-bold bg-red-600 px-2 py-1 rounded-full">
                <span className="h-2 w-2 bg-white rounded-full mr-1.5 animate-ping"></span>
                LIVE
            </span>
        </div>
        <Link 
            href={`/live-tv?play=${encodeURIComponent(match.streamUrl)}`}
            className="mt-2 w-full bg-red-600/80 hover:bg-red-600 text-white text-sm text-center py-2 rounded-lg font-semibold transition-colors"
        >
            Watch Live
        </Link>
    </div>
);

export default function LiveMatchesCarousel() {
    const [liveMatches, setLiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveMatches = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/matches?filter=live`);
                const data = await res.json();
                setLiveMatches(data);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveMatches();
    }, []);

    if (loading || liveMatches.length === 0) return null;

    return (
        <div className="my-8">
            <h2 className="text-lg font-semibold text-white mb-4">Live Matches</h2>
            <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                infiniteLoop={true}
                centerMode={true}
                centerSlidePercentage={70}
                emulateTouch={true}
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