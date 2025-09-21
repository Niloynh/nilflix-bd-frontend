export interface Match {
    _id: string;
    sport: 'Cricket' | 'Football';
    teamOne: string;
    teamTwo: string;
    teamOneLogo?: string;
    teamTwoLogo?: string;
    matchTime: string;
    status: 'Upcoming' | 'Live' | 'Finished' | 'Cancelled';
    streamUrl: string;
    teamOneScore?: string;
    teamTwoScore?: string;
    overs?: string;
}

export interface Video {
    _id: string;
    sourcePlatform: 'YouTube' | 'TikTok';
    sourceId: string;
    title: string;
    thumbnailUrl: string;
    channelTitle?: string;
    sourceStats?: {
        views?: string;
        likes?: string;
        comments?: string;
    };
    publishedAt: string;
}