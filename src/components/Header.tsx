"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoSearch, IoNotificationsOutline } from 'react-icons/io5';
import { FaRegMoon } from 'react-icons/fa';

// Import your custom SVG icons
import HomeIcon from './icons/HomeIcon';
import YouTubeIcon from './icons/YouTubeIcon';
import TikTokIcon from './icons/TikTokIcon';

type HeaderProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const tabs = [
        { name: "Home", isLink: false, Icon: HomeIcon },
        { name: "YouTube", isLink: false, Icon: YouTubeIcon },
        { name: "TikTok", isLink: true, href: '/tiktok', Icon: TikTokIcon }
    ];

    return (
        <header className={`sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
            {/* Top Bar (hides on scroll) */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScrolled ? 'h-0' : 'h-16'}`}>
                <div className="h-full container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="relative">
                        <h1 className="text-2xl font-extrabold text-white tracking-wider">NILFLIX</h1>
                        <span className="absolute -top-0.5 -right-2.5 text-[10px] font-bold text-red-600">BD</span>
                    </Link>
                    <div className="flex items-center space-x-2 text-white">
                        <button className="p-2 hover:bg-white/10 rounded-full"><IoSearch size={22} /></button>
                        <button className="p-2 relative hover:bg-white/10 rounded-full"><IoNotificationsOutline size={24} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-full"><FaRegMoon size={20} /></button>
                    </div>
                </div>
            </div>

            {/* Filter Tabs (always visible) */}
            <div className="border-b border-gray-800/50">
                <div className="container mx-auto px-4 flex items-center justify-between h-14">
                    <div className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.Icon;
                            const isActive = activeTab === tab.name;
                            const className = `flex items-center gap-2 text-base font-semibold py-3 border-b-2 transition-opacity ${isActive ? 'text-white border-red-600' : 'text-gray-400 border-transparent hover:text-white hover:opacity-100 opacity-70'}`;

                            const content = (
                                <>
                                    <Icon isActive={isActive} />
                                    <span>{tab.name}</span>
                                </>
                            );

                            if (tab.isLink) {
                                return (
                                    <Link href={tab.href!} key={tab.name} className={className}>
                                        {content}
                                    </Link>
                                );
                            }
                            return (
                                <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={className}>
                                    {content}
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