"use client";
import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CountryFlag from 'react-country-flag';
import Link from 'next/link';

const stringToGradient = (str: string) => {
  if (!str) return 'from-gray-700 to-gray-800';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    'from-blue-600 to-blue-800', 'from-green-600 to-green-800',
    'from-purple-600 to-purple-800', 'from-pink-600 to-pink-800',
    'from-indigo-600 to-indigo-800', 'from-teal-600 to-teal-800',
  ];
  const index = Math.abs(hash % gradients.length);
  return gradients[index];
};

const OtherMatchCard = ({ match }: any) => {
    const cardGradient = stringToGradient(match.teamOne); // Use team name for color
    return (
        <div className={`flex flex-col justify-between p-3 rounded-xl shadow-lg h-36 w-full bg-gradient-to-br ${cardGradient}`}>
            <div className="flex justify-between items-start">
                <h3 className="text-white font-semibold text-sm">{match.sport}</h3>
                {match.status === 'Live' && (
                    <span className="flex items-center text-white text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                        LIVE
                    </span>
                )}
            </div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col items-center gap-1">
                    {/* Assuming country code can be derived or is in DB */}
                    <span className="text-white text-sm font-bold">{match.teamOne}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-white text-xl font-bold mb-1">{match.result || 'vs'}</span>
                    <Link href="/live-tv" className="text-gray-200 hover:bg-white/20 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full transition-colors">
                        Watch
                    </Link>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-white text-sm font-bold">{match.teamTwo}</span>
                </div>
            </div>
        </div>
    );
};

const OtherLiveMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                // Fetching only 'Live' matches for this component
                const res = await fetch(`${apiUrl}/api/matches?filter=live`);
                const data = await res.json();
                setMatches(data);
            } catch (error) {
                console.error("Failed to fetch other live matches:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    const filteredMatches = matches.filter((match: any) => {
        if (activeFilter === 'all') return true;
        return match.sport.toLowerCase() === activeFilter;
    });

    if (loading) return <div className="my-8"><p className="text-gray-400">Loading Other Matches...</p></div>;
    if (matches.length === 0) return null;

    return (
        <div className="my-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Other Live Matches</h2>
                <div className="flex space-x-2">
                    <button onClick={() => setActiveFilter('all')} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>All</button>
                    <button onClick={() => setActiveFilter('football')} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'football' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Football</button>
                    <button onClick={() => setActiveFilter('cricket')} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === 'cricket' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Cricket</button>
                </div>
            </div>

            {filteredMatches.length > 0 ? (
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    showIndicators={false}
                    infiniteLoop={true}
                    centerMode={true}
                    centerSlidePercentage={65}
                    emulateTouch={true}
                    showArrows={false}
                >
                    {filteredMatches.map(match => (
                        <div key={(match as any)._id} className="px-1.5">
                            <OtherMatchCard match={match} />
                        </div>
                    ))}
                </Carousel>
            ) : (
                <p className="text-gray-400 text-center">No matches found for this filter.</p>
            )}
        </div>
    );
};

export default OtherLiveMatches;