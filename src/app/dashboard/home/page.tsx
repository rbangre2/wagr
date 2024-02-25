"use client";
import React from "react";
import DashboardLayout from "../DashboardLayout";
import Typography from "@mui/material/Typography";

const HomePage: React.FC = () => {
  return (
    <DashboardLayout>
      <Typography variant="h4" gutterBottom>
        Home Page Content
      </Typography>
      {/* Add the rest of your home page content here */}
    </DashboardLayout>
  );
};

export default HomePage;
