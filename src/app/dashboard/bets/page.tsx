"use client";
import { Box, Typography } from "@mui/material";
import DashboardLayout from "../DashboardLayout";
import FilterRow from "@/components/FilterRow/FilterRow";
import styles from "./page.module.css";

export default function Bets() {
  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            marginBottom: "20px",
            fontFamily: "'PT Sans Narrow', sans-serif",
            fontWeight: 700,
            paddingRight: "20px",
          }}
        >
          Bet Market
        </Typography>
        <FilterRow></FilterRow>
      </Box>
    </DashboardLayout>
  );
}
