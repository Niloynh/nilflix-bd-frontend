import Link from 'next/link';
import { IoHome, IoVideocam, IoGameController, IoFilm } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2 flex justify-around md:hidden z-50">
      <Link href="/" className="flex flex-col items-center text-red-500 w-16"><IoHome size={24} /><span className="text-xs mt-1">Home</span></Link>
      <Link href="/live-tv" className="flex flex-col items-center text-gray-400 w-16"><IoVideocam size={24} /><span className="text-xs mt-1">Live TV</span></Link>
      <Link href="/play" className="flex flex-col items-center text-gray-400 w-16"><IoGameController size={24} /><span className="text-xs mt-1">Play & Earn</span></Link>
      <Link href="/movies" className="flex flex-col items-center text-gray-400 w-16"><IoFilm size={24} /><span className="text-xs mt-1">Movies</span></Link>
      <Link href="/profile" className="flex flex-col items-center text-gray-400 w-16"><CgProfile size={24} /><span className="text-xs mt-1">My/NilFlix</span></Link>
    </nav>
  );
};

export default BottomNav;