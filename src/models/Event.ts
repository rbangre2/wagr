export interface Event {
  id: string;
  homeTeam: string;
  homeId: number;
  awayTeam: string;
  awayId: number;
  league: string;
  location: string;
  date: Date;
  time: string;
  status: "Upcoming" | "Finished";
  competition_id: number;
  score?: string;
  result?: string;
}
