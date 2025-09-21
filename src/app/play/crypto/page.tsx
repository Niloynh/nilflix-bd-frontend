"use client";
import { useState, useEffect } from 'react';
import { IoArrowBackOutline, IoTrendingUp, IoTrendingDown } from 'react-icons/io5';
import Link from 'next/link';

interface GameSession {
    _id: string;
    startTime: string;
    endTime: string;
    startPrice: number;
    status: 'Live' | 'Finished';
    outcome?: 'Up' | 'Down';
    endPrice?: number;
}

export default function CryptoGamePage() {
    const [session, setSession] = useState<GameSession | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [message, setMessage] = useState('');
    const [isWaiting, setIsWaiting] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    // Timer effect
    useEffect(() => {
        if (!session || !isWaiting) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(session.endTime).getTime();
            const difference = Math.round((end - now) / 1000);
            setTimeLeft(difference > 0 ? difference : 0);

            if (difference <= 0) {
                // Time is up, poll for result
                pollForResult(session._id);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [session, isWaiting]);
    
    // Function to poll for the game result
    const pollForResult = async (roundId: string) => {
        setMessage('Round finished! Checking result...');
        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`${apiUrl}/api/crypto-game/result/${roundId}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data: GameSession = await res.json();
                
                if (data.status === 'Finished') {
                    clearInterval(pollInterval);
                    setIsWaiting(false);
                    // We need to check the bet result from another API or deduce it
                    // For now, let's just show the outcome
                    setMessage(`Round Over! The price went ${data.outcome}. New game is ready.`);
                    setSession(null); // Reset for a new game
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 2000); // Check every 2 seconds
    };

    const handlePlay = async (prediction: 'Up' | 'Down') => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('You must be logged in to play.');
            return;
        }

        setIsWaiting(true);
        setMessage('Starting new round...');
        
        try {
            const response = await fetch(`${apiUrl}/api/crypto-game/play`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prediction, pointsStaked: 10 })
            });
            const data = await response.json();
            
            if (response.ok) {
                setSession(data.round);
                setMessage(data.message);
            } else {
                setMessage(`Error: ${data.message}`);
                setIsWaiting(false);
            }
        } catch (error) {
            setMessage('Could not start game. Server error.');
            setIsWaiting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <Link href="/play" className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full">
                <IoArrowBackOutline size={24} />
            </Link>
            
            <h1 className="text-4xl font-bold mb-2">Crypto Price Challenge</h1>
            <p className="text-gray-400 mb-8">Will the price go Up or Down in 30 seconds?</p>

            <div className="w-full max-w-sm bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                {session ? ( // If a game session is active
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium text-gray-400">Round ID: ...{session._id.slice(-6)}</span>
                            <span className="text-lg font-bold text-yellow-400">{timeLeft}s</span>
                        </div>
                        <div className="text-center my-8">
                            <p className="text-gray-400 text-sm">Starting Price</p>
                            <p className="text-4xl font-bold text-white">${session.startPrice.toFixed(2)}</p>
                        </div>
                    </>
                ) : ( // If no game is active, show betting buttons
                    <div className="text-center my-8">
                         <p className="text-gray-400 text-lg mb-4">Place your bet to start</p>
                         <p className="text-sm text-gray-500">(10 points per play)</p>
                    </div>
                )}

                <div className="flex gap-4">
                    <button 
                        onClick={() => handlePlay('Up')}
                        disabled={isWaiting}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <IoTrendingUp size={24} />
                        <span>UP</span>
                    </button>
                    <button 
                        onClick={() => handlePlay('Down')}
                        disabled={isWaiting}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <IoTrendingDown size={24} />
                        <span>DOWN</span>
                    </button>
                </div>
                 {message && <p className="text-center mt-4 text-sm text-yellow-300 h-4">{message}</p>}
            </div>
        </div>
    );
}