"use client";
import { useState, useEffect } from 'react';
import { IoGameControllerOutline } from "react-icons/io5";

// টাইপগুলো ডিফাইন করা হলো
interface Option { text: string; rate: number; _id: string; }
interface Question { _id: string; question: string; options: Option[]; }
interface Match { sport: 'Cricket' | 'Football'; }

export default function LiveBettingInterface({ match }: { match: Match | any }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedBet, setSelectedBet] = useState<{ questionId: string, prediction: string, rate: number } | null>(null);
    const [pointsStaked, setPointsStaked] = useState(10);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!match?._id) return;

        const fetchQuestions = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/betting-questions/${match._id}`);
                const data = await res.json();
                setQuestions(data);
            } catch (error) {
                console.error("Failed to fetch betting questions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
        const interval = setInterval(fetchQuestions, 15000); // প্রতি ১৫ সেকেন্ডে প্রশ্ন রিফ্রেশ হবে
        return () => clearInterval(interval);

    }, [match]);

    const handlePlaceBet = async () => {
        if (!selectedBet || pointsStaked <= 0) {
            setMessage("Please select an option and enter a valid amount.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Please log in to place a bet.");
            return;
        }

        setMessage("Placing bet...");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        try {
            const res = await fetch(`${apiUrl}/api/bets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    matchId: match._id,
                    questionId: selectedBet.questionId,
                    prediction: selectedBet.prediction,
                    pointsStaked
                })
            });
            const data = await res.json();
            setMessage(data.message || "Bet placed successfully!");
        } catch (error) {
            setMessage("Failed to place bet.");
        } finally {
            setSelectedBet(null);
        }
    };

    return (
        <div className="mt-6 border-t-2 border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><IoGameControllerOutline /> Place Your Bet</h2>
            
            {loading && <p className="text-center text-gray-400 my-4">Loading Betting Options...</p>}
            
            {!loading && questions.length === 0 && (
                <p className="text-center text-gray-400 my-4">No live bets available for this match right now.</p>
            )}

            {questions.map((q) => (
                <div key={q._id} className="bg-gray-800 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-200 mb-3">{q.question}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {q.options.map((opt) => (
                            <button
                                key={opt._id}
                                onClick={() => setSelectedBet({ questionId: q._id, prediction: opt.text, rate: opt.rate })}
                                className={`p-2 rounded text-sm transition-colors ${selectedBet?.prediction === opt.text && selectedBet?.questionId === q._id ? 'bg-red-600 text-white ring-2 ring-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                {opt.text} <span className="font-bold text-yellow-400">({opt.rate}x)</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {questions.length > 0 && (
                 <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 bg-gray-900 p-3 rounded-lg">
                    <input
                        type="number"
                        value={pointsStaked}
                        onChange={(e) => setPointsStaked(parseInt(e.target.value, 10))}
                        className="w-full sm:w-24 bg-gray-700 text-white p-2 rounded border border-gray-600"
                        placeholder="Points"
                    />
                    <button
                        onClick={handlePlaceBet}
                        disabled={!selectedBet}
                        className="w-full sm:flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Confirm Bet
                    </button>
                    <button className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                        My Bets
                    </button>
                </div>
            )}
           
            {message && <p className="text-center mt-3 text-yellow-300 text-sm">{message}</p>}
        </div>
    );
}