"use client";
import GamesLayout from "../GamesLayout";
import React from "react";
import SportsTable from "@/components/SportsTable/SportsTable";
import { CricketData } from "@/app/dashboard/games/cricket/mock"; // Adjust path as needed
import { Box } from "@mui/material";

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
      <Box paddingTop="15px"> coming soon... </Box>
    </GamesLayout>
  );
};

export default CricketGames;
