import MatchCard from "./MatchCard";

async function getMatches() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  try {
    const res = await fetch(`${apiUrl}/api/matches`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return [];
  }
}

export default async function MatchList() {
  const matches = await getMatches();

  return (
    <section className="my-8">
      <h2 className="text-white text-2xl font-bold mb-4">Live Matches</h2>
      {matches.length === 0 ? (
        <p className="text-gray-400">No live or upcoming matches found.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {matches.map((match: any) => (
            <MatchCard
              key={match._id}
              teamOne={match.teamOne}
              teamTwo={match.teamTwo}
              status={match.status}
              matchTime={match.matchTime}
            />
          ))}
        </div>
      )}
    </section>
  );
}