"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import DashboardLayout from "../DashboardLayout";
import FilterRow from "@/components/FilterRow/FilterRow";
import styles from "./page.module.css";
import WageringEventTable from "@/components/WageringEventTable/WageringEventTable";
import { eventsData } from "./mock";
import { Sport, League, Filter } from "./types";

export default function Market() {
  const [wageringEvents, setWageringEvents] = useState(eventsData);
  const [filters, setFilters] = useState<Filter>({
    sport: Sport.None,
    league: League.None,
  });

  const handleApplyFilters = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      sport: Sport.None,
      league: League.None,
    });
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              marginTop: "-15px",
              fontFamily: "'PT Sans Narrow', sans-serif",
              fontSize: 100,
              fontWeight: 700,
              paddingRight: "30px",
            }}
          >
            Market
          </Typography>
          <FilterRow
            initFilter={filters}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          ></FilterRow>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "75vh",
            alignItems: "left",
            justifyContent: "left",
          }}
        >
          <WageringEventTable
            filters={filters}
            wageringEvents={wageringEvents}
          />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
