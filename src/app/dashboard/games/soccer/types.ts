import { GridValueFormatterParams } from "@mui/x-data-grid";

export const soccerColumns = [
  { field: "homeTeam", headerName: "Home Team", width: 150 },
  { field: "awayTeam", headerName: "Away Team", width: 150 },
  { field: "league", headerName: "League", width: 150 },
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
