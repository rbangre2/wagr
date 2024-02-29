"use client";
import { useEffect, useState } from "react";
import GamesLayout from "../GamesLayout";
import { Event } from "@/models/Event";
import { getEvents } from "@/services/sportsService";
import SportsTable from "@/components/SportsTable/SportsTable";
import {
  GridValueFormatterParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Image from "next/image";
import { leagueIcons } from "./types";

export default function SoccerGames() {
  const [data, setData] = useState<Event[]>([]);
  const tableTitle = "Upcoming Fixtures";

  const soccerColumns = [
    { field: "homeTeam", headerName: "Home Team", width: 150 },
    { field: "awayTeam", headerName: "Away Team", width: 150 },
    {
      field: "league",
      headerName: "League",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Image
            width={24}
            height={24}
            src={leagueIcons[params.value as string]}
            alt={params.value as string}
            style={{
              backgroundColor: "transparent",
            }}
          />
          {params.value}
        </div>
      ),
    },
    { field: "location", headerName: "Location", width: 285 },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      valueFormatter: (params: GridValueFormatterParams) => {
        if (params.value instanceof Date) {
          return params.value.toLocaleDateString();
        }
        return params.value;
      },
    },
  ];

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const fixtures = await getEvents();
        console.log(fixtures.length);
        setData(fixtures);
      } catch (error) {
        console.error("failed to fetch soccer data", error);
      }
    };

    fetchFixtures();
  }, []);
  return (
    <GamesLayout>
      <SportsTable title={tableTitle} columns={soccerColumns} data={data} />
    </GamesLayout>
  );
}
