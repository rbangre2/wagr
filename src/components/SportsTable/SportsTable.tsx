import React from "react";
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";

const defaultColumns = [
  { field: "homeTeam", headerName: "Home Team", width: 150 },
  { field: "awayTeam", headerName: "Away Team", width: 150 },
  { field: "league", headerName: "League", width: 150 },
  { field: "location", headerName: "Location", width: 285 },
  { field: "date", headerName: "Date", type: "date", width: 150 },
];

const SportsTable = ({
  title,
  columns = defaultColumns,
  data,
}: {
  title: string;
  columns?: any[];
  data: any[];
}) => {
  const sortModel: GridSortModel = [
    {
      field: "date",
      sort: "asc",
    },
  ];
  return (
    <Box style={{ height: "100%", width: "100%", paddingTop: "20px" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <DataGrid
        rows={data}
        columns={columns}
        sortModel={sortModel}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default SportsTable;
