"use client";
import GamesLayout from "../GamesLayout";
import React from "react";
import SportsTable from "@/components/SportsTable/SportsTable";
import { CricketData } from "@/app/dashboard/games/cricket/mock"; // Adjust path as needed

const cricketColumns = [
  { field: "homeTeam", headerName: "Home Team", width: 150 },
  { field: "awayTeam", headerName: "Away Team", width: 150 },
  { field: "matchType", headerName: "Match Type", width: 100 },
  { field: "venue", headerName: "Venue", width: 200 },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 150,
    valueGetter: (params: any) => new Date(params.row.date), // Convert string to Date object
  },
];

const CricketGames = () => {
  return (
    <GamesLayout>
      <SportsTable
        title="Upcoming Cricket Matches"
        columns={cricketColumns}
        data={CricketData}
      />
    </GamesLayout>
  );
};

export default CricketGames;
