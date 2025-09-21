"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// সাধারণ গেমের জন্য কার্ড
const GameCard = ({ game }: any) => (
    <Link href={game.gameUrl} target={game.isExternal ? "_blank" : "_self"} className="group cursor-pointer">
        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
            <img 
                src={game.thumbnailUrl} 
                alt={game.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
            />
        </div>
        <h4 className="text-white font-semibold truncate mt-2">{game.name}</h4>
        <p className="text-sm text-yellow-400">{game.prize}</p>
    </Link>
);

// লাইভ বেটিং এর জন্য নতুন কার্ড
const LiveBettingCard = ({ match }: any) => (
    <div className="group cursor-pointer">
        <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
            <img 
                src={match.thumbnailUrl || '/live-bet-banner.png'} // public ফোল্ডারে একটি ডিফল্ট ইমেজ রাখুন
                alt={`${match.teamOne} vs ${match.teamTwo}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                 <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded-full animate-pulse">LIVE</span>
            </div>
        </div>
        <h4 className="text-white font-semibold truncate mt-2">{match.teamOne} vs {match.teamTwo}</h4>
        <Link href={`/play/match-betting/${match._id}`} className="text-sm text-green-400 hover:underline">
            Place Bet
        </Link>
    </div>
);

export default function PlayAndEarnPage() {
    const [games, setGames] = useState([]);
    const [liveMatches, setLiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const cryptoGame = {
        _id: 'crypto-game-static-id',
        name: 'Crypto Challenge',
        thumbnailUrl: '/crypto-game-banner.png',
        prize: 'Win 1.8x Points!',
        gameUrl: '/play/crypto',
        isExternal: false
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                // দুটি API কেই একসাথে কল করা হচ্ছে
                const [gamesRes, matchesRes] = await Promise.all([
                    fetch(`${apiUrl}/api/games`),
                    fetch(`${apiUrl}/api/matches?filter=live`)
                ]);
                const gamesData = await gamesRes.json();
                const matchesData = await matchesRes.json();
                setGames(gamesData);
                setLiveMatches(matchesData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Play & Earn</h1>
            
            {loading ? (
                <p className="text-gray-400">Loading games and matches...</p>
            ) : (
                <>
                    {/* Live Betting Section */}
                    {liveMatches.length > 0 && (
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-white mb-4">Live Match Betting</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {liveMatches.map((match: any) => (
                                    <LiveBettingCard key={match._id} match={match} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Games Section */}
                    <div>
                         <h2 className="text-2xl font-bold text-white mb-4">All Games</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            <GameCard game={cryptoGame} />
                            {games.map((game: any) => (
                                <GameCard key={game._id} game={game} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}