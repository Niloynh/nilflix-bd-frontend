"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactCountryFlag from 'react-country-flag';
import { IoVideocam } from 'react-icons/io5';
import { Match } from '@/types';

// দেশের নাম থেকে কান্ট্রি কোড এবং শর্ট ফর্ম পাওয়ার জন্য Helper ফাংশন
const teamDetails: { [key: string]: { code: string; short: string } } = {
    bangladesh: { code: 'BD', short: 'BAN' },
    india: { code: 'IN', short: 'IND' },
    pakistan: { code: 'PK', short: 'PAK' },
    australia: { code: 'AU', short: 'AUS' },
    england: { code: 'GB', short: 'ENG' },
    argentina: { code: 'AR', short: 'ARG' },
    brazil: { code: 'BR', short: 'BRA' },
    // প্রয়োজনে আরও দল যোগ করুন
};

const getTeamInfo = (teamName: string) => {
    const name = teamName.toLowerCase();
    for (const key in teamDetails) {
        if (name.includes(key)) return teamDetails[key];
    }
    return { code: 'UN', short: teamName.substring(0, 3).toUpperCase() };
};

// নতুন ডিজাইনের MatchCard
const MatchCard = ({ match }: any) => {
    const teamOne = getTeamInfo(match.teamOne);
    const teamTwo = getTeamInfo(match.teamTwo);

    return (
        <div className="bg-gradient-to-br from-gray-800  border border-gray-700 p-3 rounded-xl shadow-lg h-35 flex flex-col justify-between">
            
            <div>
                
                <p className="text-sm font-bold text-gray-400 mb-2">{match.sport} Live Match</p>
                {/* Score Section */}
                {match.sport === 'Cricket' ? (
                    <div className="text-white text-sm text-center">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <ReactCountryFlag countryCode={teamOne.code} svg style={{ width: '1.5em', height: '1.5em' }} />
                                <span className="font-bold">{teamOne.short}</span>
                            </div>
                            <span className="text-sm font-bold">{match.teamOneScore}</span>
                        </div>
                        <p className="text-xs text-gray-400 my-1">({match.overs} ov)</p>
                        <div className="flex justify-between items-center">
                             <div className="flex items-center gap-2">
                                <ReactCountryFlag countryCode={teamTwo.code} svg style={{ width: '1.5em', height: '1.5em' }} />
                                <span className="font-bold">{teamTwo.short}</span>
                            </div>
                             <span className="text-sm font-bold">{match.teamTwoScore || "Yet to bat"}</span>
                        </div>
                    </div>
                ) : ( // Football Score
                    <div className="flex justify-around items-center text-white text-sm font-bold">
                        <div className="flex items-center gap-2">
                            <ReactCountryFlag countryCode={teamOne.code} svg style={{ width: '1.5em', height: '1.5em' }} />
                            <span>{teamOne.short}</span>
                        </div>
                        <span className="text-2xl">{match.teamOneScore} - {match.teamTwoScore}</span>
                        <div className="flex items-center gap-2">
                            <span>{teamTwo.short}</span>
                             <ReactCountryFlag countryCode={teamTwo.code} svg style={{ width: '1.5em', height: '1.5em' }} />
                        </div>
                    </div>
                )}
            </div>
            
            {/* --- "Watch Live" বাটনের স্টাইল এখানে পরিবর্তন করা হয়েছে --- */}
            <Link 
                href={`/live-tv?play=${encodeURIComponent(match.streamUrl)}`}
                className="text-white-500 text-xm font-semibold flex items-center justify-center gap-1 hover:underline"
            >
                
                <button className='bg-red-700 hover:bg-red-600 text-white text-sm text-center p-1 mb-1 rounded-lg font-semibold transition-colors flex d-block items-center justify-center gap-1'> 
                    <IoVideocam />
                    Watch Live</button>
            </Link>
        </div>
    );
};


export default function LiveMatchesCarousel() {
    const [liveMatches, setLiveMatches] =  useState<Match[]>([]);;
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
        <div className="my-5">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Live Matches</h2>
                <Link href="/live-tv" className="text-xs text-red-500 hover:underline mr-2">
                    See All
                </Link>
            </div>
            <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                infiniteLoop={true}
                autoPlay={true}
                interval={5000}
                centerMode={true}
                centerSlidePercentage={80}
                emulateTouch={true}
                showArrows={false}
            >
                {liveMatches.map((match: any) => (
                    <div key={match._id} className="px-2">
                        <MatchCard match={match} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
}