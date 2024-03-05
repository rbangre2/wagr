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
        color: "black", // Text color black for contrast
        "& .MuiDataGrid-cell": {
          color: "black", // Ensure DataGrid cell text color is black for readability
        },
        "& .MuiDataGrid-columnHeaders": {
          color: "black", // Header text color black for contrast
          backgroundColor: "#f0f0f0", // Light gray background for column headers for subtle differentiation
        },
        "& .MuiDataGrid-footerContainer": {
          color: "black",
          backgroundColor: "#f0f0f0", // Light gray background for the footer for consistency
        },
        "& .MuiTablePagination-root": {
          color: "black",
          backgroundColor: "#f0f0f0", // Light gray background for pagination for consistency
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
          color: "black", // Text color black for title
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
          backgroundColor: "white", // Keep background color white for light theme
          border: 0,
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)", // Use a light gray for cell borders for subtlety
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
