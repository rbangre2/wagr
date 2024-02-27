"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import DashboardLayout from "../DashboardLayout";
import FilterRow from "@/components/FilterRow/FilterRow";
import styles from "./page.module.css";
import WageringEventTable from "@/components/WageringEventTable/WageringEventTable";
import { eventsData } from "./mock";

export default function Bets() {
  const [wageringEvents, setWageringEvents] = useState(eventsData);
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
            Bet Market
          </Typography>
          <FilterRow></FilterRow>
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
          <WageringEventTable wageringEvents={wageringEvents} />
        </Box>
      </Box>
    </DashboardLayout>
  );
}
