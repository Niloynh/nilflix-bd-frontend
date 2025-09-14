"use client";
import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CountryFlag from 'react-country-flag';
import Link from 'next/link';

// ডামি ডেটা
const otherMatchesData = [
    { id: 1, series: "Walton Series", teams: [{ name: "BAN", countryCode: "BD" }, { name: "PAK", countryCode: "PK" }], score: "156/7", isLive: true, type: "cricket", bgColor: "from-indigo-600 to-indigo-800" },
    { id: 3, series: "Global Cup", teams: [{ name: "GER", countryCode: "DE" }, { name: "BRA", countryCode: "BR" }], score: "2-0", isLive: true, type: "football", bgColor: "from-green-600 to-green-800" },
    { id: 2, series: "MMN Series", teams: [{ name: "NEP", countryCode: "NP" }, { name: "UAE", countryCode: "AE" }], score: "1-1", isLive: true, type: "cricket", bgColor: "from-purple-600 to-purple-800" },
    { id: 4, series: "Asian Series", teams: [{ name: "SL", countryCode: "LK" }, { name: "IND", countryCode: "IN" }], score: "245/8", isLive: false, type: "cricket", bgColor: "from-pink-600 to-pink-800" },
];

const OtherMatchCard = ({ match }: any) => (
    <div className={`flex flex-col justify-between p-3 rounded-xl shadow-lg h-40 w-full bg-gradient-to-br ${match.bgColor}`}>
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-white font-semibold text-sm">{match.series}</h3>
            </div>
            {match.isLive && (
                <span className="flex items-center text-white text-xs font-bold bg-black/20 px-2 py-1 rounded-full">
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                    LIVE
                </span>
            )}
        </div>
        
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <CountryFlag countryCode={match.teams[0].countryCode} svg style={{ width: '1.5em', height: '1.5em' }} />
                <span className="text-white text-xl font-bold">{match.teams[0].name}</span>
            </div>
            <span className="text-white text-xl font-bold">{match.score}</span>
            <div className="flex items-center gap-2">
                <span className="text-white text-xl font-bold">{match.teams[1].name}</span>
                <CountryFlag countryCode={match.teams[1].countryCode} svg style={{ width: '1.5em', height: '1.5em' }} />
            </div>
        </div>

        {/* --- নতুন "Watch Live" বাটন --- */}
        <Link href="/live-tv" className="mt-2 w-full bg-black/30 hover:bg-black/50 text-white text-xs text-center py-1.5 rounded-lg font-medium transition-colors">
            Watch Live
        </Link>
        {/* --------------------------------- */}
    </div>
);

const OtherLiveMatches = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredMatches = otherMatchesData.filter(match => {
        if (activeFilter === 'all') return true;
        return match.type === activeFilter;
    });

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
                    centerSlidePercentage={70}
                    emulateTouch={true}
                    showArrows={false}
                >
                    {filteredMatches.map(match => (
                        <div key={match.id} className="px-1.5">
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