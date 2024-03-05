import React, { useState } from "react";
import { DataGrid, GridSortModel, GridRowParams } from "@mui/x-data-grid";
import { Typography, Box } from "@mui/material";
import PlaceBetModal from "../PlaceBetModal/PlaceBetModal";
import { Event } from "@/models/Event";

const defaultColumns = [
  { field: "homeTeam", headerName: "Home Team", width: 150 },
  { field: "awayTeam", headerName: "Away Team", width: 150 },
  { field: "league", headerName: "League", width: 150 },
  { field: "location", headerName: "Location", width: 285 },
  { field: "date", headerName: "Date", type: "date", width: 200 },
];

const sortModel: GridSortModel = [
  {
    field: "date",
    sort: "asc",
  },
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
  const [isBetModalOpen, setBetModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedEvent(params.row as Event);
    setBetModalOpen(true);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "white",
        color: "black",
        "& .MuiDataGrid-cell": {
          color: "black",
        },
        "& .MuiDataGrid-columnHeaders": {
          color: "black",
          backgroundColor: "#f0f0f0",
        },
        "& .MuiDataGrid-footerContainer": {
          color: "black",
          backgroundColor: "#f0f0f0",
        },
        "& .MuiTablePagination-root": {
          color: "black",
          backgroundColor: "#f0f0f0",
        },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontFamily: "'PT Sans Narrow', sans-serif",
          fontWeight: 700,
          fontSize: 35,
          color: "black",
        }}
      >
        {title}
      </Typography>
      <DataGrid
        rows={data}
        columns={columns}
        sortModel={sortModel}
        onRowClick={handleRowClick}
        sx={{
          color: "black",
          backgroundColor: "white",
          border: 0,
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 18,
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        }}
      />
      {selectedEvent && (
        <PlaceBetModal
          open={isBetModalOpen}
          onClose={() => setBetModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </Box>
  );
};

export default SportsTable;
