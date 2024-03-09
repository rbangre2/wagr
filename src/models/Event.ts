import firebase from "firebase/firestore";

export interface Event {
  id: string;
  homeTeam: string;
  homeId: number;
  awayTeam: string;
  awayId: number;
  league: string;
  location: string;
  date: firebase.Timestamp;
  time: string;
  status: "upcoming" | "live" | "recently finished" | "finished";
  competitionId: number;
  score?: string;
  result?: string;
}
