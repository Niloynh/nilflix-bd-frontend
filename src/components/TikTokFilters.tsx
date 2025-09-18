"use client";
import { useState } from 'react'; // <-- This line was missing

export default function TikTokFilters() {
    const [activeFilter, setActiveFilter] = useState("For You");
    const filters = ["For You", "Following", "Viral", "Trending"];

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 my-4 no-scrollbar">
            {filters.map(filter => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                        activeFilter === filter
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
}