"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { IoArrowBackOutline } from 'react-icons/io5';

// টাইপগুলো ডিফাইন করা হলো
interface Option {
    text: string;
    rate: number;
    _id: string;
}
interface Question {
    _id: string;
    question: string;
    options: Option[];
    status: string;
}
interface Match {
    teamOne: string;
    teamTwo: string;
}

export default function MatchBettingPage() {
    const params = useParams();
    const { matchId } = params;

    const [match, setMatch] = useState<Match | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!matchId) return;

        const fetchBettingData = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                // এখানে ম্যাচ এবং প্রশ্ন দুটিকেই একসাথে fetch করতে পারেন
                const matchRes = await fetch(`${apiUrl}/api/matches/${matchId}`);
                const matchData = await matchRes.json();
                setMatch(matchData);

                // এই API রুটটি আপনাকে ব্যাকএন্ডে তৈরি করতে হবে
                const questionsRes = await fetch(`${apiUrl}/api/betting-questions/${matchId}`);
                const questionsData = await questionsRes.json();
                setQuestions(questionsData);

            } catch (error) {
                console.error("Failed to fetch betting data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBettingData();
    }, [matchId]);

    const handleBet = (questionId: string, optionText: string) => {
        // এখানে বেট করার API কল যুক্ত করতে হবে
        alert(`Betting on "${optionText}" for question ${questionId}`);
    };

    if (loading) return <p className="text-center text-gray-400 mt-20">Loading Betting Options...</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/play" className="p-2 bg-gray-800 rounded-full">
                    <IoArrowBackOutline size={22} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">{match?.teamOne} vs {match?.teamTwo}</h1>
                    <p className="text-red-500 font-semibold">Live Betting</p>
                </div>
            </div>

            <div className="space-y-6">
                {questions.map((q) => (
                    <div key={q._id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">{q.question}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {q.options.map((opt) => (
                                <button
                                    key={opt._id}
                                    onClick={() => handleBet(q._id, opt.text)}
                                    className="bg-gray-700 p-3 rounded-md text-left hover:bg-gray-600 transition-colors"
                                >
                                    <span className="font-semibold">{opt.text}</span>
                                    <span className="block text-yellow-400 text-sm mt-1">{opt.rate}x</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {questions.length === 0 && <p className="text-gray-400 text-center">No active bets for this match right now.</p>}
            </div>
        </div>
    );
}