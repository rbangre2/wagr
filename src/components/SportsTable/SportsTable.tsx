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
  { field: "date", headerName: "Date", type: "date", width: 150 },
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
        paddingTop: "20px",
        backgroundColor: "black", // Set the background color to black
        color: "white", // Set the text color to white
        "& .MuiDataGrid-cell": {
          color: "lightgray", // Set the DataGrid cell text color to light gray
        },
        "& .MuiDataGrid-columnHeaders": {
          color: "white", // Set the DataGrid header text color to white
          backgroundColor: "#333", // Optional: Set a different background color for headers
        },
        "& .MuiDataGrid-footerContainer": {
          color: "white",
          backgroundColor: "#333",
        },
        "& .MuiTablePagination-root": {
          color: "white",
          backgroundColor: "#333",
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
          color: "white",
          border: 0,
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)", // Lighten the cell bordes
            fontFamily: "'Open Sans', sans-serif", // Apply the font to DataGrid cells
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-row:hover": {
            cursor: "pointer", // This will change the cursor to a pointer on hover
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
