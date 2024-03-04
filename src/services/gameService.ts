import { Event } from "@/models/Event";
import axios from "axios";

export const getResultForEvent = async (
  event: Event
): Promise<string | null> => {
  const url = `https://livescore-api.com/api-client/teams/matches.json?key=${process.env.NEXT_PUBLIC_apiKey}&secret=${process.env.NEXT_PUBLIC_apiSecret}&number=1&team_id=${event.homeId}`;

  try {
    const response = await axios.get(url);
    const matches = response.data.data;

    const match = matches.length > 0 ? matches[0] : null;
    console.log(match);

    if (match && match.away_id == event.awayId) {
      return match.ft_score;
    }
    console.warn(`mo matching match found for event: ${event.id}`);
    return null;
  } catch (error) {
    console.error(
      `error fetching historical data for event: ${event.id}`,
      error
    );
    throw error;
  }
};
