"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MatchCard = ({ match }: any) => (
    <Link href={`/live-tv?match=${match._id}`} className="block bg-gray-800/50 border border-gray-700 rounded-lg p-2 text-center flex flex-col justify-between h-28 hover:border-red-500 transition-colors">
        <div className="flex items-center justify-between">
            <span className={`text-white text-[10px] font-bold px-1.5 py-0.5 rounded ${match.status === 'Live' ? 'bg-red-600' : 'bg-blue-600'}`}>
                {match.status}
            </span>
            <span className="text-gray-400 text-xs">{new Date(match.matchTime).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <div className="flex items-center justify-around text-white font-semibold text-sm">
            <span>{match.teamOne}</span>
            <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-bold">vs</span>
            </div>
            <span>{match.teamTwo}</span>
        </div>
        <div className="text-gray-400 text-xs truncate">
            {match.sport}
        </div>
    </Link>
);

const LiveMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSport, setActiveSport] = useState('football');

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/matches`);
                const data = await res.json();
                setMatches(data);
            } catch (error) {
                console.error("Failed to fetch matches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    if (loading) return <p className="text-gray-400 my-6">Loading Live Matches...</p>;

    const filteredMatches = matches.filter((match: any) => 
        match.sport.toLowerCase() === activeSport
    );

    return (
        <div className="my-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">Live Matches</h2>
                <Link href="/live-tv" className="text-xs text-red-500 hover:underline">See All</Link>
            </div>
            <div className="flex space-x-3 mb-3">
                <button onClick={() => setActiveSport('football')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSport === 'football' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Football</button>
                <button onClick={() => setActiveSport('cricket')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSport === 'cricket' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Cricket</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map(match => (
                        <MatchCard key={(match as any)._id} match={match} />
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center py-4">No {activeSport} matches found.</p>
                )}
            </div>
        </div>
    );
};

export default LiveMatches;