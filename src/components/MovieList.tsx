import MovieCard from "./MovieCard";

async function getMovies() {
  // নিশ্চিত করুন আপনার ব্যাকএন্ড সার্ভার 4000 পোর্টে চলছে!
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  try {
    const res = await fetch(`${apiUrl}/api/movies`, {
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error('Failed to fetch movies:', res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Network error fetching movies:', error);
    return [];
  }
}

export default async function MovieList() {
  const movies = await getMovies();

  return (
    <section className="my-8">
      <h2 className="text-white text-2xl font-bold mb-4">Popular Movies</h2>
      
      {movies.length === 0 ? (
        <p className="text-gray-400">No movies found in the database.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {movies.map((movie: any) => (
            // --- এই অংশটি আপডেট করা হয়েছে ---
            <MovieCard 
              key={movie._id} 
              title={movie.title} 
              posterUrl={movie.posterUrl}
              genre={movie.genre}
              releaseYear={movie.releaseYear}
              rating={8.5} // আমরা পরে এটিকে ডাইনামিক করব
            />
            // ---------------------------------
          ))}
        </div>
      )}
    </section>
  );
}