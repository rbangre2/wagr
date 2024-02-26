import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box, Button } from "@mui/material";
import { fetchFootballGames } from '@/services/sportService'; // Ensure the path is correct
import { FootballMatch } from '@/models/FootballMatch';


const columns = [
  { field: "homeTeam", headerName: "Home Team", width: 150 },
  { field: "awayTeam", headerName: "Away Team", width: 150 },
  { field: "league", headerName: "League", width: 150 },
  { field: "date", headerName: "Date", type: "date", width: 150 },
  { field: "status", headerName: "Status", width: 110 },
];

export default function SoccerTable() {
  const [data, setData] = useState<FootballMatch[]>([]);

  const handleFetchGames = async () => {
    const games = await fetchFootballGames();
    setData(games);
  };

  return (
    <Box style={{ height: "100%", width: "100%", paddingTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Soccer Games
      </Typography>
      <Button variant="contained" color="primary" onClick={handleFetchGames}>
        Fetch Games
      </Button>
      <DataGrid
        rows={data}
        columns={columns}
      />
    </Box>
  );
}
