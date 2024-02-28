import { Sport, League } from "@/models/Sport";

export type FilterSportsOption = {
  label: string;
  value: Sport;
};

export type FilterLeagueOption = {
  label: string;
  sport: Sport;
  value: League;
};

export const sportsOptions: FilterSportsOption[] = [
  { label: Sport.Soccer, value: Sport.Soccer },
  { label: Sport.Basketball, value: Sport.Basketball },
  { label: Sport.Hockey, value: Sport.Hockey },
  { label: Sport.Cricket, value: Sport.Cricket },
];

export const leagueOptions: FilterLeagueOption[] = [
  { label: League.NBA, sport: Sport.Basketball, value: League.NBA },
  { label: League.EPL, sport: Sport.Soccer, value: League.EPL },
  { label: League.Bundesliga, sport: Sport.Soccer, value: League.Bundesliga },
  {
    label: League.Euroleague,
    sport: Sport.Basketball,
    value: League.Euroleague,
  },
  { label: League.SerieA, sport: Sport.Soccer, value: League.SerieA },
  { label: League.LaLiga, sport: Sport.Soccer, value: League.LaLiga },
  { label: League.NHL, sport: Sport.Hockey, value: League.NHL },
];
