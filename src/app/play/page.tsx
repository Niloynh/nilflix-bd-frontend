"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

const GameCard = ({ game }: any) => (
    <Link href={game.gameUrl} target="_blank" className="group cursor-pointer">
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

export default function PlayAndEarnPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/games`);
                const data = await res.json();
                setGames(data);
            } catch (error) {
                console.error("Failed to fetch games:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white">Play & Earn</h1>
            
            {loading ? (
                <p className="text-gray-400">Loading games...</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {games.map((game: any) => (
                        <GameCard key={game._id} game={game} />
                    ))}
                </div>
            )}
        </div>
    );
}