"use client";
import { useState } from 'react';
import Header from '@/components/Header';
import LiveMatches from '@/components/LiveMatches';
import OtherLiveMatches from '@/components/OtherLiveMatches';
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
                        {/* --- Live Match sections have been added back --- */}
                        <LiveMatches />
                        <OtherLiveMatches />
                        <YouTubeShortsGrid />
                        <YouTubeTrends />
                        {/* ------------------------------------------------ */}
                    </>
                )}
                
                {activeTab === 'YouTube' && (
                    <>
                        <CategoryFilters 
                            activeCategory={activeCategory} 
                            setActiveCategory={setActiveCategory} 
                        />
                        <YouTubeShortsGrid />
                        <VideoFeed 
                            source="YouTube" 
                            category={activeCategory}
                        />
                    </>
                )}

                {activeTab === 'TikTok' && (
                    <>
                        <TikTokReels /> 
                        <VideoFeed source="TikTok" category="All" />
                    </>
                )}
            </div>
            
            <BottomNav />
        </div>
    );
}