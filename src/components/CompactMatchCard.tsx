import Link from 'next/link';

type CardProps = {
  teamOne: string;
  teamTwo: string;
  streamUrl: string;
};

export default function CompactMatchCard({ teamOne, teamTwo, streamUrl }: CardProps) {
  // আমরা আপাতত পতাকার জন্য ইমোজি ব্যবহার করছি
  const getFlag = (teamName: string) => {
    if (teamName.toLowerCase().includes('bangladesh')) return '🇧🇩';
    if (teamName.toLowerCase().includes('india')) return '🇮🇳';
    return '🏳️';
  };

  return (
    <Link href={`/live-tv?stream=${encodeURIComponent(streamUrl)}`} className="flex-shrink-0 w-48 bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center gap-3 hover:bg-gray-700 transition-colors">
      <div className="flex flex-col items-center">
        <span className="text-2xl">{getFlag(teamOne)}</span>
        <span className="text-white text-xs font-semibold">{teamOne.substring(0, 3).toUpperCase()}</span>
      </div>
      <span className="text-gray-400 text-sm">VS</span>
      <div className="flex flex-col items-center">
        <span className="text-2xl">{getFlag(teamTwo)}</span>
        <span className="text-white text-xs font-semibold">{teamTwo.substring(0, 3).toUpperCase()}</span>
      </div>
    </Link>
  );
}