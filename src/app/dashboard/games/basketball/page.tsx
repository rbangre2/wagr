"use client";
import GamesLayout from "../GamesLayout";
import React from "react";
import SportsTable from "@/components/SportsTable/SportsTable";
import { BasketballData } from "@/app/dashboard/games/basketball/mock";

const basketballColumns = [
  { field: "homeTeam", headerName: "Home Team", width: 150 },
  { field: "awayTeam", headerName: "Away Team", width: 150 },
  { field: "conference", headerName: "Conference", width: 150 },
  { field: "arena", headerName: "Arena", width: 285 },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 150,
    valueGetter: (params: any) => new Date(params.row.date), // Convert string to Date object
  },
];

const BasketballGames = () => {
  return (
    <GamesLayout>
      {" "}
      <SportsTable
        title="Upcoming Basketball Games"
        columns={basketballColumns}
        data={BasketballData}
      />{" "}
    </GamesLayout>
  );
};

export default BasketballGames;
