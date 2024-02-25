import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";
import { data } from "./mock";

const columns = [
  { field: "homeTeam", headerName: "Home Team", width: 150 },
  { field: "awayTeam", headerName: "Away Team", width: 150 },
  { field: "league", headerName: "League", width: 150 },
  { field: "location", headerName: "Location", width: 285 },
  { field: "date", headerName: "Date", type: "date", width: 150 },
];

export default function SoccerTable() {
  return (
    <Box style={{ height: "100%", width: "100%", paddingTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Soccer Games
      </Typography>
      <DataGrid rows={data} columns={columns} disableRowSelectionOnClick />
    </Box>
  );
}
