import { redirect } from 'next/navigation';

async function getFirstTikTokVideoId() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
        const res = await fetch(`${apiUrl}/api/videos?source=TikTok&limit=1`);
        const data = await res.json();
        return data[0]?.sourceId || null;
    } catch (error) {
        console.error("Could not fetch first TikTok video:", error);
        return null;
    }
}

// This is a Server Component
export default async function TikTokRedirectPage() {
    const firstVideoId = await getFirstTikTokVideoId();

    if (firstVideoId) {
        // If a video is found, redirect to its player page
        redirect(`/tiktok/${firstVideoId}`);
    } else {
        // If no videos are found, show a message
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-white">
                <p>No TikTok videos available at the moment.</p>
            </div>
        );
    }
}