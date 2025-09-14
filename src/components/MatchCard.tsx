import { IoFlash } from 'react-icons/io5';

type MatchCardProps = {
  teamOne: string;
  teamTwo: string;
  status: string;
  matchTime: string;
};

export default function MatchCard({ teamOne, teamTwo, status, matchTime }: MatchCardProps) {
  const time = new Date(matchTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="flex-shrink-0 w-64 bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-red-500 transition-colors duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">Cricket Match</span>
        {status === 'Live' && (
          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center">
            <IoFlash />
            <span className="ml-1">LIVE</span>
          </div>
        )}
      </div>
      <h3 className="text-white font-bold text-lg">{teamOne} vs {teamTwo}</h3>
      <p className="text-gray-300 text-sm">{time}</p>
    </div>
  );
}