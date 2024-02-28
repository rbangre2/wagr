import { Filter, Sport, League } from "@/app/dashboard/bets/types";

export interface WageringEvent {
  id: number;
  event: string;
  currentOdds: number;
  chart?: string;
  changePercent: number;
  volume: number;
  supply: number;
  sport: Sport;
  league: League;
}

export interface WageringEventTableProps {
  wageringEvents: WageringEvent[];
  filters: Filter;
}
