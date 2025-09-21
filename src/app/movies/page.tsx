"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoStar, IoTimerOutline } from 'react-icons/io5';

// মুভির ডেটার জন্য একটি টাইপ
interface Movie {
    _id: string;
    title: string;
    posterUrl: string;
    genre: string;
    releaseYear: number;
    duration?: number; // সময়কাল (মিনিটে)
    rating?: number; // এই রেটিং ডাইনামিক্যালি আসবে
}

// জেনার 필্টারগুলো
const genres = [
    { name: 'All Movies', emoji: '🍿' },
    { name: 'Action', emoji: '🎬' },
    { name: 'Comedy', emoji: '😂' },
    { name: 'Romance', emoji: '😍' },
    { name: 'Horror', emoji: '👻' },
    { name: 'Drama', emoji: '👨‍👩‍👧‍👦' },
    { name: 'Sci-Fi', emoji: '🧑‍🚀' },
];

// কার্ড কম্পোনেন্ট
const MoviePageCard = ({ movie }: { movie: Movie }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden group">
        <div className="relative">
            <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <IoStar className="text-yellow-400" />
                <span>{movie.rating || 8.5}</span>
            </div>
        </div>
        <div className="p-4">
            <h3 className="text-white font-bold truncate">{movie.title}</h3>
            <div className="flex justify-between items-center text-gray-400 text-xs mt-1">
                <span>{movie.releaseYear}</span>
                {movie.duration && (
                    <div className="flex items-center gap-1">
                        <IoTimerOutline />
                        <span>{movie.duration} min</span>
                    </div>
                )}
            </div>
            <Link href={`/movie/${movie._id}`} className="mt-4 block w-full bg-red-600 hover:bg-red-700 text-white text-center font-semibold py-2 rounded-md transition-colors">
                Watch Now
            </Link>
        </div>
    </div>
);

export default function MoviesPage() {
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [selectedGenre, setSelectedGenre] = useState('সকল মুভি');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            try {
                const res = await fetch(`${apiUrl}/api/movies`);
                const data = await res.json();
                setAllMovies(data);
                setFilteredMovies(data); // প্রথমে সব মুভি দেখানো হবে
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        if (selectedGenre === 'সকল মুভি') {
            setFilteredMovies(allMovies);
        } else {
            const filtered = allMovies.filter(movie => movie.genre.includes(selectedGenre));
            setFilteredMovies(filtered);
        }
    }, [selectedGenre, allMovies]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Filter Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">🍿Movies</h2>
                <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                        <button
                            key={genre.name}
                            onClick={() => setSelectedGenre(genre.name)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 flex items-center gap-2 ${selectedGenre === genre.name ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            {genre.emoji} {genre.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Movie Cards */}
            {loading ? (
                <p className="text-center text-gray-400">Loading movies...</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredMovies.map(movie => (
                        <MoviePageCard key={movie._id} movie={movie} />
                    ))}
                </div>
            )}
             {/* Tagline */}
             <p className="text-center text-gray-500 mt-12 text-sm">“তোমার পছন্দের মুভি, তোমার মতো করে”</p>
        </div>
    );
}