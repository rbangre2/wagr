import { League } from "@/models/Sport";

export const getLeagueIdFromName = (league: League | string): number => {
  if (league == League.LaLiga) {
    return 3;
  }
  return -1;
};
