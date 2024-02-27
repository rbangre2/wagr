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
    </DashboardLayout>
  );
}
