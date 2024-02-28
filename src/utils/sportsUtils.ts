import { League } from "@/models/Sport";

export const getLeagueIdFromName = (league: League | string): number => {
  if (league == League.LaLiga) {
    return 3;
  } else if (league == League.SerieA) {
    return 4;
  }
  return -1;
};
