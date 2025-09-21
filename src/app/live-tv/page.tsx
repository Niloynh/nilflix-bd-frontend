"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ReactCountryFlag from 'react-country-flag'; // <-- এই লাইনটি যোগ করুন
import { IoVideocamOutline } from "react-icons/io5";
import LiveBettingInterface from '@/components/LiveBettingInterface';
import { Match } from '@/types';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

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

// MatchCard কম্পোনেন্টটি পতাকা এবং শর্ট ফর্ম সহ আপডেট করা হলো
const MatchCard = ({ match, onWatch }: { match: any, onWatch: () => void }) => {
    const teamOne = getTeamInfo(match.teamOne);
    const teamTwo = getTeamInfo(match.teamTwo);

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 flex flex-col hover:border-red-500 transition-colors">
            <p className="text-xs text-gray-400 mb-2">{match.sport} | {new Date(match.matchTime).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</p>
            <div className="flex-grow flex items-center justify-between">
                <div className="flex flex-col items-center text-center w-2/5 gap-1">
                    <ReactCountryFlag countryCode={teamOne.code} svg style={{ width: '2em', height: '2em', borderRadius: '50%' }} />
                    <span className="text-white font-semibold text-sm">{teamOne.short}</span>
                </div>
                <div className="text-center">
                    <p className="text-gray-300 font-bold text-lg">{new Date(match.matchTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${match.status === 'Live' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                        {match.status}
                    </span>
                </div>
                <div className="flex flex-col items-center text-center w-2/5 gap-1">
                     <ReactCountryFlag countryCode={teamTwo.code} svg style={{ width: '2em', height: '2em', borderRadius: '50%' }} />
                    <span className="text-white font-semibold text-sm">{teamTwo.short}</span>
                </div>
            </div>
            {match.status === 'Live' && (
                <button
                    onClick={onWatch}
                    className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 rounded-md transition-colors flex items-center justify-center gap-1.5"
                >
                    <IoVideocamOutline />
                    Watch Live
                </button>
            )}
        </div>
    );
};

function LiveTvContent() {
    const searchParams = useSearchParams();
    const playUrlFromQuery = searchParams.get('play');

    const [matches, setMatches] =  useState<Match[]>([]);;
    const [loading, setLoading] = useState(true);
    const [nowPlaying, setNowPlaying] = useState<any | null>(null);
    
    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/matches`);
                const data = await res.json();
                setMatches(data);

                if (playUrlFromQuery) {
                    const matchToPlay = data.find((m: any) => m.streamUrl === playUrlFromQuery);
                    if (matchToPlay) setNowPlaying(matchToPlay);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [playUrlFromQuery]);

    return (
        <div>
            {nowPlaying && (
                <div className="mb-8">
                    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl">
                        <ReactPlayer url={nowPlaying.streamUrl} playing controls width="100%" height="100%" />
                    </div>
                    <LiveBettingInterface match={nowPlaying} />
                </div>
            )}

            {/* ... Filter Buttons and Matches Grid ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match: any) => (
                    <MatchCard key={match._id} match={match} onWatch={() => setNowPlaying(match)} />
                ))}
            </div>
        </div>
    );
}

export default function LiveTvPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Live TV & Matches</h1>
            <Suspense fallback={<p className="text-center text-gray-400">Loading Page...</p>}>
                <LiveTvContent />
            </Suspense>
        </div>
    );
}