"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoSearch, IoNotificationsOutline, IoHome, IoHomeOutline, IoLogoYoutube, IoLogoTiktok, IoVideocam, IoGameController, IoFilm } from 'react-icons/io5';
import { FaRegMoon } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';

// Import your content components
import OtherLiveMatches from '@/components/OtherLiveMatches';
import YouTubeTrends from '@/components/YouTubeTrends';
import TikTokReels from '@/components/TikTokReels';
import VideoFeed from '@/components/VideoFeed';

// ===== Header Component (Defined inside the page) =====
const Header = ({ activeTab, setActiveTab, isScrolled }: any) => {
    const tabs = [
        { name: "Home", Icon: IoHomeOutline, activeColor: 'text-red-500' },
        { name: "YouTube", Icon: IoLogoYoutube, activeColor: 'text-red-600' },
        { name: "TikTok", Icon: IoLogoTiktok, activeColor: 'text-white' }
    ];
    
    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? 'h-0' : 'h-16'}`}>
                <div className="h-full container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="relative">
                        <h1 className="text-2xl font-extrabold text-white tracking-wider">NILFLIX</h1>
                        <span className="absolute -top-0.5 -right-4.5 text-[10px] font-bold text-red-600">BD</span>
                    </Link>
                    <div className="flex items-center space-x-2 text-white">
                        <button className="p-2 hover:bg-white/10 rounded-full"><IoSearch size={22} /></button>
                        <button className="p-2 relative hover:bg-white/10 rounded-full"><IoNotificationsOutline size={24} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-full"><FaRegMoon size={20} /></button>
                    </div>
                </div>
            </div>
            <div className="border-b border-gray-800/50">
                <div className="container mx-auto px-4 flex items-center justify-between h-14">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.Icon;
                            return (
                                <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`flex items-center gap-2 text-base font-semibold py-3 border-b-2 transition-colors duration-300 ${activeTab === tab.name ? `${tab.activeColor} border-red-600` : 'text-gray-400 border-transparent hover:text-white'}`}>
                                    <Icon size={18} />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className={`flex items-center space-x-2 text-white transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <button className="p-2 hover:bg-white/10 rounded-full"><IoSearch size={22} /></button>
                        <button className="p-2 relative hover:bg-white/10 rounded-full">
                            <IoNotificationsOutline size={24} />
                            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

// ===== BottomNav Component (Defined inside the page) =====
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


// ===== Main Home Page Component =====
export default function Home() {
    const [activeTab, setActiveTab] = useState('Home');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} isScrolled={isScrolled} />
            
            <div className="container mx-auto px-4 pt-32 pb-20">
                {activeTab === 'Home' && (
                    <>
                        <OtherLiveMatches />
                        <TikTokReels />
                        <YouTubeTrends />
                    </>
                )}
                {activeTab === 'YouTube' && <VideoFeed source="YouTube" />}
                {activeTab === 'TikTok' && <VideoFeed source="TikTok" />}
            </div>
            <BottomNav />
        </div>
    );
}