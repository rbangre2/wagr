import React, { ReactNode } from "react";
import SportsBar from "@/components/SportsBar/SportsBar";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import { Box } from "@mui/material";

interface GamesLayoutProps {
  children: ReactNode;
}

const GamesLayout: React.FC<GamesLayoutProps> = ({ children }) => {
  return (
    <DashboardLayout>
      <SportsBar />
      <Box sx={{ width: "100%", height: "72vh" }}>{children}</Box>
    </DashboardLayout>
  );
};

export default GamesLayout;
