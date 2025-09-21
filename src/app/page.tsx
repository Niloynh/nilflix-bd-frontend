"use client";
import { useState } from 'react';
import Header from '@/components/Header';
import LiveMatchesCarousel from '@/components/LiveMatchesCarousel';
import YouTubeTrends from '@/components/YouTubeTrends';
import TikTokReels from '@/components/TikTokReels';
import VideoFeed from '@/components/VideoFeed';
import BottomNav from '@/components/BottomNav';
import CategoryFilters from '@/components/CategoryFilters';
import YouTubeShortsGrid from '@/components/YouTubeShortsGrid';

export default function Home() {
    const [activeTab, setActiveTab] = useState('Home');
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <div>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="container mx-auto px-4 pb-20">
                {activeTab === 'Home' && (
                    <>
                        <LiveMatchesCarousel />
                        <YouTubeShortsGrid />
                        <YouTubeTrends />
                        <TikTokReels />
                    </>
                )}
                {activeTab === 'YouTube' && (
                    <>
                        <CategoryFilters 
                            activeCategory={activeCategory} 
                            setActiveCategory={setActiveCategory} 
                        />
                        <VideoFeed source="YouTube" category={activeCategory} />
                    </>
                )}
                {activeTab === 'TikTok' && (
                    <>
                        <VideoFeed source="TikTok" category="All" />
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    );
}