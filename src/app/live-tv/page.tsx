"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { IoChevronBackOutline } from "react-icons/io5";

// ReactPlayer-কে শুধু ক্লায়েন্ট-সাইডে লোড করা হচ্ছে
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const MatchCard = ({ match, onWatch }: { match: any, onWatch: () => void }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 text-center flex flex-col justify-between h-36 hover:border-red-500 transition-colors">
        <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>{new Date(match.matchTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span className={`font-bold px-1.5 py-0.5 rounded ${match.status === 'Live' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                {match.status}
            </span>
        </div>
        <div className="flex items-center justify-around text-white font-semibold text-sm my-2">
            <div className="flex flex-col items-center">
                <img src={match.teamOneFlag || '/default-flag.png'} alt={match.teamOne} className="w-8 h-8 rounded-full mb-1" />
                <span>{match.teamOne}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-gray-400 text-xs">{new Date(match.matchTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-lg font-bold">vs</span>
            </div>
            <div className="flex flex-col items-center">
                <img src={match.teamTwoFlag || '/default-flag.png'} alt={match.teamTwo} className="w-8 h-8 rounded-full mb-1" />
                <span>{match.teamTwo}</span>
            </div>
        </div>
        <button
            onClick={onWatch}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 rounded-md transition-colors"
        >
            Watch
        </button>
    </div>
);

function LiveTvContent() {
    const searchParams = useSearchParams();
    const playUrlFromQuery = searchParams.get('play');

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [streamToPlay, setStreamToPlay] = useState<string | null>(playUrlFromQuery);
    const [activeFilter, setActiveFilter] = useState('live'); // ডিফল্টভাবে "Live Now"

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/matches?filter=${activeFilter}`);
                const data = await res.json();
                setMatches(data);
                
                // --- এই লজিকটি আপডেট করা হয়েছে ---
                if (playUrlFromQuery) {
                    setStreamToPlay(playUrlFromQuery);
                } else if (data.length > 0) {
                    // যদি কোনো স্ট্রিম URL থেকে না আসে, তাহলে প্রথম ম্যাচটি দেখাবে
                    setStreamToPlay(data[0].streamUrl);
                } else {
                    setStreamToPlay(null);
                }
                // ---------------------------------

            } catch (error) {
                console.error("Failed to fetch matches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, [activeFilter, playUrlFromQuery]);

    if (streamToPlay) {
        return (
            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                <button
                    onClick={() => setStreamToPlay(null)}
                    className="absolute top-4 left-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                    <IoChevronBackOutline size={22} />
                </button>
                <ReactPlayer
                    url={streamToPlay}
                    playing={true}
                    controls={true}
                    width="100%"
                    height="100%"
                />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveFilter('live')} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg ${activeFilter === 'live' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'}`}>Live Now</button>
                <button onClick={() => setActiveFilter('today')} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg ${activeFilter === 'today' ? 'bg-white text-black' : 'bg-white/10 text-gray-300'}`}>Today</button>
                <button onClick={() => setActiveFilter('upcoming')} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg ${activeFilter === 'upcoming' ? 'bg-white text-black' : 'bg-white/10 text-gray-300'}`}>Upcoming</button>
                <button onClick={() => setActiveFilter('all')} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg ${activeFilter === 'all' ? 'bg-white text-black' : 'bg-white/10 text-gray-300'}`}>All Matches</button>
            </div>

            {loading ? (
                <p className="text-center text-gray-400">Loading matches...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {matches.length > 0 ? (
                        matches.map((match: any) => (
                            <MatchCard key={match._id} match={match} onWatch={() => setStreamToPlay(match.streamUrl)} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400">No matches found for this filter.</p>
                    )}
                </div>
            )}
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