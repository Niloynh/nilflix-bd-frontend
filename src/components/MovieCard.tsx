import { IoStar } from 'react-icons/io5';

type MovieCardProps = {
  title: string;
  posterUrl: string;
  genre: string;
  releaseYear: number;
  rating: number; // We'll add a rating field later
};

export default function MovieCard({ title, posterUrl, genre, releaseYear, rating }: MovieCardProps) {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 cursor-pointer group">
      <div className="relative">
        <img 
          src={posterUrl} 
          alt={title} 
          className="rounded-lg w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <IoStar className="text-yellow-400" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
      <h3 className="text-white text-md mt-2 truncate font-semibold">{title}</h3>
      <p className="text-gray-400 text-xs truncate">{genre} • {releaseYear}</p>
    </div>
  );
}