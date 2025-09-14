import CompactMatchCard from "./CompactMatchCard";

async function getLiveMatches() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${apiUrl}/api/matches?filter=live`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch live matches:", error);
    return [];
  }
}

export default async function LiveMatchBanner() {
  const liveMatches = await getLiveMatches();

  if (liveMatches.length === 0) {
    return null; // যদি কোনো লাইভ ম্যাচ না থাকে, তাহলে কিছুই দেখাবে না
  }

  return (
    <section className="my-6">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {liveMatches.map((match: any) => (
          <CompactMatchCard
            key={match._id}
            teamOne={match.teamOne}
            teamTwo={match.teamTwo}
            streamUrl={match.streamUrl}
          />
        ))}
      </div>
    </section>
  );
}