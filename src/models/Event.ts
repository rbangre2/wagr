export interface Event {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  location: string;
  date: Date;
  status: "Upcoming" | "Finished";
}
