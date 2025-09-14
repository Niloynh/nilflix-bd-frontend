import Link from 'next/link';

async function getYouTubeVideos() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${apiUrl}/api/videos?source=YouTube&limit=10`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function YouTubeTrendList() {
  const videos = await getYouTubeVideos();
  if (videos.length === 0) return null;

  return (
    <section className="my-8">
      <h2 className="text-white text-2xl font-bold mb-4">YouTube Trends</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {videos.map((video: any) => (
          <Link href={`/youtube/${video.sourceId}`} key={video._id} className="group flex-shrink-0 w-64">
            <div className="relative">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-36 object-cover rounded-lg mb-2" />
            </div>
            <h4 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h4>
          </Link>
        ))}
      </div>
    </section>
  );
}