import Link from 'next/link';

async function getTikTokShorts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  try {
    // limit=4 ব্যবহার করে শুধু ৪টি TikTok ভিডিও আনা হচ্ছে
    const res = await fetch(`${apiUrl}/api/videos?source=TikTok&limit=4`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ShortsGrid() {
  const shorts = await getTikTokShorts();
  if (shorts.length === 0) return null;

  return (
    <section className="my-8">
      <h2 className="text-white text-2xl font-bold mb-4">TikTok Shorts</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shorts.map((video: any) => (
          <Link href={`/tiktok/${video.sourceId}`} key={video._id} className="group cursor-pointer aspect-[9/16] relative overflow-hidden rounded-lg">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-xs truncate">{video.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}