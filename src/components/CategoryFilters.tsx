"use client";

type CategoryFiltersProps = {
    activeCategory: string;
    setActiveCategory: (category: string) => void;
};

const categories = ["All", "Music", "Gaming", "News", "Movies", "Sports"];

export default function CategoryFilters({ activeCategory, setActiveCategory }: CategoryFiltersProps) {
    return (
        // --- নতুন no-scrollbar ক্লাসটি এখানে যোগ করা হয়েছে ---
        <div className="flex items-center gap-2 overflow-x-auto pb-2 my-4 no-scrollbar">
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                        activeCategory === category
                            ? 'bg-white text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}