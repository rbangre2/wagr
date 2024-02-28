interface SellOrder {
  user: string;
  minOdds: number;
  amount: number;
}

interface BuyOrder {
  user: string;
  maxOdds: number;
  amount: number;
}

export enum Sport {
  None = "None",
  Soccer = "Soccer",
  Basketball = "Basketball",
  Hockey = "Hockey",
  Cricket = "Cricket",
}

export enum League {
  None = "None",
  EPL = "English Premier League",
  LaLiga = "La Liga",
  SerieA = "Serie A",
  Bundesliga = "Bundesliga",
  NBA = "National Basketball Association",
  Euroleague = "Euroleague",
  NHL = "National Hockey League",
  ICL = "Indian Cricket League",
}

export interface Filter {
  sport: Sport;
  league: League;
}
