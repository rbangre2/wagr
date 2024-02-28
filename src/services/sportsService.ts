import axios from "axios";
import { Fixture, FixturesResponse, TableFixture } from "@/models/Fixture";
import { League } from "@/models/Sport";
import { getLeagueIdFromName } from "@/utils/sportsUtils";

const fetchFixturesPage = async (url: string): Promise<Fixture[]> => {
  const response = await axios.get<FixturesResponse>(url);
  return response.data.data.fixtures;
};

const getLeagueFixtures = async (
  league: League | string
): Promise<TableFixture[]> => {
  const apiKey = process.env.NEXT_PUBLIC_LIVE_SCORE_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_LIVE_SCORE_API_SECRET;
  const competitionId = getLeagueIdFromName(league);
  let fixtures: Fixture[] = [];

  let url = `https://livescore-api.com/api-client/fixtures/matches.json?key=${apiKey}&secret=${apiSecret}&competition_id=${competitionId}&lang=en`;

  try {
    fixtures = await fetchFixturesPage(url);
    for (let i = 0; i < 2; i++) {
      const response = await axios.get<FixturesResponse>(url);
      if (response.data.data.next_page) {
        url = response.data.data.next_page;
        const nextPageFixtures = await fetchFixturesPage(url);
        fixtures = fixtures.concat(nextPageFixtures);
      } else {
        break;
      }
    }
    const tableFixtures: TableFixture[] = fixtures.map((fixture) => ({
      id: fixture.id,
      homeTeam: fixture.home_name,
      awayTeam: fixture.away_name,
      league: fixture.competition.name,
      location: fixture.location,
      date: new Date(fixture.date),
    }));

    console.log(tableFixtures);
    return tableFixtures;
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    throw error;
  }
};

export const getLaLigaFixtures = async (): Promise<TableFixture[]> => {
  return await getLeagueFixtures(League.LaLiga);
};

export const getSerieAFixtures = async (): Promise<TableFixture[]> => {
  return await getLeagueFixtures(League.SerieA);
};
