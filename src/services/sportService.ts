import { FootballMatch } from '@/models/FootballMatch';

export const fetchFootballGames = async (): Promise<FootballMatch[]> => {
  try {
    const response = await fetch('https://api.football-data.org/v4/matches/', {
      method: 'GET',
      headers: { 'X-Auth-Token': 'f71d90348b144003b17d30ad374da2af' },
    });
    const data = await response.json();
    const transformedData: FootballMatch[] = data.match.map((match: any) => ({
        id: match.id,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        league: match.competition.name,
        date: new Date(match.utcDate).toLocaleString(),
        status: match.status,
    }));

    return transformedData;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error if you want calling code to handle it
  }
};
